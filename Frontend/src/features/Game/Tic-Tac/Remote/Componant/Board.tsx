import Square from "./Square";
import { useTranslation } from "react-i18next";
interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (index: number) => void;
  replayGame: () => void;
  playagain: () => void;
  playerXName: string;
  playerOName: string;
  gameStarted: boolean;
  currentUser: string | undefined;
  mySymbol: "X" | "O" | null;
  gameResult?: {
    winner: string | null;
    loser: string | null;
    reason: "win" | "draw" | "timeout" | "disconnect";
  } | null;
}

function calculateWinnerWithLine(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

export default function Board({
  xIsNext,
  squares,
  onPlay,
  playerXName,
  playerOName,
  gameStarted,
  currentUser,
  mySymbol,
  gameResult = null,
}: BoardProps) {
  const {t} = useTranslation();
  const isMyTurn = mySymbol && ((xIsNext && mySymbol === "X") || (!xIsNext && mySymbol === "O"));

  function handleClick(i: number) {
    if (!gameStarted || squares[i] || !isMyTurn || gameResult)
      return;
    onPlay(i);
  }

  let boardAnimation = "";
  if (gameResult) {
    boardAnimation = "animate-pulse";
  }

  let status;
  if (gameResult) {
    switch (gameResult.reason) {
      case "win":
        status = (
          <p className="text-2xl font-bold text-center">
            <span
              className={
                gameResult.winner === currentUser
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {gameResult.winner} {t("wins")}
            </span>
          </p>
        );
        break;
      case "draw":
        status = (
          <p className="text-yellow-400 text-2xl font-bold text-center">
            {t("its_draw")}
          </p>
        );
        break;
      case "timeout":
        status = (
          <p className="text-2xl font-bold text-center">
            <span
              className={
                gameResult.winner === currentUser
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {gameResult.loser} {t("out_of_time")} — {gameResult.winner} {t("wins")}
            </span>
          </p>
        );
        break;
      case "disconnect":
        status = (
          <p className="text-2xl font-bold text-center">
            <span
              className={
                gameResult.winner === currentUser
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {gameResult.loser} {t("left")} — {gameResult.winner} {t("wins")}
            </span>
          </p>
        );
        break;
    }
  } else if (gameStarted) {
    const currentPlayerName = xIsNext ? playerXName : playerOName;
    const isCurrentPlayerMe = currentPlayerName === currentUser;
    status = (
      <p className="text-[#0077FF] font-semibold text-xl text-center">
        {isCurrentPlayerMe ? (
          <span className="text-green-400">
            {t("ur_turn")} ({xIsNext ? "X" : "O"})
          </span>
        ) : (
          <span className="text-white">
            {currentPlayerName}{t("s_turn")} ({xIsNext ? "X" : "O"})
          </span>
        )}
      </p>
    );
  }

  const winningInfo = gameResult?.reason === "win" ? calculateWinnerWithLine(squares) : null;
  const winningLine = winningInfo?.line || [];

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">{status}</div>
      <div
        className={`bg-[#222831] p-6 rounded-2xl grid grid-cols-3 gap-4 w-72 sm:w-96 ${boardAnimation} ${
          gameResult ? "scale-105 shadow-lg" : ""
        }`}
      >
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onSquareClick={() => handleClick(i)}
            disabled={!isMyTurn || !!gameResult}
            isWinningSquare={winningLine.includes(i)}
          />
        ))}
      </div>
    </div>
  );
}
