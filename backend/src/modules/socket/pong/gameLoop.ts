import { games } from './gameManager';
import { paddleDirections } from './gameManager';
import { handleScoring, clamp, checkPaddleCollision } from './gameUtils';
import { pongGameEventProps } from './interfaces';
import { tournaments } from './tournamentStore';

const baseWidth = 600;
const baseHeight = 400;
const paddleW = 12;
const paddleH = 70;
const ballR = 10;
const paddleOffset = 20;
const maxBallSpeed = 20;
const initialBallSpeed = 3;
const speed = 10;

export function startGameLoop(pongGameEvent: pongGameEventProps) {
  const io = pongGameEvent.io;

  // Precompute constants
  const paddleLeftX = paddleOffset;
  const paddleRightX = baseWidth - paddleOffset - paddleW;

  // Preallocate reusable objects
  const paddleMovement = { left: 0, right: 0 };
  const leftPaddleRect = { top: 0, bottom: 0, left: paddleLeftX, right: paddleLeftX + paddleW };
  const rightPaddleRect = { top: 0, bottom: 0, left: paddleRightX, right: paddleRightX + paddleW };

  setInterval(() => {
    for (const [roomId, game] of games.entries()) {
      if (game.players.length !== 2 || !game.ready) continue;

      const state = game.state;
      const inputs = paddleDirections.get(roomId) || new Map();

      // Reset paddle movement
      paddleMovement.left = 0;
      paddleMovement.right = 0;

      // Handle paddle movement
      for (const [, input] of inputs.entries()) {
        const dir = input.direction;
        const side = input.side;
        if (side === 'left') {
          paddleMovement.left = dir;
          state.paddles.left = clamp(
            state.paddles.left + dir * speed,
            0,
            baseHeight - paddleH
          );
        } else {
          paddleMovement.right = dir;
          state.paddles.right = clamp(
            state.paddles.right + dir * speed,
            0,
            baseHeight - paddleH
          );
        }
      }

      // Update paddle rectangles
      leftPaddleRect.top = state.paddles.left;
      leftPaddleRect.bottom = state.paddles.left + paddleH;
      rightPaddleRect.top = state.paddles.right;
      rightPaddleRect.bottom = state.paddles.right + paddleH;

      const ball = state.ball;
      const prevBallX = ball.x;
      const prevBallY = ball.y;

      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collision with top/bottom walls (Edge collision detection)
      if (ball.y - ballR <= 0 || ball.y + ballR >= baseHeight) {
        ball.dy *= -1; // Reverse vertical direction
        ball.y = clamp(ball.y, ballR, baseHeight - ballR); // Clamp position within bounds
      }

      // Paddle collisions
      if (
        ball.dx < 0 &&
        checkPaddleCollision(prevBallX, ball.x, ball.y, ballR, leftPaddleRect, true)
      ) {
        ball.x = leftPaddleRect.right + ballR;
        const relativeIntersectY = (ball.y - leftPaddleRect.top) / paddleH - 0.5;
        ball.dy = relativeIntersectY * 8;
        ball.dx = Math.min(Math.abs(ball.dx) * 1.1, maxBallSpeed);
      } else if (
        ball.dx > 0 &&
        checkPaddleCollision(prevBallX, ball.x, ball.y, ballR, rightPaddleRect, false)
      ) {
        ball.x = rightPaddleRect.left - ballR;
        const relativeIntersectY = (ball.y - rightPaddleRect.top) / paddleH - 0.5;
        ball.dy = relativeIntersectY * 8;
        ball.dx = -Math.min(Math.abs(ball.dx) * 1.1, maxBallSpeed);
      }

      // Anti-stuck protection
      const ballInsideLeft =
        ball.x + ballR > leftPaddleRect.left &&
        ball.x - ballR < leftPaddleRect.right &&
        ball.y + ballR > leftPaddleRect.top &&
        ball.y - ballR < leftPaddleRect.bottom;

      const ballInsideRight =
        ball.x + ballR > rightPaddleRect.left &&
        ball.x - ballR < rightPaddleRect.right &&
        ball.y + ballR > rightPaddleRect.top &&
        ball.y - ballR < rightPaddleRect.bottom;

      if (ball.dx < 0 && ballInsideLeft) {
        ball.dx = Math.min(Math.abs(ball.dx), maxBallSpeed);
        ball.x = leftPaddleRect.right + ballR;
      }

      if (ball.dx > 0 && ballInsideRight) {
        ball.dx = -Math.min(Math.abs(ball.dx), maxBallSpeed);
        ball.x = rightPaddleRect.left - ballR;
      }

      // Handle scoring
      const gameEnded = handleScoring(
        pongGameEvent.fastify,
        ball,
        state,
        game,
        roomId,
        baseWidth,
        baseHeight,
        initialBallSpeed,
        io,
        tournaments,
        games,
        paddleDirections
      );

      if (gameEnded) continue;

      // Emit game state to players (batch updates if needed)
      io.to(roomId).emit('gameState', {
        ball,
        paddles: state.paddles,
        score: state.score,
        players: game.players,
        roomId,
      });

      // Tournament updates (optimize lookups)
      if (game.gameType === "tournament") {
        const tournament = Object.values(tournaments).find((t: any) =>
          t.matches.some((m: any) => m.roomId === roomId)
        );

        if (tournament) {
          const match = (tournament as any).matches.find((m: any) => m.roomId === roomId);
          if (match && match.state) {
            match.state.score = state.score;
          }

          io.to(`tournament:${(tournament as any).id}`).emit('tournament-match-update', {
            tournamentId: (tournament as any).id,
            roomId: roomId,
            score: state.score,
            players: game.players,
            status: 'in_progress',
          });
        }
      }
    }
  }, 1000 / 60);
}