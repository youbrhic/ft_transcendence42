import { rejects } from 'assert';
import { FastifyInstance } from 'fastify';
import { resolve } from 'path';

type Game = "Pong" | "Tic-tac"

type home_history = {
    user_avatar: string;
    opponent_avatar: string;
    Score: string;
    result: string;
    Game?: Game;
}

type Leaderboard = {
	username: string;
	avatar: string;
	level: number;
	rank: number;
}


export function getHistoryHome(fastify: FastifyInstance, userid: number, limit: number = 10): Promise<home_history[]> {
    return new Promise((resolve, reject) => {
        const query: string = 
            `
				SELECT
					ua.image_url AS user_avatar,
					opp.image_url AS opponent_avatar,
					gh.Score AS Score,
					gh.Game AS Game,
					CASE
						WHEN gh.draw = 1 THEN 'Draw'
						WHEN gh.Winnerid = ua.id THEN 'Win'
						WHEN gh.Loserid = ua.id THEN 'Lose'
					END AS result
				FROM game_history gh
				JOIN user_authentication ua ON (ua.id = gh.Winnerid OR ua.id = gh.Loserid)
				JOIN user_authentication opp ON 
					((gh.Winnerid = ua.id AND gh.Loserid = opp.id) OR
					(gh.Loserid = ua.id AND gh.Winnerid = opp.id))
				WHERE ua.id = ?
				ORDER BY gh.Date DESC
				LIMIT ?;
			`
        ;

        fastify.db.all(query, [userid, limit], (err, rows: home_history[]) => {
            if (err) return reject(err);
            resolve(rows || []);
        });
    });
}


export function getLeaderboard(fastify: FastifyInstance, limit: number = 10): Promise<Leaderboard[]> {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT 
				ua.username, 
				ua.image_url AS avatar,
				ps.level,
				ROW_NUMBER() OVER (ORDER BY ps.level DESC) AS rank
			FROM player_state ps
			JOIN user_authentication ua ON ps.userid = ua.id
			ORDER BY ps.level DESC
			LIMIT ?;
		`;
		fastify.db.all(query, [limit], (err, rows: Leaderboard[]) => {
			if (err) return reject(err);
			resolve(rows || []);
		});
	});
}

export function getuserrank(fastify: FastifyInstance, userid: number): Promise<number> {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT rank FROM (
				SELECT
					userid,
					ROW_NUMBER() OVER (ORDER BY total_xp DESC) AS rank
				FROM player_state
			) AS ranked_players
			WHERE userid = ?;
		`;
		fastify.db.get(query, [userid], (err, row: { rank: number } | undefined) => {
			if (err) return reject(err);
			if (!row) return resolve(-1);
			resolve(row.rank);
		});
	});
}
