import fastify, {
	FastifyInstance,
	FastifyRequest,
	FastifyReply,
} from "fastify";
import { getuserid } from "../../utils/userauth.utils";
import {
	getUserGameStats,
	getPlayerState,
	PlayerState,
	getPlayerHistory,
	countGames,
} from "../../utils/profile.utils";
import { getuserrank } from "../../utils/home.utils";
import { getuser } from "../../utils/userauth.utils";
import { request } from "http";

export const UserGameStats = async (fastify: FastifyInstance) => {
	fastify.get(
		"/GameStats/:username?",
		async (
			request: FastifyRequest<{ Params: { username?: string } }>,
			reply
		) => {
			try {
				const { username } = request.params;
				if (!username) {
					const token = request.cookies.accessToken;
					if (!token) {
						return reply
							.code(401)
							.send({
								userinfo: false,
								message: "No access token in cookies",
								accesstoken: false,
								refreshtoken: true,
							});
					}
					const decodetoken = fastify.jwt.decode(token) as { userid: number };
					const gamestate = await getUserGameStats(fastify, decodetoken.userid);
					return reply.send({ gamestate });
				}
				const userid = await getuserid(fastify, username);
				if (!userid)
					return reply.code(400).send({ message: "user not found !" });
				const gamestate = await getUserGameStats(fastify, userid);
				const rank = await getuserrank(fastify, userid);
				return reply.send({ gamestate, rank: rank });
			} catch (err) {
				reply.code(400).send(err);
			}
		}
	);
};

export const UserPlayerStats = async (fastify: FastifyInstance) => {
	fastify.get(
		"/UserPlayerStats/:username?",
		async (
			request: FastifyRequest<{ Params: { username?: string } }>,
			reply
		) => {
			try {
				const { username } = request.params;
				let userid: number | null = null;

				if (!username) {
					const token = request.cookies.accessToken;
					if (!token) {
						return reply
							.code(401)
							.send({
								userinfo: false,
								message: "No access token in cookies",
								accesstoken: false,
								refreshtoken: true,
							});
					}
					const decodetoken = fastify.jwt.decode(token) as { userid: number };
					userid = decodetoken.userid;
				} else {
					userid = await getuserid(fastify, username);
					if (!userid) {
						return reply.code(404).send({ message: "user not found !" });
					}
				}
				const player_state: PlayerState | null = await getPlayerState(
					fastify,
					userid
				);
				if (!player_state) {
					return reply.code(404).send({ message: "player_state not found !" });
				}

				return reply.send({
					level: player_state.level,
					total_xp: player_state.total_xp,
				});
			} catch (err) {
				console.error("=== ERROR in UserPlayerStats ===");
				console.error("Error type:", err?.constructor?.name);
				console.error(
					"Error message:",
					err instanceof Error ? err.message : err
				);
				console.error(
					"Error stack:",
					err instanceof Error ? err.stack : "No stack trace"
				);
				console.error("Full error object:", err);

				return reply.code(400).send({
					message: "Internal server error",
					error: err instanceof Error ? err.message : String(err),
				});
			}
		}
	);
};

export const PlayerHistory = async (fastify: FastifyInstance) => {
	fastify.get(
		"/PlayerHistory/:username?",
		async (
			request: FastifyRequest<{ Params: { username?: string } }>,
			reply
		) => {
			try {
				const { username } = request.params;
				let userid: number | null = null;
				if (!username) {
					const token = request.cookies.accessToken;
					if (!token)
						return reply
							.code(401)
							.send({
								userinfo: false,
								message: "No access token in cookies",
								accesstoken: false,
								refreshtoken: true,
							});

					const decodetoken = fastify.jwt.decode(token) as { userid: number };
					userid = decodetoken.userid;
				} else {
					userid = await getuserid(fastify, username);
					if (!userid) return reply.code(400).send("user not found !");
				}
				const playerHistory = await getPlayerHistory(fastify, userid);
				return reply.send(playerHistory);
			} catch (err) {
				return reply.code(400).send(err);
			}
		}
	);
};

export const Userinfo = async (fastify: FastifyInstance) => {
	fastify.get("/userinfo/:username?", async (request, reply) => {
		try {
			const { username } = request.params as { username: string };
			if (!username)
				return reply
					.code(400)
					.send({ userinfo: false, message: "Username is required" });
			const user = await getuser(fastify, username);
			if (!user)
				return reply
					.code(404)
					.send({ userinfo: false, message: "User not found" });
			return reply.send({
				userinfo: true,
				data: {
					username: user.username,
					first_name: user.first_name,
					family_name: user.family_name,
					Language: user.Language,
					image_url: user.image_url,
					cover_url: user.cover_url,
					email: user.email,
					twofa: user.twoFA,
				},
			});
		} catch (err) {
			console.error("Error in /userinfo/:username:", err);
			reply.code(400).send({ userinfo: false, error: "Internal server error" });
		}
	});
};

export const CountGames = async (fastify: FastifyInstance) => {
	fastify.get(
		"/CountGames/:username?",
		async (
			request: FastifyRequest<{ Params: { username?: string } }>,
			reply
		) => {
			try {
				const { username } = request.params;
				let userid: number | null = null;
				if (!username) {
					const token = request.cookies.accessToken;
					if (!token)
						return reply
							.code(401)
							.send({
								userinfo: false,
								message: "No access token in cookies",
								accesstoken: false,
								refreshtoken: true,
							});
					const decodetoken = fastify.jwt.decode(token) as { userid: number };
					userid = decodetoken.userid;
				} else {
					userid = await getuserid(fastify, username);
					if (!userid) return reply.code(400).send("user not found !");
				}
				const result = await countGames(fastify, userid);
				return reply.send(result);
			} catch (err) {
				reply.code(400).send(err);
			}
		}
	);
};
