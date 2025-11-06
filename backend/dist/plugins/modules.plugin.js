"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = allmodulesPlugins;
const userauth_1 = __importDefault(require("../modules/userauth"));
function allmodulesPlugins(fastify) {
    fastify.register(userauth_1.default);
}
