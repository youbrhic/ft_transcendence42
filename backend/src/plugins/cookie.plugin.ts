import fastifyCookie from '@fastify/cookie';
import { env } from 'process';
import fp from 'fastify-plugin';
import cookie from '@fastify/cookie'
import { FastifyInstance , FastifyPluginAsync} from 'fastify';


const cookieplugin = async (fastify: FastifyInstance) => {
    if (!env.COOKIE_SECRET)
		throw 'COOKIE_SECRET not found'
	fastify.register(cookie, {
		secret: process.env.COOKIE_SECRET,
		hook: 'onRequest'
	})
}

export default fp(cookieplugin);