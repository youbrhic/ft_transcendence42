import { FastifyInstance } from 'fastify';
import { getuserid } from './settings.utils';
import { resolve } from 'path';
import { rejects } from 'assert';

export interface history {
	Winnerid: number;
	Loserid: number;
	Game: string;
	Score: string;
	date: string;
	draw: boolean;
}

export interface game_state {
	win: number;
	lose: number;
	draw: number;
	matches: number;
};

export interface PlayerState {
	total_xp: number;
	level: number;
};

export interface PlayerHistory {
	opponent_name: string;
	result: string;
	date: string;
	score: string;
	game_type: string;
};

export function getPlayerState(fastify: FastifyInstance, userid: number): Promise<PlayerState | null> {
	return new Promise((resolve, reject) => {
		console.log("=========> : userid :", userid);
		fastify.db.get(
			`SELECT total_xp, level FROM player_state WHERE  userid = ?`,
			[
				userid
			],
			(err: Error | null, rom: PlayerState) => {
				if (err) reject(err);
				console.log("=========> : rom :", rom);
				resolve(rom);
			}
		);
	})
}

export function addNewPlayerState(fastify: FastifyInstance, userid: number): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			`INSERT INTO player_state (userid) VALUES (?)`,
			[
				userid
			],
			(err) => {
				if (err)
					return reject(err);
				resolve();
			}
		);
	});
}

export function addNewMatch(fastify: FastifyInstance, macthinfo: history): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			`INSERT INTO game_history (Winnerid, Loserid, Game, Score, Date, draw)
		 		VALUES (?, ?, ?, ?, ?, ?)`,
			[
				macthinfo.Winnerid,
				macthinfo.Loserid,
				macthinfo.Game,
				macthinfo.Score,
				macthinfo.date,
				macthinfo.draw
			],
			(err) => {
				if (err) return reject(err);
				resolve();
			}
		);
	});
}

export async function updatePlayerState(fastify: FastifyInstance, userid: number): Promise<void> {
	const gameinfo: game_state = await getUserGameStats(fastify, userid);
	// const total_xp: number = gameinfo.draw * 50 + gameinfo.win * 100 + gameinfo.lose * 25;
	const total_xp: number = gameinfo.draw * 50 + gameinfo.win * 100;

	console.log("########## gameinfo", gameinfo);
	return new Promise((resolve, rejects) => {
		fastify.db.run(
			`UPDATE player_state SET total_xp = ? where userid = ?`,
			[
				total_xp,
				userid
			],
			(err) => {
				if (err) {
					return rejects(err);
				}
				resolve();
			}
		);
	})
}

async function resolveUserId(fastify: FastifyInstance, input: string | number): Promise<number | null> {
	if (typeof input === 'number') {
		return input;
	} else {
		return await getuserid(fastify, input);
	}
}

export async function addNewHistory(fastify: FastifyInstance, Winner: string | number, Loser: string | number, Sore: { left: number, right: number }, type: string, draw: boolean) {
	try {
		console.log("reason : ", draw);
		console.log("winner : ", Winner);
		console.log("loser : ", Loser);
		console.log("type : ", type);

		const winnerid = await resolveUserId(fastify, Winner);
		if (!winnerid)
			throw `${winnerid} user not found !`;
		const loserid = await resolveUserId(fastify, Loser);
		if (!loserid)
			throw `${winnerid} user not found !`;
		const today = new Date();
		const matchinfo: history = {
			Winnerid: winnerid,
			Loserid: loserid,
			Game: type,
			Score: Sore.left.toString() + "-" + Sore.right.toString(),
			date: today.toISOString(),
			draw: draw
		};
		await addNewMatch(fastify, matchinfo);
		await updatePlayerState(fastify, matchinfo.Winnerid);
		await updatePlayerState(fastify, matchinfo.Loserid);
	} catch (err) {
		console.log(`the error : ${err}`);
	}
}

export function getUserGameStats(fastify: FastifyInstance, userId: number): Promise<game_state> {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT
				SUM(CASE WHEN Winnerid = ? AND draw = 0 THEN 1 ELSE 0 END) AS win,
				SUM(CASE WHEN Loserid = ? AND draw = 0 THEN 1 ELSE 0 END) AS lose,
				SUM(CASE WHEN draw = 1 AND (Winnerid = ? OR Loserid = ?) THEN 1 ELSE 0 END) AS draw,
				COUNT(CASE WHEN Winnerid = ? OR Loserid = ? THEN 1 ELSE NULL END) AS matches
				FROM game_history;
	  	`;
		fastify.db.get(query, [userId, userId, userId, userId, userId, userId], (err, row: game_state | null) => {
			if (err) return reject(err);
			if (!row) return resolve({ win: 0, lose: 0, draw: 0, matches: 0 });
			const data: game_state = {
				win: Number(row.win) || 0,
				lose: Number(row.lose) || 0,
				draw: Number(row.draw) || 0,
				matches: Number(row.matches) || 0,
			};
			resolve(data);
		});
	});
}

export function getPlayerHistory(fastify: FastifyInstance, userId: number): Promise<PlayerHistory[]> {
	return new Promise((resolve, reject) => {
		const query = `
		SELECT
			CASE
				WHEN gh.Winnerid = ? THEN ua_loser.username
				WHEN gh.Loserid = ? THEN ua_winner.username
		  	END AS opponent_name,
			
			CASE
				WHEN gh.draw = 1 THEN 'Draw'
				WHEN gh.Winnerid = ? THEN 'Win'
				ELSE 'Loss'
		  	END AS result,

		  	gh.Date AS date,
		  	gh.Score AS score,
		  	gh.Game AS game_type
  
			FROM game_history gh
			JOIN user_authentication ua_winner ON gh.Winnerid = ua_winner.id
			JOIN user_authentication ua_loser ON gh.Loserid = ua_loser.id
			WHERE ? IN (gh.Winnerid, gh.Loserid)
			ORDER BY gh.Date DESC
			LIMIT 6;
	  `;
		fastify.db.all(query, [userId, userId, userId, userId], (err, rows: PlayerHistory[]) => {
			if (err) return reject(err);
			resolve(rows || []);
		});
	});
}

export function countGames(fastify: FastifyInstance, userId: number): Promise<{ Pong: number, Tic_Tac: number }> {
	return new Promise((resolve, rejects) => {
		const query = `
			SELECT Game, COUNT(*) as count
			FROM game_history
			WHERE Winnerid = ? OR Loserid = ?
			GROUP BY Game;
		`;
		fastify.db.all(query, [userId, userId], (err, rows: any) => {
			if (err)
				rejects(err);
			const result = {
				Pong: 0,
				Tic_Tac: 0,
			};
			for (const row of rows) {
				if (row.Game === 'Pong')
					result.Pong = row.count;
				else
					result.Tic_Tac = row.count;
			}
			resolve(result);
		})
	})
}
