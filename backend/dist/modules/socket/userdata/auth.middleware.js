"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createAuthMiddleware;
const cookie_1 = require("cookie");
function createAuthMiddleware(fastify) {
    return async (socket, next) => {
        try {
            const cookiesHeader = socket.request.headers.cookie;
            if (!cookiesHeader) {
                throw new Error("No cookie transmitted.");
            }
            const parsedCookies = (0, cookie_1.parse)(cookiesHeader);
            const token = parsedCookies.accessToken;
            if (!token) {
                throw new Error("No access token.");
            }
            const decodedToken = await fastify.jwt.verify(token);
            socket.user = decodedToken;
            console.log("------>User authenticated:", decodedToken);
            next();
        }
        catch (error) {
            console.log("Authentication failed:", error);
            next(new Error("Authentication failed"));
        }
    };
}
