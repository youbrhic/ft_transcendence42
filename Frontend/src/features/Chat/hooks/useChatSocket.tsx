
import { useEffect, useRef, useState } from "react";
import socket from "../services/socket";
import type { User } from "../types/User";

interface Message {
  id?: string | number;
  recipientId: number;
  senderId: number;
  text: string;
  timestamp: string;
}

export const useChatSocket = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});

  const usersRef = useRef<User[]>([]);
  const currentUserRef = useRef<number | null>(null);
  const requestedHistoryRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!socket.connected)
      socket.connect();
    socket.emit("request:init");
    socket.emit("get-my-profile");

    socket.on("friends:list", (backendUsers: User[]) => {
      setUsers(backendUsers);
      usersRef.current = backendUsers;
    });

    socket.on( "profile-data",(data: { id: number; username: string; online: boolean }) => {
        currentUserRef.current = data.id;
        setCurrentUser({
          id: data.id,
          username: data.username,
          online: data.online,
        });
      }
    );

    socket.on("chat:history", (history: Message[]) => {
      if (!history.length)
        return;
      const contactId = history[0].senderId === currentUserRef.current ? history[0].recipientId : history[0].senderId;
      setMessages((prev) => ({ ...prev, [contactId]: history }));
    });

    socket.on("chat:message", (msg: Message) => {
      const userId = msg.senderId === currentUserRef.current ? msg.recipientId : msg.senderId;
      setMessages((prev) => ({
        ...prev,
        [userId]: [...(prev[userId] || []), msg],
      }));

      if (msg.senderId !== currentUserRef.current)
        setUnreadCounts((prev) => ({
          ...prev,
          [userId]: (prev[userId] || 0) + 1,
        }));
    });

    socket.on("chat:deleted", ({ id }: { id: number | string }) => {
      setMessages((prev) => {
        const updated = { ...prev };
        for (const key in updated) {
          updated[key] = updated[key].filter((msg) => msg.id !== id);
        }
        return updated;
      });
    });

    socket.on( "user:status", ({ id, online }: { id: number; online: boolean }) => {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, online } : u))
        );
      }
    );

    return () => {
      socket.off("friends:list");
      socket.off("profile-data");
      socket.off("chat:history");
      socket.off("chat:message");
      socket.off("chat:deleted");
      socket.off("user:status");
    };
  }, []);


  useEffect(() => {
    if (!currentUserRef.current || users.length === 0) return;
    users.forEach((user) => {
      if (!requestedHistoryRef.current.has(user.id)) {
        requestedHistoryRef.current.add(user.id);
        socket.emit("request:history", {
          senderId: currentUser?.id,
          recipientId: user.id,
        });
      }
    });
  }, [users]);

  return {
    socket,
    users,
    messages,
    currentUser,
    unreadCounts,
    setUnreadCounts,
    setMessages,
    currentUserRef,
  };
};
