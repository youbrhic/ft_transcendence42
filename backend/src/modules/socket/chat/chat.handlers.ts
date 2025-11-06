import { FastifyInstance } from "fastify";
import { Server as IOServer } from "socket.io";
import { AuthenticatedSocket } from "../pong/interfaces";

interface handleChatEventsProps {
  fastify: FastifyInstance;
  io: IOServer;
  socket: AuthenticatedSocket;
}

interface Message {
  id?: number;
  senderId: number;
  recipientId: number;
  text: string;
  timestamp?: string;
  blocked?: boolean;
}

export const userSockets = new Map<number, string>();

export function getNameById( fastify: FastifyInstance, id: number ): Promise<string> {
  return new Promise((resolve, reject) => {
    fastify.db.get( "SELECT username FROM user_authentication WHERE id = ?", [id],
      (err, row: string) => {
        if (err)
          reject(err);
        else
          resolve(row);
      }
    );
  });
}

export default function handleChatEvents({ fastify, io,  socket, }: handleChatEventsProps) {

  const db = fastify.db;

  const userData = socket.user;
  if (userData) {
    userSockets.set(userData.userid, socket.id)
    socket.join(userData.userid.toString());
  }

  
  socket.on("chat:message", (data: Message) => {

    const { senderId, recipientId, text } = data;
    
    if (!senderId || !recipientId || !text)
      return;
    
    db.get(
      "SELECT 1 FROM blocked_users WHERE (blocker = ? AND blocked = ?) OR (blocker = ? AND blocked = ?)",[senderId, recipientId, senderId],
      (err, row) => {

        if (err || row) {
          return;
        }

        db.run(
          "INSERT INTO messages (id_sender, id_recipient, text, timestamp) VALUES (?, ?, ?, ?)",
          [senderId, recipientId, text, new Date().toISOString()],
          async function (err) {
            if (err) {
              console.log("error in the inserting of the messages, and the error is : ", err );
              return;
            }
            
            const messageData: Message = {
              id: this.lastID,
              senderId,
              recipientId,
              text,
              timestamp: new Date().toISOString(),
            };
            
            const senderRow: any = await getNameById(fastify, senderId);
            const receiverRow: any = await getNameById(fastify, recipientId);
            
            const sender = senderRow?.username;
            const receiver = receiverRow?.username;


            db.run(
              "INSERT INTO notification (id_sender, id_receiver, sender, receiver, type, text, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [senderId, recipientId, sender, receiver, "message", text, new Date().toISOString()],
              function (err: Error | null) { 
                if (err) {
                  console.error("Error inserting message notification:", err.message);
                  return;
                }
            
                const notification = {
                  id: this.lastID,
                  id_sender: senderId,
                  id_receiver: recipientId,
                  sender,
                  receiver,
                  type: "message",
                  text,
                  seen: false,
                  timestamp: new Date().toISOString(),
                };

                io.to(recipientId.toString()).emit("notification", notification);
              }
            );

            io.to(senderId.toString()).emit("chat:message", messageData);
            io.to(recipientId.toString()).emit("chat:message", messageData);
          }
        );
      }
    );
  });

  socket.on("notif:seen", (notifications) => {
  
    if (!notifications?.length)
      return;
  
    notifications.forEach((notif: any) => {
      if (!notif.id) {
        return;
      }
  
      db.run(
        `UPDATE notification SET seen = 1 WHERE id = ?`, [notif.id],
        (err) => {
          if (err)
            console.error(` Error updating notif ${notif.id}:`, err.message);
          else
            console.log(` Notification ${notif.id} marked as seen`);
        }
      );
    });
  });

  socket.on("notification:count", (userId) => {
    db.get(
      `SELECT COUNT(*) AS unseenCount FROM notification WHERE id_receiver = ? AND seen = 0`, [userId],
      (err, row: any) => {
        if (err) {
          console.error("Error counting unseen notifications:", err.message);
          return;
        }
  
        const count = row?.unseenCount || 0;
        socket.emit("notification:getcount", count);  
      }
    );
  });

  socket.on("notification:insert", (notif) => {
    
    if (!notif) {
      console.log("Err : notif id empty");
      return;
    }

    const textValue = notif.message || `${notif.type || "Notification"} from ${notif.sender || "Unknown"}`;
    const senderValue = notif.sender || "Unknown";
    const receiverValue = notif.receiver || "Unknown";
    const typeValue = notif.type || "General";
    const timestampValue = notif.timestamp || new Date().toISOString();

    db.run(
      `INSERT INTO notification (id_sender, id_receiver, sender, receiver, type, text, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        notif.senderId,
        notif.recipientId,
        senderValue,
        receiverValue,
        typeValue,
        textValue,
        timestampValue,
      ],
      (err) => {
        if (err) {
          console.log("Err inserting notification:", err.message);
          return;
        }
      }
    );
  });

  socket.on("notification:get", (userId: number) => {
    
    db.all(
      "SELECT * FROM notification WHERE id_receiver = ? ORDER BY timestamp DESC LIMIT 50",[userId],
      (err, rows: any) => {
        if (err) {
          console.error("DB error in notification:get:", err.message);
          return;
        }

        socket.emit("notification:list", rows);
      }
    );
  });

  socket.on("notification:clear", (userId: Number) => {
    db.run("DELETE  FROM notification WHERE id_receiver = ?  ", [userId]);
  });

  socket.on("chat:delete", ({ id, userId }: { id: number; userId: number }) => {
    if (!id || !userId)
      return;

    db.get(
      "SELECT id_sender, id_recipient FROM messages WHERE id = ?",[id],
      (err, row: any) => {

        if (err || !row)
          return;

        const { id_sender, id_recipient } = row;
        if (id_sender !== userId)
          return;

        db.run("DELETE FROM messages WHERE id = ?", [id], (err) => {
          if (err)
            return;

          io.to(id_sender.toString()).emit("chat:deleted", { id });
          io.to(id_recipient.toString()).emit("chat:deleted", { id });
        });
      }
    );
  });

  socket.on("request:history",({ senderId, recipientId }: { senderId: number; recipientId: number }) => {

      db.all(
        "SELECT id, id_sender AS senderId, id_recipient AS recipientId, text, timestamp FROM messages WHERE (id_sender = ? AND id_recipient = ?) OR (id_sender = ? AND id_recipient = ?) ORDER BY timestamp ASC",
        [senderId, recipientId, recipientId, senderId],
        (err, rows: Message[]) => {
          if (err)
            return;
          socket.emit("chat:history", rows);
        }
      );
    }
  );

  socket.on("block:user",({ blockerId, blockedId }: { blockerId: number; blockedId: number }) => {
      db.run(
        "INSERT OR IGNORE INTO blocked_users (blocker, blocked) VALUES (?, ?)",
        [blockerId, blockedId]
      );
    }
  );

  socket.on("unblock:user",({ blockerId, blockedId }: { blockerId: number; blockedId: number }) => {

      db.run("DELETE FROM blocked_users WHERE blocker = ? AND blocked = ?", [
        blockerId,
        blockedId,
      ]);

    }
  );
}