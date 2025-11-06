import auth from '@fastify/oauth2';
import fp from 'fastify-plugin';
import { FastifyInstance , FastifyPluginAsync} from 'fastify';
import { env } from './env.plugin';

const authplugin = async (fastify : FastifyInstance) => {
	fastify.register(auth, {
		name: "googleOAuth2",
		scope: ['profile', 'email'],
		credentials: {
			client: {
			  id: `${env.CLIENT_ID}`,
			  secret: `${env.CLIENT_SECRUT}`,
			},
			auth: auth.GOOGLE_CONFIGURATION
		},
		startRedirectPath: '/api/login/google',
		callbackUri: `${env.CALLBACKURL}`
	})
};

export default fp(authplugin);