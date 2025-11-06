import { rejects } from "assert"
import { error } from "console"
import fastify, { FastifyInstance } from "fastify"
import { get, request } from "http"
import { resolve } from "path"
import { profile_setting, game_setting, security_settings, tictac_setting } from './settings.schema'
import { getuser, getuserid, getUserLanguage } from "../../utils/userauth.utils"
import { type User } from "../../utils/userauth.utils"
import { UpdateProfile, getdisplay_name } from "../../utils/settings.utils"
import { v2 as cloudinary } from 'cloudinary';
import { getgameinfo, UpdateGame, UpdateTicTac, getTicTacinfo, isDisplayNameTaken } from "../../utils/settings.utils"
import type { gameinfo, securityinfo, ticTacinfo } from "../../utils/settings.utils";
import { setpassword } from "../../utils/settings.utils"
import { settwoFA } from "../../utils/settings.utils"
import { generateAccessToken, generateRefreshToken } from "../userauth/userauth.services"
import bcrypt from 'bcrypt';

export const profile = async (fastify: FastifyInstance) => {
	fastify.put('/profile', {
		schema: {
			body: profile_setting
		}
	}, async (request, reply) => {
		try {
			``
			const token = request.cookies.accessToken;
			if (!token) {
				return reply.code(401).send({ userinfo: false, message: "No access token in cookies", accesstoken: false, refreshtoken: true });
			}
			const decodetoken = fastify.jwt.decode(token) as { username: string, display_name: string };
			const newuser = request.body as User;
			const user = await getuser(fastify, newuser.username);
			const DisplayNameistaken = await isDisplayNameTaken(fastify, newuser.display_name);
			const usernameDisplayNameTakenErrors: any = {
				en: {
					username_taken_error: "This username is already taken!",
					display_name_taken_error: "This display name is already taken!",
				},
				fr: {
					username_taken_error: "Ce nom d'utilisateur est déjà pris !",
					display_name_taken_error: "Ce nom d'affichage est déjà pris !",
				},
				es: {
					username_taken_error: "¡Este nombre de usuario ya está en uso!",
					display_name_taken_error: "¡Este nombre para mostrar ya está en uso!",
				},
			};
			const lang = await getUserLanguage(fastify, decodetoken.username);
			if (user && (user.username !== decodetoken.username)) {
				return reply.code(400).send({ message: `${usernameDisplayNameTakenErrors[lang || 'en']?.username_taken_error}`, type: 'username', login: false , errorexplain: true});
			} else if (DisplayNameistaken && newuser.display_name !== decodetoken.display_name) {
				return reply.code(400).send({ message: `${usernameDisplayNameTakenErrors[lang || 'en']?.display_name_taken_error}`, type: `display_name`, login: false , errorexplain: true});
			}
			await UpdateProfile(fastify, newuser, decodetoken.username);
			const userinfo = await getuser(fastify, newuser.username);
			if (!userinfo)
				return reply.code(400).send({ message: 'User not found!' });
			await generateAccessToken(fastify, reply, userinfo);
			await generateRefreshToken(fastify, reply, userinfo.username);
			return reply.send({ message: "Your profile is updated successfully" });
		} catch (err) {
			reply.code(400).send({ error: (err as Error).message });
		}
	});
}

export const GetUrlimage = async (fastify: FastifyInstance) => {
	fastify.post('/imageUrl', async (req, reply) => {
		try {
			const data = await req.file();
			if (!data)
				return reply.code(400).send({ message: 'Only image files are allowed' });
			if (!data.mimetype.startsWith('image/'))
				return reply.code(400).send({ message: 'Only image files are allowed' });
			const result = await new Promise((resolve, reject) => {
				const uploadStream = req.server.cloudinary.uploader.upload_stream(
					{ public_id: data?.filename},
					(error, result) => {
						if (error) return reject(error);
						resolve(result);
					}
				);
				data.file.pipe(uploadStream);
			});
			const typedResult = result as { secure_url: string };
			reply.send({ message: 'Image uploaded', url: typedResult.secure_url });
		} catch (err) {
			reply.code(400).send({ message: "Can't upload this image" });
		}
	})
}

// PING PONG
export const GameSettings = async (fastify: FastifyInstance) => {
	fastify.put('/game', {
		schema: {
			body: game_setting
		}
	}, async (request, reply) => {
		try {
			const token = request.cookies.accessToken;
			if (!token) {
				return reply.code(401).send({ userinfo: false, message: "No access token in cookies", accesstoken: false, refreshtoken: true });
			}
			const decodetoken = fastify.jwt.decode(token) as { username: string };
			const gameinfo = request.body as gameinfo;
			const id = await getuserid(fastify, decodetoken.username) || 0;
			await UpdateGame(fastify, gameinfo, id);
		} catch (err) {
			reply.code(400).send({ message: (err as Error).message });
		}
	})
}

