// import userauth from '../modules/userauth';
// import settings from '../modules/settings';
// import friends from '../modules/friends';
// import { FastifyInstance } from 'fastify';
// import { Server as IOServer } from 'socket.io';

// export default function allModules(fastify: FastifyInstance, opts: { io: IOServer }) {
//   fastify.register(userauth);
//   fastify.register(settings);
//   fastify.register(friends, { io: opts.io }); 
// }


import userauth from '../modules/userauth';
import settings from '../modules/settings';
import friends from '../modules/friends';
import profile  from '../modules/profile';
import home from '../modules/home';
import { FastifyInstance } from 'fastify';
import { Server as IOServer } from 'socket.io';

export default function allModules(fastify: FastifyInstance, opts: { io: IOServer }) {
  fastify.register(userauth);
  fastify.register(settings);
  fastify.register(profile);
  fastify.register(home);
  fastify.register(friends, { io: opts.io }); 
}
