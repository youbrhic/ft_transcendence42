import { Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { Server as IOServer } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { createGame, getGame, addPlayerToGame, games } from './gameManager';
import { cleanupGame } from './gameUtils';

interface AuthenticatedSocket extends Socket {
	user?: any;
  }
  
  interface pongGameHandlersProps {
	fastify: FastifyInstance;
	io: IOServer;
	socket: AuthenticatedSocket;
  }
  
export const userSockets = new Map<number, string>();
  
export default function inviteGameHandlers({ fastify, io, socket }: pongGameHandlersProps) {
	socket.on('invite-game', ({ opponent, playerName }) => {
	
		const opponentId = typeof opponent === 'string' ? parseInt(opponent) : opponent;
		const senderId = typeof playerName === 'string' ? parseInt(playerName) : playerName;

		for (const [roomId, game] of games.entries()) {
			if (game.players.includes(parseInt(opponent)) || game.players.includes(parseInt(playerName))) {
				socket.emit('error', { message: 'Opponent is already in a game' });
				return;
			}
		}
	
		let roomId = uuidv4();
		createGame(roomId);
		
		addPlayerToGame({
		  roomId,
		  playerName: String(opponentId),
		  socketId: '',
		});
	
		addPlayerToGame({
		  roomId,
		  playerName: String(senderId),
		  socketId: socket.id,
		});
	

		socket.join(roomId);
		const game = getGame(roomId);
		const playerIndex = game?.players.indexOf(String(senderId));
		socket.emit('init', { player: playerIndex });
		socket.emit('roomId', roomId);
		
		// Get user info and send notification
		fastify.db.get(
		  'SELECT id, username FROM user_authentication WHERE id = ?',
		  [opponentId],
		  (err: Error | null, opponentUser: { id: number, username: string }) => {
			if (err || !opponentUser) {
			  socket.emit('error', { message: 'Opponent not found' });
			  cleanupGame(roomId);
			  return;
			}
	
			fastify.db.get(
			  'SELECT id, username FROM user_authentication WHERE id = ?',
			  [senderId],
			  (err: Error | null, senderUser: { id: number, username: string }) => {
				if (err || !senderUser) {
				  socket.emit('error', { message: 'Authentication required' });
				  cleanupGame(roomId);
				  return;
				}
	
				// Send only real-time notification (no database storage)
				io.emit('pong-invite-notification', {
				  recipientId: opponentId,
				  senderId: senderId,
				  sender: senderUser.username,
				  receiver: opponentUser.username,
				  type: 'pong_invite',
				  text: `${roomId}:${senderUser.username}`,
				  timestamp: new Date().toISOString(),
				  gameRoomId: roomId
				});
	
				
				socket.emit('invite-sent', { 
				  message: `Pong invite sent`,
				  roomId 
				});
	
				// Set timeout to clean up expired game room
				setTimeout(() => {
				  const currentGame = getGame(roomId);
				  if (currentGame?.ready === false)
					cleanupGame(roomId);
				}, 60000);
			  }
			);
		  }
		);
	  });
	
	  socket.on('accept-invite', ({ roomId, playerName }) => {		
		const playerId = typeof playerName === 'string' ? parseInt(playerName) : playerName;
		const playerIdString = String(playerId);
		
		const game = getGame(roomId);
		if (!game) {
		  socket.emit('error', { message: 'Game room not found or expired' });
		  return;
		}
	
		// Check if player is part of this game
		const playerIndex = game.players.indexOf(playerIdString);
		if (playerIndex === -1) {
		  socket.emit('error', { message: 'You are not part of this game' });
		  return;
		}
	
		// Update socket ID for accepting player
		const player = game.playerNamesAndsockId.find(p => p.name === playerIdString);
		if (player) {
		  player.sockId = socket.id;
		}
	
		socket.join(roomId);
		socket.emit('init', { player: playerIndex });
		socket.emit('roomId', roomId);
	
		// Check if both players are now connected
		const connectedSockets = io.sockets.adapter.rooms.get(roomId);
	
		if (connectedSockets && connectedSockets.size === 2) {
		  
		  // Notify both players that the game is starting
		  io.to(roomId).emit('game-starting', {
			message: 'Both players connected! Redirecting to game...',
			roomId: roomId
		  });
		  
		  // Start countdown after a short delay to allow for navigation
		  setTimeout(() => {
			game.gameType = "remote";
			game.ready = false;
			let countdown = 3;
	
			const countdownInterval = setInterval(() => {
			  io.to(roomId).emit('countdown', countdown);
			  countdown--;
	
			  if (countdown < 0) {
				clearInterval(countdownInterval);
				io.to(roomId).emit('ready');
				game.ready = true;
			  }
			}, 1000);
		  }, 2000);
		  
		}
	  });
	
	  socket.on('refuse-invite', ({ roomId, playerName }) => {
		const game = getGame(roomId);
		if (game !== undefined && game.ready === false) {
		  cleanupGame(roomId);
		  io.emit('user-refused-game', playerName);
		}
	  });
}