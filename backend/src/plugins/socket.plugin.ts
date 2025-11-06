import { Server as IOServer, Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import createAuthMiddleware from "../modules/socket/userdata/auth.middleware";
import  handleChatEvents  from "../modules/socket/chat/chat.handlers"
import  handleGameEvents  from "../modules/socket/tictactoe/game.handlers";
import handleUserEvents from "../modules/socket/userdata/user.handlers"
import pongGameHandlers from "../modules/socket/pong/pong.game.handlers";
import tournamentHandlers from "../modules/socket/pong/tournamentHandlers";
// import inviteGameHandlers from "../modules/socket/pong/inviteGameHandlers";
import inviteGameHandlers from "../modules/socket/pong/inviteGameHandlers";

import { startGameLoop } from "../modules/socket/pong/gameLoop";


// const userSockets = new Map<string, string>();
export default function setupSocketIO(fastify: FastifyInstance, io: IOServer) {
    const db = fastify.db;
    const authMiddleware = createAuthMiddleware(fastify);
    io.use(authMiddleware);

    io.on("connection", (socket) => {
      // console.log("===============================> start : ", socket)
      // console.log("===============================> end : ")
      handleUserEvents({fastify, io, socket});
      handleChatEvents({fastify, io, socket});
      handleGameEvents({fastify, io, socket});
      pongGameHandlers({fastify, io, socket});
      tournamentHandlers({ fastify, io, socket});
      inviteGameHandlers({ fastify, io, socket});
      
      socket.on("disconnect", () => {
        console.log("", socket.id);
        console.log("---------------> User disconnected:", socket.user);
        socket.online = false;

      });
    });
    startGameLoop({fastify, io});
}
