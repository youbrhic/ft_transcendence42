"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleUserEvents;
function handleUserEvents({ fastify, io, socket }) {
    const db = fastify.db;
    const userData = socket.user;
    if (userData) {
        console.log("🔵 Sending immediate profile-data for:", userData?.username);
        socket.emit("profile-data", {
            user: userData?.username,
        });
    }
    socket.on("get-my-profile", () => {
        const userData = socket.user;
        console.log("🔵 Sending profile-data for:", userData?.username);
        socket.emit("profile-data", {
            user: userData?.username,
        });
    });
    socket.on("request:init", () => {
        const userData = socket.user;
        socket.emit("profile-data", {
            user: userData?.username,
        });
        db.all("SELECT * FROM user_authentication ORDER BY id ASC", (err, user_authentication) => {
            if (!err) {
                socket.emit("user:list", user_authentication);
                db.all("SELECT * FROM messages ORDER BY timestamp ASC", (err, history) => {
                    if (!err) {
                        console.log("Sending chat history:", history.length, "messages");
                        socket.emit("chat:history", history);
                    }
                });
            }
        });
    });
}
