"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userauth;
const userauth_routes_1 = require("./userauth.routes");
function userauth(fastify) {
    fastify.register(userauth_routes_1.SignUp, { prefix: '/login' });
    fastify.register(userauth_routes_1.Signin, { prefix: '/login' });
    fastify.register(userauth_routes_1.Verify2fa, { prefix: '/login' });
    fastify.register(userauth_routes_1.RefreshToken, { prefix: '/login' });
    fastify.register(userauth_routes_1.GoogleSign, { prefix: '/login' });
}
