import fastify, { FastifyInstance } from "fastify";
import { request } from "http";
import { user_signup, user_signin, user_Verify2fa } from "./userauth.schema";
import { addNewUser, getuser, getuserid } from "../../utils/userauth.utils";
import type { User } from "../../utils/userauth.utils";
import {
	handle_Signin,
	handel_verifytwofa,
	handle_googlesign,
} from "./userauth.controller";
import { generateAccessToken, generateRefreshToken } from "./userauth.services";
import { env } from "../../plugins/env.plugin";
import { setdefaultgame } from "../../utils/settings.utils";
import { addNewPlayerState } from "../../utils/profile.utils";
import bcrypt from "bcrypt";

export const SignUp = async (fastify: FastifyInstance) => {
	fastify.post(
		"/signup",
		{
			schema: {
				body: user_signup,
			},
		},
		async (request, reply) => {
			const user = request.body as User;
			try {
				if (user.password !== user.confirmpassword)
					throw {
						message: "the password  and confirm password are not the same !",
						type: "confirmpassword",
						singup: false,
						TypeError: "passwordMismatch",
					};
				else {
					user.password = await bcrypt.hash(user.password, 10);
					delete user.confirmpassword;
					await addNewUser(fastify, user);
					const id = (await getuserid(fastify, user.username)) || 0;
					await setdefaultgame(fastify, id);
					await addNewPlayerState(fastify, id);
					return reply
						.code(201)
						.send({ message: "the user is created ", singup: true });
				}
			} catch (err: unknown) {
				if (err instanceof Error && "message" in err) {
					const msg = err.message.toLowerCase();
					if (msg.includes("user_authentication.username")) {
						reply.code(400).send({
							message: "Username is already taken",
							type: "username",
							signup: false,
							TypeError: "usernameTaken",
						});
					} else if (msg.includes("user_authentication.email")) {
						reply.code(400).send({
							message: "Email is already in use",
							type: "email",
							signup: false,
							TypeError: "emailInUse",
						});
					} else {
						reply.code(400).send({ message: err.message, signup: false });
					}
				} else {
					reply.code(400).send(err);
				}
			}
		}
	);
};

export const Signin = async (fastify: FastifyInstance) => {
	fastify.post(
		"/signin",
		{
			schema: {
				body: user_signin,
			},
		},
		async (request, reply) => {
			try {
				const user = request.body as User;
				await handle_Signin(fastify, request, reply, user);
			} catch (err) {
				reply.code(400).send(err);
			}
		}
	);
};

export const Verify2fa = async (fastify: FastifyInstance) => {
	fastify.post(
		"/verify2fa",
		{
			schema: {
				body: user_Verify2fa,
			},
		},
		async (request, reply) => {
			try {
				await handel_verifytwofa(fastify, request, reply);
			} catch (err) {
				reply
					.code(400)
					.send({ message: "something wrong !", error: err, login: false });
			}
		}
	);
};

export const RefreshToken = async (fastify: FastifyInstance) => {
	fastify.get("/refreshtoken", async (request, reply) => {
		try {
			const refreshtoken = request.cookies.refreshtoken;
			if (!refreshtoken) {
				return reply.code(400).send({
					message: "Refresh token expired",
					refreshtoken: false,
				});
			}
			const decoded = fastify.jwt.decode(refreshtoken) as { username: string };
			const user: User | null = await getuser(fastify, decoded.username);
			if (!user) {
				return reply
					.code(404)
					.send({ message: "User not found", refreshtoken: true });
			}
			const accessToken = await generateAccessToken(fastify, reply, user);
			return reply.send({
				message: "new access token created ",
				refreshtoken: true,
			});
		} catch (err) {
			return reply.code(400).send({
				message: "Invalid refresh token",
				error: err,
				refreshtoken: false,
			});
		}
	});
};

export const GoogleSign = async (fastify: FastifyInstance) => {
	fastify.get("/google/callback", async (request, reply) => {
		try {
			await handle_googlesign(fastify, request, reply);
		} catch (err) {
			return reply.redirect(`${env.REDERCURL}login/Signin`);
		}
	});
};
