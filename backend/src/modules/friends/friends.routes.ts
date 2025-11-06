import fastify, {
	FastifyInstance,
	FastifyPluginCallback,
	FastifyReply,
	FastifyRequest,
} from "fastify";
import { friend_request, delete_req, delete_friend } from "./friends.schema";
import { getuserid } from "../../utils/userauth.utils";
import {
	addNewFriendReq,
	setFriendReq,
	getFriends,
	getSentFriendReqUsernames,
	getReceivedFriendRequests,
	deleteFriendReq,
	getBlockUser,
	unblockUser_utils,
	getNameById,
	removeFriend,
} from "../../utils/friends.utils";
import { Server as IOServer } from "socket.io";
import { userSockets } from "../socket/chat/chat.handlers";
import { onlineUsers } from "../socket/userdata/auth.middleware";

interface SendRequestOptions {
	io: IOServer;
}

interface AcceptRequestOptions {
	io: IOServer;
}
interface Notification {
	id: number,
	id_sender: number;
	id_receiver: number;
	sender: string;
	receiver: string;
	type: string;
	text: string;
	seen: boolean;
	timestamp: string;
}
export const sendRequest: FastifyPluginCallback<SendRequestOptions> = (
	fastify,
	opts,
	done
) => {
	const io = opts.io;

	fastify.post(
		"/sendrequest",
		{ schema: { body: friend_request } },
		async (req, reply) => {
			try {
				const token = req.cookies.accessToken;
				if (!token) return reply.code(401).send({ message: "No access token" });

				const decode = fastify.jwt.decode(token) as { userid: number };
				const user_recv = req.body as { frined_username: string };
				const id_receiver = await getuserid(fastify, user_recv.frined_username);

				if (id_receiver === null)
					return reply.code(400).send({ message: "Receiver not found" });
				await addNewFriendReq(fastify, decode.userid, id_receiver);
				const sender_name = await getNameById(fastify, decode.userid);
				const received_name = await getNameById(fastify, id_receiver);

				const sender = sender_name[0].username;
				const receiver = received_name[0].username;

				if (!sender || !receiver) {
					return reply.code(400).send({ message: "User data not found" });
				}

				if (io) {
					const timestamp = new Date().toISOString();

					fastify.db.run(
						"INSERT INTO notification (id_sender, id_receiver, sender, receiver, type, seen, text, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
						[
							decode.userid,
							id_receiver,
							sender,
							receiver,
							"friend_request",
							false,
							"Friend Request",
							timestamp,
						],
						function (this: { lastID: number }, err: Error | null) {
							if (err) {
								console.error("Notification insert error:", err);
								return;
							}

							const notification: Notification = {
								id: this.lastID,  
								type: "friend_request",
								id_sender: decode.userid,
								id_receiver: id_receiver,
								sender,
								receiver,
								seen: false,
								text: "Friend Request",
								timestamp,
							};

							const recipientSocketId = userSockets.get(id_receiver);
							if (recipientSocketId) {
								io.to(recipientSocketId).emit("notification", notification);
							}
						}
					);
				}

				return reply.send({ message: "Friend request sent successfully." });
			} catch (err) {
				reply.code(400).send({ error: (err as Error).message });
			}
		}
	);

	done();
};

export const acceptRequest: FastifyPluginCallback<AcceptRequestOptions> = (
	fastify,
	opts,
	done
) => {
	const io = opts.io;
	fastify.put(
		"/acceptrequest",
		{
			schema: {
				body: friend_request,
			},
		},
		async (req, reply) => {
			try {
				const token = req.cookies.accessToken;
				if (!token)
					return reply
						.code(401)
						.send({
							message: "No access token in cookies",
							accesstoken: false,
							refreshtoken: true,
						});
				const decode = fastify.jwt.decode(token) as { userid: number };
				const user_recv = req.body as { frined_username: string };
				const id_receiver = await getuserid(fastify, user_recv.frined_username);
				if (id_receiver === null)
					return reply
						.code(400)
						.send({ message: "Username of the receiver not found!" });
				await setFriendReq(fastify, id_receiver, decode.userid, true);
				await setFriendReq(fastify, decode.userid, id_receiver, true);
				const sender_name = await getNameById(fastify, decode.userid);
				const received_name = await getNameById(fastify, id_receiver);

				const sender = sender_name[0].username;
				const receiver = received_name[0].username;

				if (!sender || !receiver) {
					return reply.code(400).send({ message: "User data not found" });
				}
				if (io) {


					fastify.db.run(
						"INSERT INTO notification (id_sender, id_receiver, sender, receiver, seen,  type , text, timestamp) VALUES (?, ?, ?,  ?, ?, ?, ?, ?)",
						[
							decode.userid,
							id_receiver,
							sender,
							receiver,
							false,
							"friend_request_accepted",
							"Request Accepted",
							new Date().toISOString(),
						],

						function (this: { lastID: number }, err: Error | null) {
							if (err) {
								console.error("Notification insert error:", err);
								return;
							}

							const notification: Notification = {
								id: this.lastID,
								type: "friend_request_accepted",
								id_sender: decode.userid, // who accepted
								id_receiver: id_receiver, // sender
								sender: sender,
								receiver: receiver,
								text: "Request Accepted",
								seen: false,
								timestamp: new Date().toISOString(),
							};

							const recipientSocketId = userSockets.get(id_receiver);
							if (recipientSocketId) {
								io.to(recipientSocketId).emit("notification", notification);
							}
						}
					);
				}


				return reply.send({ message: "friend request is accepted !" });
			} catch (err) {
				reply.code(400).send({ error: (err as Error).message });
			}
		}
	);
	done();
};

