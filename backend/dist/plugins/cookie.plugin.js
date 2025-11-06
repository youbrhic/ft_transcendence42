"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const cookieplugin = async (fastify) => {
    if (!process_1.env.COOKIE_SECRET)
        throw 'COOKIE_SECRET not found';
    fastify.register(cookie_1.default, {
        secret: process.env.COOKIE_SECRET,
        hook: 'onRequest'
    });
};
exports.default = (0, fastify_plugin_1.default)(cookieplugin);
