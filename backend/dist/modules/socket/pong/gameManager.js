"use strict";
// gameManager.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.games = void 0;
exports.createGame = createGame;
exports.getGame = getGame;
exports.addPlayerToGame = addPlayerToGame;
exports.removeGame = removeGame;
exports.games = new Map();
/**
 * Create a new game with initial state and store it in the games map
 */
function createGame(roomId) {
    const initialState = {
        ball: {
            x: 600 / 2,
            y: 400 / 2,
            dx: 3,
            dy: 3,
        },
        paddles: {
            left: 400 / 2 - 70 / 2,
            right: 400 / 2 - 70 / 2,
        },
        score: {
            left: 0,
            right: 0,
        },
    };
    exports.games.set(roomId, {
        players: [],
        playerNamesAndsockId: [],
        ready: false,
        state: initialState,
    });
}
/**
 * Retrieve the game object by roomId
 */
function getGame(roomId) {
    return exports.games.get(roomId);
}
/**
 * Add a player to a game if there's space and not already added
 */
function addPlayerToGame({ roomId, playerName, socketId }) {
    const game = exports.games.get(roomId);
    if (!game)
        return false;
    if (game.players.length >= 2)
        return false;
    if (game.players.includes(playerName))
        return false;
    game.players.push(playerName);
    game.playerNamesAndsockId.push({
        name: playerName,
        sockId: socketId,
    });
    return true;
}
/**
 * Remove a game completely by roomId
 */
function removeGame(roomId) {
    exports.games.delete(roomId);
}
