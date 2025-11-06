import { ExtendedError, Socket } from "socket.io";
import { FastifyInstance } from "fastify";
import { IncomingMessage } from "http";
import { parse as parseCookie } from "cookie";
import { Console } from "console";
import { AuthenticatedSocket } from "../pong/interfaces";

export const onlineUsers = new Map<number, AuthenticatedSocket>();

export default function createAuthMiddleware(fastify: FastifyInstance) {
  return async (
    socket: AuthenticatedSocket,
    next: (err?: ExtendedError) => void
  ) => {
    try {
      const cookiesHeader = (socket.request as IncomingMessage).headers.cookie;

      if (!cookiesHeader) {
        throw new Error("No cookie transmitted.");
      }

      const parsedCookies = parseCookie(cookiesHeader);
      const token = parsedCookies.accessToken;

      if (!token) {
        throw new Error("No access token.");
      }

      const decodedToken = await fastify.jwt.decode(token);
      socket.user = decodedToken;
      socket.online = true;
      onlineUsers.set(socket.user.userid, socket);
      next();
    } catch (error) {
      socket.online = false;
      next(new Error("Authentication failed"));
    }
  };
}
