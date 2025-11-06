"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle_Signin = handle_Signin;
exports.handel_verifytwofa = handel_verifytwofa;
exports.handle_googlesign = handle_googlesign;
const userauth_services_1 = require("./userauth.services");
const userauth_utils_1 = require("../../utils/userauth.utils");
const env_plugin_1 = require("../../plugins/env.plugin");
async function handle_Signin(fastify, request, reply, user) {
    const userinfo = await (0, userauth_utils_1.getuser)(fastify, user.username);
    reply.clearCookie('accessToken', { path: '/' });
    reply.clearCookie('refreshtoken', { path: '/login/refreshtoken' });
    reply.clearCookie('refreshtoken', { path: '/' });
    if (!userinfo)
        return reply.code(400).send({ message: 'User not found !', type: 'username', login: false });
    else if (userinfo.password !== user.password)
        return reply.code(400).send({ message: 'invalid password !', type: 'password', login: false });
    if (userinfo?.twoFA) {
        await (0, userauth_services_1.sendemail)(fastify, userinfo);
        return reply.code(201).send({ message: `send 2FA to ${userinfo.email}`, login: true, twofa: true });
    }
    await (0, userauth_services_1.generateAccessToken)(fastify, reply, userinfo);
    await (0, userauth_services_1.generateRefreshToken)(fastify, reply, userinfo.username);
    return reply.code(200).send({ message: 'done !', login: true, twofa: false });
}
async function handel_verifytwofa(fastify, request, reply) {
    const { username, twofa } = request.body;
    const userinfo = await (0, userauth_utils_1.getuser)(fastify, username);
    reply.clearCookie('accessToken', { path: '/' });
    reply.clearCookie('refreshtoken', { path: '/login/refreshtoken' });
    reply.clearCookie('refreshtoken', { path: '/' });
    if (userinfo === null)
        return reply.code(400).send({ message: "user not found", login: false });
    else {
        if (userinfo?.twoFA_code !== twofa) {
            return reply.code(400).send({ message: "your 2fa code not correct try again !", login: false });
        }
        else {
            await (0, userauth_services_1.generateAccessToken)(fastify, reply, userinfo);
            await (0, userauth_services_1.generateRefreshToken)(fastify, reply, userinfo.username);
            return reply.code(200).send({ message: `hello mr.${userinfo.username}`, login: true });
        }
    }
}
async function handle_googlesign(fastify, request, reply) {
    const token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    const data = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            Authorization: `Bearer ${token.token.access_token}`
        }
    });
    reply.clearCookie('accessToken', { path: '/' });
    reply.clearCookie('refreshtoken', { path: '/login/refreshtoken' });
    reply.clearCookie('refreshtoken', { path: '/' });
    const userInfo = await data.json();
    const user = await (0, userauth_utils_1.getuser_email)(fastify, userInfo.email);
    if (!user) {
        const username = (0, userauth_services_1.generateusername)(userInfo.email);
        const newuser = { username: username, email: userInfo.email, family_name: userInfo.family_name, first_name: userInfo.given_name, image_url: userInfo.picture };
        await (0, userauth_utils_1.addNewUser)(fastify, newuser);
        await (0, userauth_services_1.generateAccessToken)(fastify, reply, newuser);
        await (0, userauth_services_1.generateRefreshToken)(fastify, reply, username);
    }
    else {
        await (0, userauth_services_1.generateAccessToken)(fastify, reply, user);
        await (0, userauth_services_1.generateRefreshToken)(fastify, reply, user.username);
    }
    return reply.redirect(`${env_plugin_1.env.REDERCURL}`);
}
