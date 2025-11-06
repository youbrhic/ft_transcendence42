"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oauth2_1 = __importDefault(require("@fastify/oauth2"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const env_plugin_1 = require("./env.plugin");
const authplugin = async (fastify) => {
    fastify.register(oauth2_1.default, {
        name: "googleOAuth2",
        scope: ['profile', 'email'],
        credentials: {
            client: {
                id: `${env_plugin_1.env.CLIENT_ID}`,
                secret: `${env_plugin_1.env.CLIENT_SECRUT}`,
            },
            auth: oauth2_1.default.GOOGLE_CONFIGURATION
        },
        startRedirectPath: '/login/google',
        callbackUri: `${env_plugin_1.env.CALLBACKURL}`
    });
};
exports.default = (0, fastify_plugin_1.default)(authplugin);
