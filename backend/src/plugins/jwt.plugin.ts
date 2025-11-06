import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import { FastifyInstance } from 'fastify'
import { env } from 'process'

const jwtplugin = (fastify: FastifyInstance) => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
	  throw new Error('Missing JWT_SECRET environment variable');
	}
	fastify.register(jwt, { secret });
};

export default fp(jwtplugin);