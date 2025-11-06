import { FastifyInstance } from "fastify";
import { resolve } from "path";
import { User } from "./userauth.utils";

// getBlockUser, unblockUser_utils, getNameById 

export interface friendship {
	sender: string;
	receiver: string;
}

export function addNewFriendReq(fastify: FastifyInstance, id_sender: number, id_receiver: number): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			`INSERT INTO friendship (id_sender, id_receiver) 
                VALUES (?, ?)`,
			[
				id_sender,
				id_receiver
			],
			(err) => {
				if (err) return reject(err);
				resolve();
			}
		)
	})
}

export function setFriendReq(fastify: FastifyInstance, id_sender: number, id_receiver: number, accepted: boolean): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			`UPDATE friendship SET  accepted = ? WHERE id_sender = ? AND id_receiver = ?`,
			[
				accepted,
				id_sender,
				id_receiver
			],
			function (this: any, err: Error | null) {
				if (err) return reject(err);
				// if (this.changes === 0)
				// 	return reject(new Error('Friendship row does not exist'));
				resolve();
			}
		);
	})
}

export function getSentFriendReqUsernames(fastify: FastifyInstance, id_sender: number): Promise<User[]> {
	return new Promise((resolve, reject) => {
		fastify.db.all(
			`
			  	SELECT u.username, u.first_name, u.family_name, u.image_url
			  	FROM friendship f
			  	JOIN user_authentication u ON f.id_receiver = u.id
			  	WHERE f.id_sender = ? AND f.accepted = 0
			`,
			[id_sender],
			(err: Error | null, rows: User[]) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(rows);
			}
		);
	});
}

export function getReceivedFriendRequests(fastify: FastifyInstance, id_receiver: number): Promise<User[]> {
	return new Promise((resolve, reject) => {
		fastify.db.all(
			`
		  		SELECT u.username, u.first_name, u.family_name, u.image_url
		  		FROM friendship f
		  		JOIN user_authentication u ON f.id_sender = u.id
		  		WHERE f.id_receiver = ? AND f.accepted = 0
			`,
			[id_receiver],
			(err: Error | null, rows: User[]) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(rows);
			}
		);
	});
}

export function getFriends(fastify: FastifyInstance, user_id: number): Promise<User[]> {
	return new Promise((resolve, reject) => {
		fastify.db.all(
			`
				SELECT u.id, u.username, u.first_name, u.family_name, u.image_url
				FROM friendship f
				JOIN user_authentication u ON u.id = f.id_receiver
				WHERE f.id_sender = ? AND f.accepted = 1

				UNION

				SELECT u.id, u.username, u.first_name, u.family_name, u.image_url
				FROM friendship f
				JOIN user_authentication u ON u.id = f.id_sender
				WHERE f.id_receiver = ? AND f.accepted = 1
			`,
			[user_id, user_id],
			(err: Error | null, rows: User[]) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(rows);
			}
		);
	});
}

export function deleteFriendReq(fastify: FastifyInstance, id_sender: number, id_receiver: number): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			`DELETE FROM friendship WHERE id_sender = ? AND id_receiver = ?`,
			[id_sender, id_receiver],
			(err: Error | null) => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			}
		);
	});
}

export function getBlockUser(fastify: FastifyInstance, blockerId: number): Promise<{ blocker: number, blocked: number }[]> {
	return new Promise((resolve, reject) => {
		fastify.db.all(
			`SELECT u.id, u.username, u.first_name, u.family_name, u.image_url
				FROM blocked_users f
				JOIN user_authentication u ON f.blocked = u.id 
				WHERE f.blocker = ?`,
			[blockerId],
			(err: Error | null, rows: { blocker: number, blocked: number }[]) => {
				if (err) {
					reject(err);
					return;
				}
				console.log("===> : Blocked rows:", rows);
				resolve(rows);
			}
		);
	});
}

export function getBlockUsers(fastify: FastifyInstance, blockerId: number): Promise<{ blocker: number, blocked: number }[]> {
	return new Promise((resolve, reject) => {
		fastify.db.all(
			`SELECT u.id FROM blocked_users f
				JOIN user_authentication u ON f.blocked = u.id OR f.blocker = u.id
				WHERE f.blocker = ? OR f.blocked = ?`,
			[blockerId, blockerId],
			(err: Error | null, rows: { blocker: number, blocked: number }[]) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(rows);
			}
		);
	});
}

export function unblockUser_utils(fastify: FastifyInstance, blocker: number, blocked: number): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			`DELETE FROM blocked_users WHERE blocker = ? AND blocked = ?`,
			[blocker, blocked],
			(err: Error | null) => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			}
		);
	});
}

export function getNameById(fastify: FastifyInstance, id: number): Promise<User[]> {
	return new Promise((resolve, reject) => {
		fastify.db.all(
			`
		SELECT username, first_name, family_name, image_url
		FROM user_authentication
		WHERE id = ?
		`,
			[id],
			(err: Error | null, rows: User[]) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(rows);
			}
		);
	});
}


export function removeFriend(fastify: FastifyInstance, id_sender: number, id_receiver: number): Promise<void> {
	return new Promise((resolve, reject) => {
		fastify.db.run(
			`DELETE FROM friendship 
		 WHERE (id_sender = ? AND id_receiver = ?) 
			OR (id_sender = ? AND id_receiver = ?)`,
			[id_sender, id_receiver, id_receiver, id_sender],
			(err: Error | null) => {
				if (err) return reject(err);
				resolve();
			}
		)
	})
}
