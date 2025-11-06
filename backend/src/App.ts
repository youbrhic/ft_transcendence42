/// <reference types="../types/fastify" />

import fastify from "fastify";
import dbPlugin from "./plugins/database.plugin";
import Modules from "./plugins/modules.plugin";
import jwtplugin from "./plugins/jwt.plugin";
import cookiePlugin from "./plugins/cookie.plugin";
import auth02 from "./plugins/oauth2.plugin";
import cors from "@fastify/cors";
import ajvErrors from "ajv-errors";
import { Server as IOServer } from "socket.io";
import http from "http";
import setupSocketIO from "./plugins/socket.plugin";
import { getuser } from "./utils/userauth.utils";
import cloudinaryPlugin from "./plugins/cloudinary.plugin";
import tournamentRoutes from "./modules/socket/pong/tournamentRoutes";

const app = fastify({
  ajv: {
    customOptions: {
      allErrors: true,
      $data: true,
    },
    plugins: [ajvErrors],
  },
});

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

app.register(dbPlugin);
app.register(cookiePlugin);
app.register(jwtplugin);
app.register(auth02);
app.register(cloudinaryPlugin);

app.addHook("onRequest", async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`);
  try {
    const publicPaths = ["/api/login"];
    const isPublic = publicPaths.some((path) =>
      (request.raw.url || "").startsWith(path)
    );

    if (!isPublic) {
      const token = request.cookies.accessToken;
      if (!token) {
        return reply.code(401).send({
          message: "No access token in cookies",
          accesstoken: false,
          refreshtoken: true,
        });
      }
      const decodetoken = app.jwt.decode(token);
      const user = await getuser(app, decodetoken.username);

      if (!user) {
        reply.clearCookie("accessToken", {
          path: "/",
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        });
        reply.clearCookie("refreshtoken", {
          path: "/api/login/refreshtoken",
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        });
        return reply.code(401).send({
          message: "No access token in cookies",
          accesstoken: false,
          refreshtoken: false,
        });
      }
      await app.jwt.verify(token);
    }
  } catch (err) {
    return reply.code(401).send({
      message: "Unauthorized",
      error: err,
      accesstoken: false,
      refreshtoken: true,
    });
  }
});

app.setErrorHandler(async (error, request, reply) => {
  if (error.validation && error.validation.length > 0) {
    const firstError = error.validation[0];
    const field = firstError.instancePath.replace(/\//, "") || "field";
    return reply.status(400).send({ type: field, message: firstError.message });
  }
  reply.send(error);
});

app.register(
  async (api) => {
    api.register(Modules, { io: app.io });
    api.register(tournamentRoutes);

    api.get("/hello", (request, reply) => {
      return reply.send({ refreshtoken: true, accesstoken: true });
    });

    api.get("/userinfo", async (request, reply) => {
      try {
        const token = request.cookies.accessToken;
        if (!token) {
          return reply.code(401).send({
            userinfo: false,
            message: "No access token in cookies",
            accesstoken: false,
            refreshtoken: true,
          });
        }
        const decodetoken = app.jwt.decode(token) as { username: string };
        const user = await getuser(app, decodetoken.username);
        let hasspassword = true;
        if (user?.password === null) hasspassword = false;
        return reply.send({
          userinfo: true,
          data: {
            id: user?.id,
            username: user?.username,
            display_name: user?.display_name,
            first_name: user?.first_name,
            family_name: user?.family_name,
            Language: user?.Language,
            image_url: user?.image_url,
            cover_url: user?.cover_url,
            email: user?.email,
            twofa: user?.twoFA,
            hasspassword: hasspassword,
          },
        });
      } catch (err) {
        reply.code(400).send({ userinfo: false, error: err });
      }
    });

    api.get("/logout", (request, reply) => {
      reply.clearCookie("accessToken", {
        path: "/",
        secure: false,
        httpOnly: true,
        sameSite: "strict",
      });

      reply.clearCookie("refreshtoken", {
        path: "/api/login/refreshtoken",
        secure: false,
        httpOnly: true,
        sameSite: "strict",
      });

      return reply.send({ message: "Logged out" });
    });
  },
  { prefix: "/api" }
);

const server: http.Server = app.server;
const io = new IOServer(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.decorate("io", io);

app.ready().then(() => {
  setupSocketIO(app, io);
});

// app.setNotFoundHandler((request, reply) => {
// 	console.log(`🚫 404 - Route not found: ${request.method} ${request.url}`);
// 	reply.status(404).send({
// 		error: 'Not Found',
// 		message: `Route ${request.method} ${request.url} does not exist`,
// 		path: request.url,
// 		method: request.method,
// 		timestamp: new Date().toISOString()
// 	});
// });

app.listen({ port: 3000, host: "0.0.0.0" }, () => {
  console.log("127.0.0.1:3000");
});
