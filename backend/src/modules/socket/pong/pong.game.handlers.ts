import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { Server as IOServer } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { createGame, getGame, addPlayerToGame, games, paddleDirections } from './gameManager';
import { handleTournamentPlayerLeft } from "./tournamentUtils";
import { cleanupGame } from "./gameUtils";
import { addNewHistory } from "../../../utils/profile.utils";

interface AuthenticatedSocket extends Socket {
  user?: any;
}

interface pongGameHandlersProps {
  fastify: FastifyInstance;
  io: IOServer;
  socket: AuthenticatedSocket;
}

export const userSockets = new Map<number, string>();

export default function pongGameHandlers({ fastify, io, socket }: pongGameHandlersProps) {
  const userData = socket.user;

  // Add user to socket mapping when they connect
  if (userData?.id) {
    userSockets.set(userData.id, socket.id);
  }

  socket.on('join', (playerName) => {
    let roomId: string | null = null;
    let isReconnecting = false;


    for (const [id, game] of games.entries()) {
      const playerIndex = game.players.indexOf(playerName);

      if (playerIndex !== -1) {
        // Reconnect: update socket ID
        const existingPlayer = game.playerNamesAndsockId.find(p => p.name === playerName);
        if (existingPlayer) {
          existingPlayer.sockId = socket.id;
        }

        if (game.gameType === "tournament")
          return;
        roomId = id;
        isReconnecting = true;
        break;
      }

      if (!roomId && game.players.length < 2) {
        roomId = id;
      }
    }

    if (isReconnecting) {
      socket.join(roomId!);
      const game = getGame(roomId!);
      const playerIndex = game?.players.indexOf(playerName);
      socket.emit('init', { player: playerIndex });
      socket.emit('roomId', roomId);

      if (game?.players.length === 2 && game.ready) {
        socket.emit('ready');
      }
      return;
    }

    // New game or join open room
    if (!roomId) {
      roomId = uuidv4();
      createGame(roomId);
    }

    const success = addPlayerToGame({
      roomId,
      playerName,
      socketId: socket.id,
    });

    if (!success) {
      socket.emit('full');
      return;
    }

    socket.join(roomId);
    const game = getGame(roomId);
    const playerIndex = game?.players.indexOf(playerName);
    socket.emit('init', { player: playerIndex });
    socket.emit('roomId', roomId);

    if (game?.players.length === 2) {
      game.gameType = "remote"
      const allConnected = game.playerNamesAndsockId.every(p =>
        io.sockets.sockets.get(p.sockId)
      );

      if (allConnected) {
        game.ready = false; // lock game until countdown finishes
        let countdown = 3;

        const countdownInterval = setInterval(() => {
          io.to(roomId!).emit('countdown', countdown);
          countdown--;

          if (countdown < 0) {
            clearInterval(countdownInterval);
            io.to(roomId!).emit('ready');
            game.ready = true;
          }
        }, 1000);
      }
    }
  });

  socket.on('paddleMove', ({ side, direction, state, roomId, playerName }) => {
    const game = getGame(roomId);
    if (!game || !game.players.includes(playerName) || !game.ready) return; // prevent movement until ready

    if (!paddleDirections.has(roomId)) {
      paddleDirections.set(roomId, new Map());
    }

    const inputs = paddleDirections.get(roomId);
    if (!inputs.has(playerName)) {
      inputs.set(playerName, { side, direction: 0 });
    }

    const input = inputs.get(playerName);
    input.direction = state === 'start' ? direction : 0;
  });

  socket.on('scoreUpdate', ({ roomId, score }) => {
    const game = getGame(roomId);
    if (game) {
      game.state.score = score;
      io.to(roomId).emit('gameState', game.state);
    }
  });

  socket.on('playerLeft', (playerName) => {  
    for (const [roomId, game] of games.entries()) {
      const playerIndex = game.players.indexOf(playerName);
      if (playerIndex === -1) continue;
  
      
      // Remove player from the game
      if (game.progress === 'completed')
          return;
      game.players.splice(playerIndex, 1);
      game.playerNamesAndsockId = game.playerNamesAndsockId.filter(p => p.name !== playerName);
      io.to(roomId).emit('playerLeft', playerName);
      game.ready = false;
  
      // Determine the remaining player
      const remainingPlayer = game.players[0];
  
      if (game.gameType === "tournament") {
        handleTournamentPlayerLeft(fastify, io, roomId, game, playerName, remainingPlayer);
      } else {
        if (remainingPlayer)
          io.to(roomId).emit('gameOver', { winner: remainingPlayer });
        addNewHistory(
          fastify,
          parseInt(remainingPlayer),
          parseInt(playerName),
          game.state.score,
          "Pong",
          false,
        );
        cleanupGame(roomId);
      }
  
      break;
    }
  });

  socket.on('disconnect', () => {
    if (userData?.id) {
      userSockets.delete(userData.id);
    }

    // Clean paddle input state
    for (const [roomId, inputs] of paddleDirections.entries()) {
      for (const [playerName] of inputs.entries()) {
        const player = games.get(roomId)?.playerNamesAndsockId.find(p => p.name === playerName);
        if (player?.sockId === socket.id) {
          inputs.delete(playerName);
        }
      }
      if (inputs.size === 0) {
        paddleDirections.delete(roomId);
      }
    }

    // Handle game cleanup
    for (const [roomId, game] of games.entries()) {
      const idx = game.playerNamesAndsockId.findIndex(p => p.sockId === socket.id);

      if (idx !== -1) {
        const playerName = game.playerNamesAndsockId[idx].name;
        game.players.splice(idx, 1);
        game.playerNamesAndsockId.splice(idx, 1);
        game.ready = false;

        io.to(roomId).emit('playerLeft', playerName);
        io.to(roomId).emit('gameOver', { winner: game.players[0] });

        const remainingPlayer = game.players[0];
        if (game.gameType == "tournament")
          handleTournamentPlayerLeft(fastify, io, roomId, game, playerName, remainingPlayer);
        else {
          if (remainingPlayer)
            io.to(roomId).emit('gameOver', { winner: remainingPlayer });
          addNewHistory(
            fastify,
            parseInt(remainingPlayer),
            parseInt(playerName),
            game.state.score,
            "Pong",
            false,
          );
          cleanupGame(roomId);
        }
        break;
      }
    }
  });


}
