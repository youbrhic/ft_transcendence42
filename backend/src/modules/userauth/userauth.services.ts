import fastify, { FastifyInstance, FastifyReply } from "fastify";
import { setTwofAcode } from "../../utils/userauth.utils";
import type { User } from '../../utils/userauth.utils'
import nodemailer from 'nodemailer';
import { env } from '../../plugins/env.plugin';

export const generateRefreshToken = async (fastify: FastifyInstance, reply: FastifyReply, username: string): Promise<string> => {
	const token = await fastify.jwt.sign({ username: `${username}` }, { expiresIn: '7d' });
	reply.setCookie('refreshtoken', token, {
		path: '/api/login/refreshtoken',
		secure: false,
		httpOnly: true,
		sameSite: 'strict'
	});
	return token;
}

export const generateAccessToken = async (fastify: FastifyInstance, reply: FastifyReply, user: User): Promise<string> => {
	const token = await fastify.jwt.sign({ userid: user.id, username: user.username, display_name: user.display_name }, { expiresIn: '1h' });
	reply.setCookie('accessToken', token, {
		path: '/',
		secure: false,
		httpOnly: true,
		sameSite: 'strict'
	});
	return token;
}

export const sendemail = async (fastify: FastifyInstance, userinfo: User) => {
	const transporter = await nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: env.GMAIL_ACCOUNT,
			pass: env.GMAIL_PASSWORD,
		},
	});

	const code: number = Math.floor(100000 + Math.random() * 900000);
	const mailOptions = {
		from: env.GMAIL_ACCOUNT,
		to: `${userinfo.email}`,
		subject: '2fa from ft_transcendence(imik n lweb, ya rayak)',
		html: `
		<div style="
		  font-family: Arial, sans-serif; 
		  background-color: #f0f4f8; 
		  padding: 20px; 
		  border-radius: 8px; 
		  max-width: 400px; 
		  margin: auto; 
		  text-align: center; 
		  color: #333;
		  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		">
		  <h2 style="color: #1a73e8;">Your 2FA Code</h2>
		  <p style="font-size: 16px;">Use the following code to complete your login:</p>
		  <p style="
			font-size: 28px; 
			font-weight: bold; 
			letter-spacing: 6px; 
			color: #2e7d32; 
			margin: 20px 0;
		  ">
			${code}
		  </p>
		</div>
	  `,
	};
	await transporter.sendMail(mailOptions);
	await setTwofAcode(fastify, userinfo.username, code);
};

export const generateusername = (email: string) => {
	const username = email.replace("@gmail.com", "");
	return (username);
}
