import { FastifyInstance } from "fastify";
import { Server as IOServer, Socket } from "socket.io";
import { tournaments } from "./tournamentStore"; // Adjust path accordingly
import { games } from "./gameManager";

interface AuthenticatedSocket extends Socket {
  user?: any;
}

export default function tournamentHandlers({
  fastify,
  io,
  socket,
}: {
  fastify: FastifyInstance;
  io: IOServer;
  socket: AuthenticatedSocket;
}) {
  socket.on("join-tournament-room", (tournamentId: string) => {
    const tournament = tournaments[tournamentId];
    if (tournament) {
      socket.join(`tournament:${tournamentId}`);
    }
  });
  
  socket.on("leave-tournament-room", ({ userId, tournamentId }: { userId: string; tournamentId: string }) => {
    const tournament = tournaments[tournamentId];
    if (tournament) {
      socket.leave(`tournament:${tournamentId}`);
    }
  });

  socket.on('addToRoom', (playerName) => {

    for (const roomId of games.keys()) {
      const game = games.get(roomId);
      if (game?.players.includes(String(playerName))) {
        socket.join(roomId);
        if (!game.readyPlayers.includes(String(playerName))) {
          game.readyPlayers.push(String(playerName));
        }
        break;
      }
    }
  });
}