export const GetGameInfo = async (fastify: FastifyInstance) => {
	fastify.get('/gameinfo', async (request, reply) => {
		try {
			const token = request.cookies.accessToken;
			if (!token) {
				return reply.code(401).send({ userinfo: false, message: "No access token in cookies", accesstoken: false, refreshtoken: true });
			}
			const decodetoken = fastify.jwt.decode(token) as { username: string };
			const id = await getuserid(fastify, decodetoken.username) || 0;
			const gameinfo = await getgameinfo(fastify, id);
			return reply.send({ ball_color: gameinfo?.ball_color, paddle_color: gameinfo?.paddle_color, table_color: gameinfo?.table_color });
		} catch (err) {
			reply.code(400).send({ message: (err as Error).message });
		}
	})
}

//TIC TAC
export const TicTacSettings = async (fastify: FastifyInstance) => {
	fastify.put('/tictac', {
		schema: {
			body: tictac_setting
		}
	}, async (request, reply) => {
		try {
			const token = request.cookies.accessToken;
			if (!token) {
				return reply.code(401).send({ userinfo: false, message: "No access token in cookies", accesstoken: false, refreshtoken: true });
			}
			const decodetoken = fastify.jwt.decode(token) as { username: string };
			const ticTacinfo = request.body as ticTacinfo;
			const id = await getuserid(fastify, decodetoken.username) || 0;
			await UpdateTicTac(fastify, ticTacinfo, id);
		} catch (err) {
			reply.code(400).send({ message: (err as Error).message });
		}
	})
}

export const GetTicTacInfo = async (fastify: FastifyInstance) => {
	fastify.get('/tictacinfo', async (request, reply) => {
		try {
			const token = request.cookies.accessToken;
			if (!token) {
				return reply.code(401).send({ userinfo: false, message: "No access token in cookies", accesstoken: false, refreshtoken: true });
			}
			const decodetoken = fastify.jwt.decode(token) as { username: string };
			const id = await getuserid(fastify, decodetoken.username) || 0;
			const ticTacinfo = await getTicTacinfo(fastify, id);
			return reply.send({ x_color: ticTacinfo?.x_color, o_color: ticTacinfo?.o_color, grid_color: ticTacinfo?.grid_color, board_color: ticTacinfo?.board_color, errorexplain: true });
		} catch (err) {
			reply.code(400).send({ message: (err as Error).message });
		}
	})
}

export const UpateSecurity = async (fastify: FastifyInstance) => {
	fastify.put('/security', {
		schema: {
			body: security_settings
		}
	}, async (request, reply) => {
		try {
			const body = request.body as securityinfo;
			const token = request.cookies.accessToken;
			if (!token)
				return reply.code(401).send({ userinfo: false, message: "No access token in cookies", accesstoken: false, refreshtoken: true });
			const decodetoken = fastify.jwt.decode(token) as { username: string };
			const user = await getuser(fastify, decodetoken.username);
			if (!user){
				throw 'user not found';
				return;
			}
			const passwordUpdateErrors: any = {
				en: {
					incorrect_old_password: "The current password you entered is incorrect. Please try again.",
					password_mismatch: "New password and confirmation do not match. Please check and try again."
				},
				fr: {
					incorrect_old_password: "Le mot de passe actuel que vous avez saisi est incorrect. Veuillez réessayer.",
					password_mismatch: "Le nouveau mot de passe et la confirmation ne correspondent pas. Veuillez vérifier et réessayer."
				},
				es: {
					incorrect_old_password: "La contraseña actual que ingresaste es incorrecta. Por favor, inténtalo de nuevo.",
					password_mismatch: "La nueva contraseña y su confirmación no coinciden. Por favor, verifica e inténtalo de nuevo."
				}
			};
			const lang = await getUserLanguage(fastify, decodetoken.username);
			if (body.password !== undefined) {
				const passwordMatch = await bcrypt.compare(body.oldpassowrd, user?.password);
				if (!passwordMatch) {
					return (reply.code(400).send({ type: "oldpassowrd", message: `${passwordUpdateErrors[lang || 'en']?.incorrect_old_password}` , errorexplain: true}));
				}
				else if (body.password !== body.confirmpassword)
					return (reply.code(400).send({ type: 'confirmpassword', message: `${passwordUpdateErrors[lang || 'en']?.password_mismatch}` , errorexplain: true}));
				body.password= await bcrypt.hash(body.password, 10);
				await setpassword(fastify, user.username, body.password);
			}
			if (body.twoFA !== undefined) {
				await settwoFA(fastify, user?.username || "", body.twoFA);
			}
		} catch (err) {
			reply.code(400).send({ message: (err as Error).message });
		}
	})
}
//oldpassowrd → oldpassword

// the body : =>  {
// 	srcs-backend-1  |   oldpassowrd: '123456789',
// 	srcs-backend-1  |   password: 'yassine20022002',
// 	srcs-backend-1  |   confirmpassword: 'yassine2002002'
// 	srcs-backend-1  | }

//he body : =>  { password: '123456789', confirmpassword: '123456789' }