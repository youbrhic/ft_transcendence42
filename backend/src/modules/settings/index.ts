import {GetUrlimage, profile, GameSettings, GetGameInfo, UpateSecurity, TicTacSettings, GetTicTacInfo} from './settings.routes'
import { FastifyPluginAsync, FastifyInstance } from "fastify";

export default function settings (fastify: FastifyInstance) {
	fastify.register(GetUrlimage, {prefix: '/settings'});
	fastify.register(profile, {prefix: "/settings"});
	fastify.register(GetGameInfo, {prefix: "/settings"});
	fastify.register(GameSettings, {prefix: "/settings"});
	fastify.register(GetTicTacInfo, {prefix: "/settings"});
	fastify.register(TicTacSettings, {prefix: "/settings"});
	fastify.register(UpateSecurity, {prefix: "/settings"});
}
