import fastify, {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
} from "fastify";
import {
	sendemail,
	generateAccessToken,
	generateRefreshToken,
	generateusername,
} from "./userauth.services";
import {
	addNewUser,
	getuser,
	setTwofAcode,
	getuser_email,
	getuserid,
} from "../../utils/userauth.utils";
import { updateImage } from "../../utils/settings.utils";
import type { User } from "../../utils/userauth.utils";
import { env } from "../../plugins/env.plugin";
import { setdefaultgame } from "../../utils/settings.utils";
import { addNewPlayerState } from "../../utils/profile.utils";
import { setTwoFACountById } from "../../utils/userauth.utils";
import bcrypt from "bcrypt";

export async function handle_Signin(
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply,
	user: User
) {
	try {
		const userinfo: User | null = await getuser(fastify, user.username);

		if (!userinfo)
			return reply
				.code(400)
				.send({
					message: "User not found !",
					type: "username",
					login: false,
					TypeError: "errorUserNotFound",
				});
		const passwordMatch = await bcrypt.compare(
			user.password,
			userinfo.password
		);
		if (!passwordMatch)
			return reply
				.code(400)
				.send({
					message: "invalid password !",
					type: "password",
					login: false,
					TypeError: "errorInvalidPassword",
				});
		if (userinfo?.twoFA) {
			await sendemail(fastify, userinfo);
			return reply
				.code(201)
				.send({
					message: `send 2FA to ${userinfo.email}`,
					login: true,
					twofa: true,
				});
		}
		await generateRefreshToken(fastify, reply, userinfo.username);
		await generateAccessToken(fastify, reply, userinfo);
		return reply
			.code(200)
			.send({ message: "done !", login: true, twofa: false });
	} catch (Err) {
		request.code(400).send(Err);
	}
}

export async function handel_verifytwofa(
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { username, twofa } = request.body as {
		username: string;
		twofa: number;
	};
	const userinfo: User | null = await getuser(fastify, username);
	if (userinfo === null)
		return reply
			.code(400)
			.send({ message: "user not found", login: false, twofa: true });
	else {
		const expiry = new Date(userinfo?.twoFA_expiry || "");
		if (new Date() > expiry) {
			await setTwofAcode(fastify, userinfo.username, 0);
			return reply
				.code(400)
				.send({
					message:
						"For your security, you have up to three attempts to enter the 2FA code.",
					login: false,
					twofa: false,
					type: "errorMaxAttempts",
				});
		} else if (userinfo?.twoFA_code !== twofa) {
			if (userinfo.twoFA_count !== 3) {
				await setTwoFACountById(
					fastify,
					userinfo.id || 0,
					userinfo.twoFA_count + 1
				);
				return reply
					.code(400)
					.send({
						message: "your 2fa code not correct try again !",
						login: false,
						twofa: true,
						type: "errorInvalidCode",
					});
			} else {
				await setTwoFACountById(fastify, userinfo.id || 0, 0);
				return reply
					.code(400)
					.send({
						message:
							"For your security, you have up to three attempts to enter the 2FA code.",
						login: false,
						twofa: false,
						type: "errorMaxAttempts",
					});
			}
		} else {
			await generateRefreshToken(fastify, reply, userinfo.username);
			await generateAccessToken(fastify, reply, userinfo);
			return reply
				.code(200)
				.send({ message: `hello mr.${userinfo.username}`, login: true });
		}
	}
}

export async function handle_googlesign(
	fastify: FastifyInstance,
	request: FastifyRequest,
	reply: FastifyReply
) {
	const token =
		await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
	const data = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
		headers: {
			Authorization: `Bearer ${token.token.access_token}`,
		},
	});
	const userInfo = (await data.json()) as {
		email: string;
		given_name: string;
		family_name: string;
		picture: string;
	};
	const user = await getuser_email(fastify, userInfo.email);
	if (!user) {
		const username = generateusername(userInfo.email);
		const newuser: User = {
			id: 0,
			username: username,
			display_name: username,
			email: userInfo.email,
			family_name: userInfo.family_name,
			first_name: userInfo.given_name,
		};
		await addNewUser(fastify, newuser);
		newuser.id = (await getuserid(fastify, newuser.username)) || 0;
		await setdefaultgame(fastify, newuser.id);
		await addNewPlayerState(fastify, newuser.id);
		await updateImage(fastify, username, userInfo.picture);
		await generateRefreshToken(fastify, reply, username);
		await generateAccessToken(fastify, reply, newuser);
	} else {
		await generateRefreshToken(fastify, reply, user.username);
		await generateAccessToken(fastify, reply, user);
	}
	return reply.redirect(`${env.REDERCURL}`);
}
