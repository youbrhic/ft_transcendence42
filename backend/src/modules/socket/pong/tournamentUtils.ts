import { Server as IOServer } from "socket.io";
import { FastifyInstance } from 'fastify';
import { tournaments } from "./tournamentStore";
import { games } from "./gameManager";
import { cleanupGame, handlePlayerForfeit } from "./gameUtils";
import { Tournament } from "./tournamentStore";
import { addNewHistory } from "../../../utils/profile.utils";

export function handleTournamentCompletion(io: IOServer, tournament: any) {
	let completionCountdown = 30;
	tournament.countdown = completionCountdown;
	tournament.status = 'completed';

	const countdownInterval = setInterval(() => {
		completionCountdown--;
		tournament.countdown = completionCountdown;

		if (completionCountdown <= 0) {
			clearInterval(countdownInterval);
			tournament.countdown = null;

			setTimeout(() => {
				delete tournaments[tournament.id];
				io.emit('tournaments_updated', Object.values(tournaments));
			}, 2000);

			io.to(`tournament:${tournament.id}`).emit('tournament:state', tournament);
		} else {
			io.to(`tournament:${tournament.id}`).emit('tournament:state', tournament);
		}
	}, 2000);
}

// Function to handle player leaving
export function handlePlayerLeft(fastify:FastifyInstance, io: IOServer, roomId: string, playerName: string | undefined, tournament: any, game: any) {
	if (tournament) {
		const match = tournament.matches.find((m: any) => m.roomId === roomId);
		if (match && match.progress !== 'completed') {
			io.to(roomId).emit('playerLeft', playerName);
			match.progress = 'completed';
			if (playerName) {
				tournament.losers.push(playerName);
				tournament.winners = tournament.winners.filter((p: string) => p !== playerName);
			}
			tournament.losers = tournament.losers.filter((p: string) => p !== game?.readyPlayers[0]);

			const remainingPlayer = game?.players.find((p: string) => p !== playerName) || null;

			handlePlayerForfeit(
				{ [tournament.id]: tournament },
				roomId,
				playerName,
				remainingPlayer,
				io);
			addNewHistory(
				fastify,
				parseInt(remainingPlayer),
				parseInt(playerName || ""),
				game.state.score,
				"Pong",
				false,
			);
			
			cleanupGame(roomId);

			if (tournament.winners.length == 1 && tournament.matches.every((m: any) => m.progress === 'completed'))
				handleTournamentCompletion(io, tournament);

			io.to(`tournament:${tournament.id}`).emit('tournament-updated', tournament);
		}
	}
}


/**
 * Handles the logic when a player leaves a tournament game.
 */
export function handleTournamentPlayerLeft(fastify:FastifyInstance, io: IOServer, roomId: string, game: any, playerName: string, remainingPlayer: string | undefined) {
	if (remainingPlayer) {
		// Mark the game as completed
		game.progress = 'completed';
		game.winner = remainingPlayer;
		game.loser = playerName;

		// Notify the remaining player
		io.to(roomId).emit('gameOver', { winner: remainingPlayer });

		// Update the tournament state
		Object.values(tournaments).forEach((tournament: Tournament) => {
			if (!updateTournamentState(io, tournament, roomId, playerName, remainingPlayer)) return;

			// Check if the tournament is completed
			const allMatchesCompleted = tournament.matches.every(m => m.progress === 'completed');
			if (tournament.winners.length === 1 && allMatchesCompleted) {
				handleTournamentCompletion(io, tournament);
			}
		});
	} else {
		// No remaining player, mark the game as cancelled
		game.progress = 'completed';
		game.winner = game.readyPlayers.filter((p: string) => p !== playerName)[0] || null;
		game.loser = playerName;
	}
	handlePlayerForfeit(tournaments, roomId, playerName, remainingPlayer || null, io);
	addNewHistory(
		fastify,
		parseInt(remainingPlayer || ""),
		parseInt(playerName),
		game.state.score,
		"Pong",
		false,
	  );
	cleanupGame(roomId);
}

/**
* Updates the tournament state when a player leaves.
*/
function updateTournamentState(io:IOServer, tournament: Tournament, roomId: string, playerName: string, remainingPlayer: string | undefined): boolean {
	// Check if the tournament contains the match
	const match = tournament.matches.find(m => m.roomId === roomId);
	if (!match) return false;

	// Remove the leaving player from winners and add to losers
	if (tournament.winners.includes(playerName)) {
		tournament.winners = tournament.winners.filter(player => player !== playerName);
	}
	if (!tournament.losers.includes(playerName)) {
		tournament.losers.push(playerName);
	}

	// Ensure the remaining player is in the winners list and not in the losers list
	if (remainingPlayer) {
		if (!tournament.winners.includes(remainingPlayer)) {
			tournament.winners.push(remainingPlayer);
		}
		tournament.losers = tournament.losers.filter(player => player !== remainingPlayer);
	}

	// Update the match details
	match.progress = 'completed';
	match.winner = remainingPlayer;
	match.loser = playerName;

	// Broadcast updates
	io.to(`tournament:${tournament.id}`).emit('tournament-updated', tournament);
	io.to(`tournament:${tournament.id}`).emit('tournament-match-update', {
		tournamentId: tournament.id,
		roomId: roomId,
		winner: remainingPlayer,
		loser: playerName,
		status: 'completed',
		finalScore: { left: 0, right: 7 } // Default forfeit score
	});

	return true;
}