"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paddleDirections = void 0;
exports.default = pongGameHandlers;
const uuid_1 = require("uuid");
const gameManager_1 = require("./gameManager");
exports.paddleDirections = new Map();
function pongGameHandlers({ fastify, io, socket }) {
    const userData = socket.user;
    socket.on('join', (playerName) => {
        let roomId = null;
        let isReconnecting = false;
        console.log('joined player name', playerName);
        for (const [id, game] of gameManager_1.games.entries()) {
            const playerIndex = game.players.indexOf(playerName);
            if (playerIndex !== -1) {
                // Reconnect: update socket ID
                const existingPlayer = game.playerNamesAndsockId.find(p => p.name === playerName);
                if (existingPlayer) {
                    existingPlayer.sockId = socket.id;
                }
                roomId = id;
                isReconnecting = true;
                break;
            }
            if (!roomId && game.players.length < 2) {
                roomId = id;
            }
        }
        if (isReconnecting) {
            socket.join(roomId);
            const game = (0, gameManager_1.getGame)(roomId);
            const playerIndex = game?.players.indexOf(playerName);
            socket.emit('init', { player: playerIndex });
            socket.emit('roomId', roomId);
            if (game?.players.length === 2 && game.ready) {
                socket.emit('ready');
            }
            return;
        }
        // New game or join open room
        if (!roomId) {
            roomId = (0, uuid_1.v4)();
            (0, gameManager_1.createGame)(roomId);
        }
        const success = (0, gameManager_1.addPlayerToGame)({
            roomId,
            playerName,
            socketId: socket.id,
        });
        if (!success) {
            socket.emit('full');
            return;
        }
        socket.join(roomId);
        const game = (0, gameManager_1.getGame)(roomId);
        const playerIndex = game?.players.indexOf(playerName);
        socket.emit('init', { player: playerIndex });
        socket.emit('roomId', roomId);
        if (game?.players.length === 2) {
            const allConnected = game.playerNamesAndsockId.every(p => io.sockets.sockets.get(p.sockId));
            if (allConnected) {
                io.to(roomId).emit('ready');
                game.ready = true;
                console.log(game);
            }
        }
    });
    socket.on('paddleMove', ({ side, direction, state, roomId, playerName }) => {
        const game = (0, gameManager_1.getGame)(roomId);
        if (!game || !game.players.includes(playerName))
            return;
        if (!exports.paddleDirections.has(roomId)) {
            exports.paddleDirections.set(roomId, new Map());
        }
        const inputs = exports.paddleDirections.get(roomId);
        if (!inputs.has(playerName)) {
            inputs.set(playerName, { side, direction: 0 });
        }
        const input = inputs.get(playerName);
        input.direction = state === 'start' ? direction : 0;
        console.log(`[paddleMove] ${playerName} moved ${direction} on ${side}`);
    });
    socket.on('scoreUpdate', ({ roomId, score }) => {
        const game = (0, gameManager_1.getGame)(roomId);
        if (game) {
            game.state.score = score;
            io.to(roomId).emit('gameState', game.state);
        }
    });
    socket.on('playerLeft', (playerName) => {
        console.log('playerLeft', playerName);
        for (const [roomId, inputs] of exports.paddleDirections.entries()) {
            if (inputs.has(playerName)) {
                inputs.delete(playerName);
                if (inputs.size === 0) {
                    exports.paddleDirections.delete(roomId);
                }
            }
        }
        for (const [roomId, game] of gameManager_1.games.entries()) {
            const idx = game.players.indexOf(playerName);
            if (idx !== -1) {
                game.players.splice(idx, 1);
                game.playerNamesAndsockId = game.playerNamesAndsockId.filter(p => p.name !== playerName);
                game.ready = false;
                socket.to(roomId).emit('playerLeft', { id: playerName });
                if (game.players.length === 0) {
                    gameManager_1.games.delete(roomId);
                    exports.paddleDirections.delete(roomId);
                    console.log(`Room ${roomId} deleted`);
                }
                else {
                    io.to(roomId).emit('gameOver', { winner: game.players[0] });
                }
                break;
            }
        }
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Clean paddle input state
        for (const [roomId, inputs] of exports.paddleDirections.entries()) {
            for (const [playerName, input] of inputs.entries()) {
                const player = gameManager_1.games.get(roomId)?.playerNamesAndsockId.find(p => p.name === playerName);
                if (player?.sockId === socket.id) {
                    inputs.delete(playerName);
                }
            }
            if (inputs.size === 0) {
                exports.paddleDirections.delete(roomId);
            }
        }
        // Handle game cleanup
        for (const [roomId, game] of gameManager_1.games.entries()) {
            const idx = game.playerNamesAndsockId.findIndex(p => p.sockId === socket.id);
            if (idx !== -1) {
                const playerName = game.playerNamesAndsockId[idx].name;
                game.players.splice(idx, 1);
                game.playerNamesAndsockId.splice(idx, 1);
                game.ready = false;
                io.to(roomId).emit('playerLeft', { id: playerName });
                io.to(roomId).emit('gameOver', { winner: game.players[0] });
                if (game.players.length === 0) {
                    gameManager_1.games.delete(roomId);
                    exports.paddleDirections.delete(roomId);
                    console.log(`Room ${roomId} deleted`);
                }
                break;
            }
        }
    });
}