export const allsendreq = async (fastify: FastifyInstance) => {
	fastify.get("/allsendreq", async (req, reply) => {
		try {
			const token = req.cookies.accessToken;
			if (!token)
				return reply
					.code(401)
					.send({
						message: "No access token in cookies",
						accesstoken: false,
						refreshtoken: true,
					});
			const decode = fastify.jwt.decode(token) as { userid: number };
			const allrequets = await getSentFriendReqUsernames(
				fastify,
				decode.userid
			);

			return reply.send(allrequets);
		} catch (err) {
			reply.code(400).send({ error: (err as Error).message });
		}
	});
};

export const allrecvreq = async (fastify: FastifyInstance) => {
	fastify.get("/allrecvreq", async (req, reply) => {
		try {
			const token = req.cookies.accessToken;
			if (!token)
				return reply
					.code(401)
					.send({
						message: "No access token in cookies",
						accesstoken: false,
						refreshtoken: true,
					});
			const decode = fastify.jwt.decode(token) as { userid: number };
			const allrequets = await getReceivedFriendRequests(
				fastify,
				decode.userid
			);

			return reply.send(allrequets);
		} catch (err) {
			reply.code(400).send({ error: (err as Error).message });
		}
	});
};

export const allfriends = async (fastify: FastifyInstance) => {
	fastify.get("/allfriends", async (req, reply) => {
		try {
			const token = req.cookies.accessToken;
			if (!token)
				return reply
					.code(401)
					.send({
						message: "No access token in cookies",
						accesstoken: false,
						refreshtoken: true,
					});
			const decode = fastify.jwt.decode(token) as { userid: number };
			const friends = await getFriends(fastify, decode.userid);
			const friend_online_status = friends.map((user) => {
				const online = user.id ? onlineUsers.has(user.id) : false;
				return { ...user, online };
			});
			return reply.send(friend_online_status);
		} catch (err) {
			reply.code(400).send({ error: (err as Error).message });
		}
	});
};

export const deleteReq = async (fastify: FastifyInstance) => {
	fastify.delete(
		"/deletereq",
		{
			schema: {
				body: delete_req,
			},
		},
		async (req, reply) => {
			try {
				const token = req.cookies.accessToken;
				if (!token)
					return reply
						.code(401)
						.send({
							message: "No access token in cookies",
							accesstoken: false,
							refreshtoken: true,
						});
				const decode = fastify.jwt.decode(token) as { userid: number };
				const reqdata = req.body as { frined_username: string; type: string };
				const friend_id = await getuserid(fastify, reqdata.frined_username);
				if (friend_id === null)
					return reply
						.code(400)
						.send({ message: "Username of the receiver not found!" });
				if (reqdata.type === "send")
					await deleteFriendReq(fastify, decode.userid, friend_id);
				else await deleteFriendReq(fastify, friend_id, decode.userid);
				return reply.send();
			} catch (err) {
				reply.code(400).send({ error: (err as Error).message });
			}
		}
	);
};

export const blockReq = async (fastify: FastifyInstance) => {
	fastify.get("/blockReq", async (req, reply) => {
		try {
			const token = req.cookies.accessToken;
			if (!token)
				return reply
					.code(401)
					.send({
						message: "No access token in cookies",
						accesstoken: false,
						refreshtoken: true,
					});

			const decode = fastify.jwt.decode(token) as { userid: number };
			const blockedUsers = await getBlockUser(fastify, decode.userid);
			return reply.send(blockedUsers);
		} catch (err) {
			reply.code(400).send({ error: (err as Error).message });
		}
	});
};

export const unblockUser = async (fastify: FastifyInstance) => {
	fastify.delete(
		"/unblockUser",
		{
			schema: {
				body: delete_req,
			},
		},
		async (req, reply) => {
			try {
				const token = req.cookies.accessToken;
				if (!token)
					return reply
						.code(401)
						.send({
							message: "No access token in cookies",
							accesstoken: false,
							refreshtoken: true,
						});
				const decode = fastify.jwt.decode(token) as { userid: number };
				const reqdata = req.body as { frined_username: string; type: string };
				const friend_id = await getuserid(fastify, reqdata.frined_username);
				if (friend_id === null)
					return reply
						.code(400)
						.send({ message: "Username of the receiver not found!" });
				if (reqdata.type === "send")
					await unblockUser_utils(fastify, decode.userid, friend_id);

				return reply.send();
			} catch (err) {
				reply.code(400).send({ error: (err as Error).message });
			}
		}
	);
};

export const deleteFriend = async (fastify: FastifyInstance) => {
	fastify.delete(
		"/deletefriend",
		{
			schema: {
				body: delete_friend,
			},
		},
		async (req: any, resp: any) => {
			try {
				const token = req.cookies.accessToken;
				if (!token)
					return resp
						.code(401)
						.send({
							message: "No access token in cookies",
							accesstoken: false,
							refreshtoken: true,
						});
				const decode = fastify.jwt.decode(token) as { userid: number };
				const reqdata = req.body as { frined_username: string; type: string };
				const friend_id = await getuserid(fastify, reqdata.frined_username);
				if (!friend_id)
					return resp.code(400).send({ message: "Username not found !!!" });
				await removeFriend(fastify, decode.userid, friend_id);
				return resp.send();
			} catch (err) {
				resp.code(400).send({ error: (err as Error).message });
			}
		}
	);
};
