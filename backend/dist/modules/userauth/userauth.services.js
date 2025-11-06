"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateusername = exports.sendemail = exports.generateAccessToken = exports.generateRefreshToken = void 0;
const userauth_utils_1 = require("../../utils/userauth.utils");
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_plugin_1 = require("../../plugins/env.plugin");
const generateRefreshToken = async (fastify, reply, username) => {
    const token = await fastify.jwt.sign({ username: `${username}` }, { expiresIn: '7d' });
    reply.setCookie('refreshtoken', token, {
        path: '/login/refreshtoken',
        secure: false,
        httpOnly: true,
        sameSite: true
    });
    return token;
};
exports.generateRefreshToken = generateRefreshToken;
const generateAccessToken = async (fastify, reply, user) => {
    reply.clearCookie('accessToken', { path: '/' });
    const token = await fastify.jwt.sign({ userid: user.id, username: user.username, email: user.email }, { expiresIn: '1h' });
    reply.setCookie('accessToken', token, {
        path: '/',
        secure: false,
        httpOnly: true,
        sameSite: true
    });
    return token;
};
exports.generateAccessToken = generateAccessToken;
const sendemail = async (fastify, userinfo) => {
    const transporter = await nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_ACCOUNT,
            pass: process.env.GMAIL_PASSWORD
        }
    });
    const code = await Math.floor(100000 + Math.random() * 900000);
    const mailOptions = {
        from: env_plugin_1.env.GMAIL_ACCOUNT,
        to: `${userinfo.email}`,
        subject: '2fa from my web project',
        text: `the 2FA code ${code.toString()} !`
    };
    await transporter.sendMail(mailOptions);
    await (0, userauth_utils_1.setTwofAcode)(fastify, userinfo.username, code);
    console.log("the code : ", code);
};
exports.sendemail = sendemail;
const generateusername = (email) => {
    const username = email.replace("@gmail.com", "");
    return (username);
};
exports.generateusername = generateusername;
