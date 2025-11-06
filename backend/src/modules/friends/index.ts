import { FastifyInstance, FastifyPluginCallback } from "fastify";
import {
  sendRequest,
  acceptRequest,
  allfriends,
  allsendreq,
  allrecvreq,
  deleteReq,
  blockReq,
  unblockUser,
  deleteFriend,
} from "./friends.routes";
import { Server as IOServer } from "socket.io";

interface FriendsPluginOptions {
  io: IOServer;
}

const friends: FastifyPluginCallback<FriendsPluginOptions> = (
  fastify,
  opts,
  done
) => {
  const io = opts.io;

  fastify.register(sendRequest, { prefix: "/friends", io });
  fastify.register(acceptRequest, { prefix: "/friends", io });
  fastify.register(allfriends, { prefix: "/friends" });
  fastify.register(allsendreq, { prefix: "/friends" });
  fastify.register(allrecvreq, { prefix: "/friends" });
  fastify.register(deleteReq, { prefix: "/friends" });
  fastify.register(blockReq, { prefix: "/friends" });
  fastify.register(unblockUser, { prefix: "/friends" });
  fastify.register(deleteFriend, { prefix: "/friends" });

  done();
};

export default friends;
