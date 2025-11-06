"use strict";
/// <reference types="../types/fastify" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const database_plugin_1 = __importDefault(require("./plugins/database.plugin"));
const modules_plugin_1 = __importDefault(require("./plugins/modules.plugin"));
const jwt_plugin_1 = __importDefault(require("./plugins/jwt.plugin"));
const cookie_plugin_1 = __importDefault(require("./plugins/cookie.plugin"));
const oauth2_plugin_1 = __importDefault(require("./plugins/oauth2.plugin"));
const cors_1 = __importDefault(require("@fastify/cors"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const socket_io_1 = require("socket.io");
const socket_plugin_1 = __importDefault(require("./plugins/socket.plugin"));
const app = (0, fastify_1.default)({
    ajv: {
        customOptions: {
            allErrors: true,
            $data: true
        },
        plugins: [ajv_errors_1.default]
    }
});
app.register(cors_1.default, {
    origin: true, // React app origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // if you want cookies/auth headers
});
app.register(database_plugin_1.default);
app.register(cookie_plugin_1.default);
app.register(jwt_plugin_1.default);
app.register(oauth2_plugin_1.default);
app.register(modules_plugin_1.default);
app.ready();
app.addHook("onRequest", async (request, reply) => {
    try {
        const publicPaths = ["/login", "/register"];
        const isPublic = publicPaths.some(path => (request.raw.url || "").startsWith(path));
        if (!isPublic) {
            const token = request.cookies.accessToken;
            if (!token) {
                return reply.code(401).send({ message: "No access token in cookies", accesstoken: false, refreshtoken: true });
            }
            await app.jwt.verify(token);
        }
    }
    catch (err) {
        return reply.code(401).send({ message: "Unauthorized", error: err, accesstoken: false, refreshtoken: true });
    }
});
app.get("/hello", (request, reply) => {
    return reply.send({ refreshtoken: true, accesstoken: true });
});
app.get('/logout', (request, reply) => {
    reply.clearCookie('accessToken', { path: '/' });
    reply.clearCookie('refreshtoken', { path: '/login/refreshtoken' });
    return 'logout';
});
app.setErrorHandler((error, request, reply) => {
    if (error.validation && error.validation.length > 0) {
        const firstError = error.validation[0];
        const field = firstError.instancePath.replace(/\//, '') || 'field';
        return reply.status(400).send({ type: field, message: firstError.message });
    }
});
const server = app.server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});
app.ready().then(() => {
    (0, socket_plugin_1.default)(app, io);
});
app.listen({ port: 3000, host: '0.0.0.0' }, (addree) => {
    console.log("127.0.0.1:3000");
});
