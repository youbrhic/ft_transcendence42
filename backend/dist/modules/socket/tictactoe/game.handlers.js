"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleGameEvents;
const gameState = {
    squares: Array(9).fill(null),
    xIsNext: true,
    playerX: "",
    playerO: "",
    players: [],
};
const gameRoom = "tic-tac-toe";
const playersInRoom = new Map();
const moveTimers = new Map();
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
function resetGameState() {
    gameState.squares = Array(9).fill(null);
    gameState.xIsNext = true;
    gameState.playerX = "";
    gameState.playerO = "";
    gameState.players = [];
    moveTimers.clear();
}
function startTurnTimer(io, currentPlayer) {
    clearTimeout(moveTimers.get(currentPlayer));
    const timeout = setTimeout(() => {
        const loser = currentPlayer;
        const winner = loser === gameState.playerX ? gameState.playerO : gameState.playerX;
        io.to(gameRoom).emit("game:timeout", {
            loser,
            winner,
            message: `${loser} took too long. ${winner} wins!`,
        });
        console.log(`${loser} took too long. ${winner} wins!`);
        resetGameState();
    }, 10000); // 10 seconds
    moveTimers.set(currentPlayer, timeout);
}
function handleGameEvents({ fastify, io, socket }) {
    const userData = socket.user;
    socket.on("join:game", () => {
        if (!userData?.username)
            return;
        const isUsernameTaken = Array.from(playersInRoom.values()).includes(userData.username);
        if (isUsernameTaken) {
            socket.emit("game:error", { message: "Username already taken in this game." });
            return;
        }
        socket.join(gameRoom);
        playersInRoom.set(socket.id, userData.username);
        const numPlayers = playersInRoom.size;
        if (numPlayers === 2) {
            const players = Array.from(playersInRoom.values());
            gameState.playerX = players[0];
            gameState.playerO = players[1];
            gameState.players = players;
            gameState.squares = Array(9).fill(null);
            gameState.xIsNext = true;
            io.to(gameRoom).emit("game:start", {
                playerX: gameState.playerX,
                playerO: gameState.playerO,
            });
            startTurnTimer(io, gameState.playerX);
        }
        else {
            socket.emit("game:waiting");
        }
    });
    socket.on("game:move", ({ index, player }) => {
        clearTimeout(moveTimers.get(player));
        if (!gameState.players.includes(player))
            return;
        if (gameState.squares[index] !== null)
            return;
        const isPlayerX = player === gameState.playerX;
        const isPlayersTurn = (isPlayerX && gameState.xIsNext) || (!isPlayerX && !gameState.xIsNext);
        if (!isPlayersTurn)
            return;
        if (calculateWinner(gameState.squares))
            return;
        gameState.squares[index] = isPlayerX ? "X" : "O";
        gameState.xIsNext = !gameState.xIsNext;
        io.to(gameRoom).emit("game:move", {
            squares: gameState.squares,
            xIsNext: gameState.xIsNext,
        });
        const winner = calculateWinner(gameState.squares);
        if (winner || gameState.squares.every(sq => sq !== null)) {
            moveTimers.forEach(timer => clearTimeout(timer));
            return;
        }
        const nextPlayer = gameState.xIsNext ? gameState.playerX : gameState.playerO;
        startTurnTimer(io, nextPlayer);
    });
    socket.on("game:restart", () => {
        if (!userData?.username || !gameState.players.includes(userData.username))
            return;
        gameState.squares = Array(9).fill(null);
        gameState.xIsNext = true;
        io.to(gameRoom).emit("game:restart");
        startTurnTimer(io, gameState.playerX);
    });
    socket.on("leave:game", () => {
        if (playersInRoom.has(socket.id)) {
            const username = playersInRoom.get(socket.id);
            playersInRoom.delete(socket.id);
            socket.leave(gameRoom);
            moveTimers.delete(username);
            if (playersInRoom.size === 1) {
                const [remainingSocketId] = playersInRoom.keys();
                const remainingUsername = playersInRoom.get(remainingSocketId);
                io.to(remainingSocketId).emit("game:win-by-disconnect", {
                    winner: remainingUsername,
                    message: `You win! ${username} left the game.`,
                });
                const remainingSocket = io.sockets.sockets.get(remainingSocketId);
                if (remainingSocket) {
                    remainingSocket.leave(gameRoom);
                    playersInRoom.delete(remainingSocketId);
                }
                resetGameState();
            }
            if (playersInRoom.size === 0)
                resetGameState();
        }
    });
    socket.on("disconnect", () => {
        if (playersInRoom.has(socket.id)) {
            const username = playersInRoom.get(socket.id);
            playersInRoom.delete(socket.id);
            socket.leave(gameRoom);
            moveTimers.delete(username);
            if (playersInRoom.size === 1) {
                const [remainingSocketId] = playersInRoom.keys();
                const remainingUsername = playersInRoom.get(remainingSocketId);
                io.to(remainingSocketId).emit("game:win-by-disconnect", {
                    winner: remainingUsername,
                    message: `You win! ${username} disconnected.`,
                });
                const remainingSocket = io.sockets.sockets.get(remainingSocketId);
                if (remainingSocket) {
                    remainingSocket.leave(gameRoom);
                    playersInRoom.delete(remainingSocketId);
                }
                resetGameState();
            }
            if (playersInRoom.size === 0)
                resetGameState();
        }
    });
}
