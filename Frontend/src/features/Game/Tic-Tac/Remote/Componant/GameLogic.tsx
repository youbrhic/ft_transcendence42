import { useState, useEffect, useRef } from "react";
import socket from "../../../../Chat/services/socket";
import triggerFireworks from "./confetti";

interface GameResult {
  winner: string | null;
  loser: string | null;
  reason: "win" | "draw" | "timeout" | "disconnect";
}

export const useRemoteGameLogic = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerXName, setPlayerXName] = useState("");
  const [playerOName, setPlayerOName] = useState("");
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(9).fill(null)
  );
  const [xIsNext, setXIsNext] = useState(true);
  const [usersJoin, setUsersJoin] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | undefined>("");
  const [mySymbol, setMySymbol] = useState<"X" | "O" | null>(null);
  const [waitingForPlayer, setWaitingForPlayer] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [startTimer, setStartTimer] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  const currentUserRef = useRef<string | undefined>("");
  const hasJoinedGameRef = useRef(false);


  useEffect(() => {
    if (startTimer && !gameResult) {
      timerRef.current = window.setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= 10) {
            setStartTimer(false);
            return 10;
          }
          return newTime;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer, gameResult]);

  const cleanup = () => {
    setStartTimer(false);
    setTime(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      
      if (hasJoinedGameRef.current && socket && socket.connected) {
        socket.emit("leave:game");
        cleanup();
      }
    };
  }, []);

  const resetGameState = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameStarted(false);
    setPlayerXName("");
    setPlayerOName("");
    setUsersJoin(false);
    setMySymbol(null);
    setWaitingForPlayer(false);
    setGameResult(null);
    hasJoinedGameRef.current = false;
    cleanup();
  };

  const handleJoinGame = (playerName: string | undefined) => {
    setCurrentUser(playerName);
    currentUserRef.current = playerName;
    setWaitingForPlayer(false);
    setGameStarted(false);
    setUsersJoin(false);
    setGameResult(null);
    socket.emit("join:game");
  };

  const handlePlay = (index: number) => {
    if (!gameResult && gameStarted) {
      socket.emit("game:move", { index, player: currentUser });
      setTime(0);
    }
  };

  const handleLeaveGame = () => {
    socket.emit("leave:game");
    hasJoinedGameRef.current = false;
    resetGameState();
  };

  const startNewGame = () => {
    resetGameState();
    socket.emit("leave:game");
  };

  const playAgain = () => {
    socket.emit("game:restart");
    setTime(0);
    setStartTimer(false);
    setGameResult(null);
  };

  useEffect(() => {
    const onGameStart = ({playerX, playerO, }: { playerX: string; playerO: string; }) => {
      hasJoinedGameRef.current = true;
      setPlayerOName(playerO);
      setPlayerXName(playerX);
      setGameStarted(true);
      setUsersJoin(true);
      setWaitingForPlayer(false);
      setMySymbol(currentUserRef.current === playerX ? "X" : "O");
      setGameResult(null);
      setStartTimer(true);
      setTime(0);
    };

    const onGameWaiting = () => {
      hasJoinedGameRef.current = true;
      setWaitingForPlayer(true);
      setGameStarted(false);
      setUsersJoin(false);
      setStartTimer(false);
    };

    const onGameMove = ({ squares, xIsNext, }: {
      squares: (string | null)[];
      xIsNext: boolean;
    }) => {
      if (gameResult)
        return;
      setSquares(squares);
      setXIsNext(xIsNext);
      setTime(0);
      setStartTimer(true);
    };

    const onGameEnd = (result: GameResult) => {
      cleanup();
      if (result.reason === "draw")
        result.winner = null;
      if (result.winner === currentUserRef.current)
        triggerFireworks();
      setGameResult(result);
      setGameStarted(false);
      setMySymbol(null);
      hasJoinedGameRef.current = false;
    };

    socket.on("game:start", onGameStart);
    socket.on("game:waiting", onGameWaiting);
    socket.on("game:move", onGameMove);
    socket.on("game:end", onGameEnd);

    return () => {
      socket.off("game:start", onGameStart);
      socket.off("game:waiting", onGameWaiting);
      socket.off("game:move", onGameMove);
      socket.off("game:end", onGameEnd);
    };
  }, []);

  return {
    gameStarted,
    usersJoin,
    waitingForPlayer,
    handleJoinGame,
    handleLeaveGame,
    startNewGame,
    playAgain,
    handlePlay,
    squares,
    xIsNext,
    playerXName,
    playerOName,
    mySymbol,
    gameResult,
    currentUser,
    startTimer,
    time,
    currentUserRef,
  };
};
