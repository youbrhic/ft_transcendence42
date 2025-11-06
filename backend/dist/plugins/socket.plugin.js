"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupSocketIO;
const auth_middleware_1 = __importDefault(require("../modules/socket/userdata/auth.middleware"));
const chat_handlers_1 = __importDefault(require("../modules/socket/chat/chat.handlers"));
const game_handlers_1 = __importDefault(require("../modules/socket/tictactoe/game.handlers"));
const user_handlers_1 = __importDefault(require("../modules/socket/userdata/user.handlers"));
const pong_game_handlers_1 = __importDefault(require("../modules/socket/pong/pong.game.handlers"));
const gameLoop_1 = require("../modules/socket/pong/gameLoop");
function setupSocketIO(fastify, io) {
    const db = fastify.db;
    const authMiddleware = (0, auth_middleware_1.default)(fastify);
    io.use(authMiddleware);
    io.on("connection", (socket) => {
        console.log(" User connected:", socket.id);
        (0, user_handlers_1.default)({ fastify, io, socket });
        (0, chat_handlers_1.default)({ fastify, io, socket });
        (0, game_handlers_1.default)({ fastify, io, socket });
        (0, pong_game_handlers_1.default)({ fastify, io, socket });
        socket.on("disconnect", () => {
            console.log("---------------> User disconnected:", socket.id);
        });
    });
    (0, gameLoop_1.startGameLoop)({ fastify, io });
}
