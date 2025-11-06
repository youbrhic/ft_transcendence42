import { FastifyPluginAsync, FastifyInstance } from "fastify";
import { HistoryHome, Leaderboard } from "./home.routes";

export default function home(fastify: FastifyInstance) {
  fastify.register(HistoryHome, { prefix: "/home" });
  fastify.register(Leaderboard, { prefix: "/home" });
}
