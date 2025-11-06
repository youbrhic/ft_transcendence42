import React, { useState, useRef, useEffect } from "react";
import Choose from "./Componant/choose";
import { useTranslation } from "react-i18next";
import Board from "./Componant/Board";

function calculateWinner(squares: (string | null)[]) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const LocalGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerXName, setPlayerXName] = useState("");
  const [playerOName, setPlayerOName] = useState("");
  const [squares, setSquares] = useState<(string | null)[]>(
    Array(9).fill(null)
  );
  const [xIsNext, setXIsNext] = useState(true);

  const handlePlay = (nextSquares: (string | null)[]) => {
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const startNewGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameStarted(false);
    setPlayerXName("");
    setPlayerOName("");
  };

  const playAgain = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameStarted(true);
  };

  const winner = calculateWinner(squares);
  const isDraw = squares.every((sq) => sq !== null) && !winner;
  const gameOver = winner || isDraw;
  const { t } = useTranslation(); 
  return (
    <div className="h-full w-full flex items-center justify-center bg-[#222831] p-4 overflow-auto ">
      {!gameStarted ? (
        <Choose
          onChoose={(playerName, choice, currentUser) => {
            if (choice === "X") {
              setPlayerXName(playerName);
              setPlayerOName(currentUser);
            } else {
              setPlayerXName(currentUser);
              setPlayerOName(playerName);
            }
            setGameStarted(true);
          }}
        />
      ) : (
        <div className="flex flex-col items-center space-y-6 w-full max-w-2xl h-[80%] ">

          <div className="bg-[#393E46] p-4 rounded-xl shadow-md w-full text-white flex justify-around ">
            <div className={`text-center ${ xIsNext ? "bg-blue-600 w-1/3" : "" } rounded-xl`} >
              <p className="font-bold">{playerXName}</p>
              <p>X</p>
            </div>
            <div className={`text-center ${ !xIsNext ? "bg-green-600 w-1/3" : "" } rounded-xl`} >
              <p className="font-bold">{playerOName}</p>
              <p>O</p>
            </div>
          </div>

          <Board
            xIsNext={xIsNext}
            squares={squares}
            onPlay={handlePlay}
            playerXName={playerXName}
            playerOName={playerOName}
            gameStarted={gameStarted}
          />

          {gameOver && (
            <div className="flex gap-4 ">
              <button
                onClick={playAgain}
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white font-semibold shadow-md"
              >
                {t("play_again")}
              </button>
              <button
                onClick={startNewGame}
                className="bg-[#0077FF] hover:bg-blue-800 px-5 py-2 rounded-lg text-white font-semibold shadow-md"
              >
                {t("new_game")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocalGame;
