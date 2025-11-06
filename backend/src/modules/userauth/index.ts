import { FastifyPluginAsync, FastifyInstance } from "fastify";
import {SignUp, Signin, Verify2fa, RefreshToken, GoogleSign} from './userauth.routes'

export default function userauth (fastify: FastifyInstance) {
	fastify.register(SignUp, {prefix: '/login'});
	fastify.register(Signin, {prefix: '/login'});
	fastify.register(Verify2fa, {prefix: '/login'});
	fastify.register(RefreshToken, {prefix: '/login'});
	fastify.register(GoogleSign, {prefix: '/login'});
}
