import { FastifyInstance } from 'fastify';
import type { User } from './userauth.utils';
import { resolve } from 'path';
import { rejects } from 'assert';

export interface gameinfo {
	ball_color: string;
	paddle_color: string;
	table_color: string;
};

export interface ticTacinfo {
	x_color: string;
	o_color: string;
	grid_color: string;
	board_color: string;
};

export interface securityinfo {
	twoFA: boolean;
	oldpassowrd: string;
	password: string;
	confirmpassword: string;
};

export async function getdisplay_name(fastify: FastifyInstance, id: number): Promise<string | null> {
	return new Promise((resolve, rejects) => {
		fastify.db.get(
			`SELECT display_name from user_authentication WHERE id = ? `,
			[
				id
			], (err: Error | null, row: { display_name: string }) => {
				if (err) rejects(err);
				if (!row) {
					console.warn(` No user found for username: ${id}`);
					return resolve(null);
				}
				resolve(row.display_name);
			}
		)
	})
}

export async function getuserid(fastify: FastifyInstance, username: string): Promise<number | null> {
	return new Promise((resolve, rejects) => {
		fastify.db.get(
			`SELECT id from user_authentication WHERE username = ? `,
			[
				username
			],
			(err: Error | null, row: { id: number }) => {
				if (err) rejects(err);
				if (!row) {
					console.warn(` No user found for username: ${username}`);
					return resolve(null);
				}
				resolve(row.id);
			}
		);
	})
}

export async function isDisplayNameTaken(fastify: FastifyInstance, displayName: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		fastify.db.all(
			`SELECT display_name FROM user_authentication WHERE display_name = ?`,
			[displayName],
			(err: Error | null, rows: any[]) => {
				if (err) return reject(err);
				resolve(rows.length > 0);
			}
		);
	});
}

export async function updateImage(fastify: FastifyInstance, username: string, newImage: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			'UPDATE user_authentication SET image_url = ? WHERE username = ?',
			[
				newImage,
				username
			],
			(err) => {
				if (err)
					return reject(err);
				resolve();
			}
		);
	})
}

export async function updateCover(fastify: FastifyInstance, username: string, newImage: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			'UPDATE user_authentication SET cover_url = ? WHERE username = ?',
			[
				newImage,
				username
			],
			(err) => {
				if (err) return reject(err);
				resolve();
			}
		);
	})
}

export async function UpdateProfile(fastify: FastifyInstance, user: User, username: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			'UPDATE user_authentication SET  username = ?, display_name = ?, first_name = ?, family_name = ?, Language = ?, image_url = ?, cover_url = ?  WHERE username = ?',
			[
				user.username,
				user.display_name,
				user.first_name,
				user.family_name,
				user.Language,
				user.image_url,
				user.cover_url,
				username
			],
			(err) => {
				if (err) return reject(err);
				resolve();
			}
		);
	})
}

//Ping Pong 
export async function UpdateGame(fastify: FastifyInstance, gameinfo: gameinfo, id: number): Promise<void> {
	return new Promise((resolve, rejects) => {
		fastify.db.run(
			'UPDATE game_settings_table SET ball_color = ?, paddle_color = ? , table_color = ? WHERE user_id = ?',
			[
				gameinfo.ball_color,
				gameinfo.paddle_color,
				gameinfo.table_color,
				id
			],
			(err) => {
				if (err) return rejects(err);
				resolve();
			}
		)
	})
}

export async function getgameinfo(fastify: FastifyInstance, id: number): Promise<gameinfo | null> {
	return (new Promise((resolve, rejects) => {
		fastify.db.get('SELECT * FROM game_settings_table where user_id = ? ', [id],
			(err: Error | null, rows: gameinfo) => {
				if (err)
					rejects(err);
				resolve(rows);
			}
		)
	}))
}

export async function setdefaultgame(fastify: FastifyInstance, id: number): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			`INSERT INTO game_settings_table (user_id)
					 VALUES (?)`,
			[
				id
			],
			(err) => {
				if (err) return reject(err);
				resolve();
			}
		);
	});
}

//Tic Tac :
export async function UpdateTicTac(fastify: FastifyInstance, ticTacinfo: ticTacinfo, id: number): Promise<void> {
	return new Promise((resolve, rejects) => {
		fastify.db.run(
			'UPDATE ticTac_settings_table SET x_color = ?, o_color = ?, grid_color = ?, board_color = ? WHERE id = ?',
			[
				ticTacinfo.x_color,
				ticTacinfo.o_color,
				ticTacinfo.grid_color,
				ticTacinfo.board_color,
				id
			],
			(err) => {
				if (err) return rejects(err);
				resolve();
			}
		)
	})
}

export async function getTicTacinfo(fastify: FastifyInstance, id: number): Promise<ticTacinfo | null> {
	return (new Promise((resolve, rejects) => {
		console.log("username : ", id)
		fastify.db.get('SELECT * FROM ticTac_settings_table where id = ? ', [id],
			async (err: Error | null, rows: ticTacinfo) => {
				if (err) {
					console.log("err in the getTicTacinfo !!!!!")
					rejects(err);
					return;
				}

				if (!rows) {
					console.log("No tic-tac-toe settings found, creating default for user:", id);
					await setdefaultTictac(fastify, id);

					resolve({// return default values
						x_color: "#FF0000",
						o_color: "#0000FF",
						grid_color: "#EEEEEE",
						board_color: "#EEEEEE"
					});
				} else {
					console.log("====> : rows : ", rows);
					resolve(rows);
				}
			}
		)
	}))
}

export async function setdefaultTictac(fastify: FastifyInstance, id: number): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			`INSERT INTO ticTac_settings_table (id, x_color, o_color, grid_color, board_color)
			VALUES (?, ?, ?, ?, ?)`,
			[
				id,
				"#FF0000",
				"#0000FF",
				"#EEEEEE",
				"#EEEEEE"
			],
			(err) => {
				if (err) return reject(err);
				resolve();
			}
		);
	});
}

export async function setpassword(fastify: FastifyInstance, username: string, newpassowrd: string): Promise<void> {
	return new Promise((resolve, rejects) => {
		fastify.db.run(
			'UPDATE user_authentication SET password = ?  WHERE username = ?',
			[
				newpassowrd,
				username
			],
			(err) => {
				if (err) return rejects(err);
				resolve();
			}
		)
	})
}

export async function settwoFA(fastify: FastifyInstance, username: string, newTwofa: boolean): Promise<void> {
	return new Promise((resolve, rejects) => {
		fastify.db.run(
			'UPDATE user_authentication SET twoFA = ?  WHERE username = ?',
			[
				newTwofa,
				username
			],
			(err) => {
				if (err) return rejects(err);
				resolve();
			}
		)
	})
}
