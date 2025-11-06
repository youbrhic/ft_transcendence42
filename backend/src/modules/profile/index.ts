import {
  UserGameStats,
  UserPlayerStats,
  PlayerHistory,
  Userinfo,
  CountGames,
} from "./profile.routes";
import { FastifyPluginAsync, FastifyInstance } from "fastify";

export default function profile(fastify: FastifyInstance) {
  fastify.register(UserGameStats, { prefix: "/profile" });
  fastify.register(UserPlayerStats, { prefix: "/profile" });
  fastify.register(PlayerHistory, { prefix: "/profile" });
  fastify.register(Userinfo, { prefix: "/profile" });
  fastify.register(CountGames, { prefix: "/profile" });
}
