"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGameLoop = startGameLoop;
const gameManager_1 = require("./gameManager");
const pong_game_handlers_1 = require("./pong.game.handlers");
const gameUtils_1 = require("./gameUtils");
function startGameLoop(pongGameEvent) {
    const io = pongGameEvent.io;
    const baseWidth = 600;
    const baseHeight = 400;
    const paddleW = 12;
    const paddleH = 70;
    const ballR = 10;
    const paddleOffset = 20;
    const maxBallSpeed = 10;
    const initialBallSpeed = 3;
    // Utility: Clamp value
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    setInterval(() => {
        for (const [roomId, game] of gameManager_1.games.entries()) {
            if (game.players.length !== 2)
                continue;
            const state = game.state;
            const inputs = pong_game_handlers_1.paddleDirections.get(roomId) || new Map();
            const speed = 7;
            // Move paddles
            for (const [, input] of inputs.entries()) {
                const dir = input.direction;
                const side = input.side;
                if (side === 'left') {
                    state.paddles.left = clamp(state.paddles.left + dir * speed, 0, baseHeight - paddleH);
                }
                else {
                    state.paddles.right = clamp(state.paddles.right + dir * speed, 0, baseHeight - paddleH);
                }
            }
            const ball = state.ball;
            // Save previous position before moving
            const prevBallX = ball.x;
            const prevBallY = ball.y;
            // Update ball position
            ball.x += ball.dx;
            ball.y += ball.dy;
            // Bounce off top/bottom
            if (ball.y - ballR <= 0 || ball.y + ballR >= baseHeight) {
                ball.dy *= -1;
                ball.y = clamp(ball.y, ballR, baseHeight - ballR);
            }
            // Paddle positions
            const paddleLeftX = paddleOffset;
            const paddleLeftY = state.paddles.left;
            const paddleRightX = baseWidth - paddleOffset - paddleW;
            const paddleRightY = state.paddles.right;
            // Collision with left paddle using previous position
            const crossedLeftPaddle = prevBallX - ballR >= paddleLeftX + paddleW &&
                ball.x - ballR <= paddleLeftX + paddleW &&
                ball.y + ballR >= paddleLeftY &&
                ball.y - ballR <= paddleLeftY + paddleH;
            if (ball.dx < 0 && crossedLeftPaddle) {
                ball.x = paddleLeftX + paddleW + ballR;
                const relativeIntersectY = (ball.y - paddleLeftY) / paddleH - 0.5;
                ball.dy = relativeIntersectY * 8;
                ball.dx = Math.min(Math.abs(ball.dx) * 1.1, maxBallSpeed);
            }
            // Collision with right paddle using previous position
            const crossedRightPaddle = prevBallX + ballR <= paddleRightX &&
                ball.x + ballR >= paddleRightX &&
                ball.y + ballR >= paddleRightY &&
                ball.y - ballR <= paddleRightY + paddleH;
            if (ball.dx > 0 && crossedRightPaddle) {
                ball.x = paddleRightX - ballR;
                const relativeIntersectY = (ball.y - paddleRightY) / paddleH - 0.5;
                ball.dy = relativeIntersectY * 8;
                ball.dx = -Math.min(Math.abs(ball.dx) * 1.1, maxBallSpeed);
            }
            // Check scoring
            if (ball.x < 0) {
                state.score.right++;
                if (state.score.right === 7) {
                    io.to(roomId).emit('gameOver', { winner: game.players[1] || 'right' });
                    gameManager_1.games.delete(roomId);
                    pong_game_handlers_1.paddleDirections.delete(roomId);
                    continue;
                }
                (0, gameUtils_1.resetBall)({
                    state,
                    leftScored: false,
                    baseWidth,
                    baseHeight,
                    ballSpeed: initialBallSpeed,
                });
            }
            if (ball.x > baseWidth) {
                state.score.left++;
                if (state.score.left === 7) {
                    io.to(roomId).emit('gameOver', { winner: game.players[0] || 'left' });
                    gameManager_1.games.delete(roomId);
                    pong_game_handlers_1.paddleDirections.delete(roomId);
                    continue;
                }
                (0, gameUtils_1.resetBall)({
                    state,
                    leftScored: true,
                    baseWidth,
                    baseHeight,
                    ballSpeed: initialBallSpeed,
                });
            }
            // Emit state to both players
            io.to(roomId).emit('gameState', {
                ball,
                paddles: state.paddles,
                score: state.score,
                players: game.players,
                roomId,
            });
        }
    }, 1000 / 60); // 60 FPS
}
