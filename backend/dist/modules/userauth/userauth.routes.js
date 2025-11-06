"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSign = exports.RefreshToken = exports.Verify2fa = exports.Signin = exports.SignUp = void 0;
const userauth_schema_1 = require("./userauth.schema");
const userauth_utils_1 = require("../../utils/userauth.utils");
const userauth_controller_1 = require("./userauth.controller");
const userauth_services_1 = require("./userauth.services");
const env_plugin_1 = require("../../plugins/env.plugin");
const SignUp = async (fastify) => {
    fastify.post('/signup', {
        schema: {
            body: userauth_schema_1.user_signup
        }
    }, async (request, reply) => {
        const user = request.body;
        try {
            if (user.password != user.confirmpassword)
                throw ({ message: 'the password  and confirm password are not the same !', type: "confirmpassword", singup: false });
            else {
                await (0, userauth_utils_1.addNewUser)(fastify, user);
                return reply.code(201).send({ message: "the user is created ", singup: true });
            }
        }
        catch (err) {
            if (err instanceof Error && "message" in err) {
                const msg = err.message.toLowerCase();
                if (msg.includes("user_authentication.username")) {
                    reply.code(400).send({ message: "Username is already taken", type: "username", signup: false });
                }
                else if (msg.includes("user_authentication.email")) {
                    reply.code(400).send({ message: "Email is already in use", type: "email", signup: false });
                }
                else {
                    reply.code(400).send({ message: err.message, signup: false });
                }
            }
            else {
                reply.code(400).send({ message: "something wrong !", signup: false });
            }
        }
    });
};
exports.SignUp = SignUp;
const Signin = async (fastify) => {
    fastify.post('/signin', {
        schema: {
            body: userauth_schema_1.user_signin
        }
    }, async (request, reply) => {
        try {
            const user = request.body;
            await (0, userauth_controller_1.handle_Signin)(fastify, request, reply, user);
        }
        catch (err) {
            reply.code(400).send(err);
        }
    });
};
exports.Signin = Signin;
const Verify2fa = async (fastify) => {
    fastify.post('/verify2fa', {
        schema: {
            body: userauth_schema_1.user_Verify2fa
        }
    }, async (request, reply) => {
        try {
            await (0, userauth_controller_1.handel_verifytwofa)(fastify, request, reply);
        }
        catch (err) {
            reply.code(400).send({ message: 'something wrong !', error: err, login: false });
        }
    });
};
exports.Verify2fa = Verify2fa;
const RefreshToken = async (fastify) => {
    fastify.get('/refreshtoken', async (request, reply) => {
        try {
            const refreshtoken = request.cookies.refreshtoken;
            if (!refreshtoken) {
                return reply.code(400).send({
                    message: "Refresh token expired",
                    "refreshtoken": false
                });
            }
            const decoded = fastify.jwt.verify(refreshtoken);
            const user = await (0, userauth_utils_1.getuser)(fastify, decoded.username);
            if (!user) {
                return reply.code(404).send({ message: "User not found", refreshtoken: true });
            }
            const accessToken = await (0, userauth_services_1.generateAccessToken)(fastify, reply, user);
            return reply.send({ message: "new access token created ", refreshtoken: true });
        }
        catch (err) {
            return reply.code(400).send({ message: "Invalid refresh token", error: err, refreshtoken: false });
        }
    });
};
exports.RefreshToken = RefreshToken;
const GoogleSign = async (fastify) => {
    fastify.get('/google/callback', async (request, reply) => {
        try {
            await (0, userauth_controller_1.handle_googlesign)(fastify, request, reply);
        }
        catch (err) {
            console.log("The Error : ", err);
            return reply.redirect(`${env_plugin_1.env.REDERCURL}login/Signin`);
        }
    });
};
exports.GoogleSign = GoogleSign;
