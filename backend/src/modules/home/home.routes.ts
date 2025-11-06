import fastify, { FastifyInstance } from "fastify";
import { getHistoryHome, getLeaderboard } from "../../utils/home.utils";
import { request } from "http";

export const HistoryHome = async (fastify: FastifyInstance) => {
	fastify.get("/HistoryHome/:limit", async (request, reply) => {
		try {
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

			const params = request.params as { limit: string };
			const limit = parseInt(params.limit) || 10;

			const history = await getHistoryHome(fastify, decodetoken.userid, limit);
			reply.send(history);
		} catch (err) {
			reply.code(400).send(err);
		}
	});
};

export const Leaderboard = async (fastify: FastifyInstance) => {
	fastify.get("/Leaderboard/:limit", async (request, reply) => {
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

		const params = request.params as { limit: string };
		const limit = parseInt(params.limit) || 10;

		const leaderboard = await getLeaderboard(fastify, limit);
		reply.send(leaderboard);
	});
};
