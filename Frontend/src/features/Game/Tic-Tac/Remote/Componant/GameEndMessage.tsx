import React from "react";

interface GameResult {
  winner: string | null;
  loser: string | null;
  reason: "win" | "draw" | "timeout" | "disconnect";
}

const GameEndMessage: React.FC<{ gameResult: GameResult | null; startNewGame: () => void; }> = ({ gameResult, startNewGame }) => {

  if (!gameResult)
    return null;

  const { reason, winner, loser } = gameResult;

  let message;
  if (reason === "draw")
    message = "It's a Draw!";
  else if (reason === "timeout")
    message = `${loser} ran out of time!`;
  else if (reason === "disconnect")
    message = `${loser} disconnected!`;
  else
    message = `${winner} Wins! 🎉`;

  return (
    <div className="bg-[#393E46] text-white p-6 rounded-xl text-center shadow-lg w-full">
      <p className="text-2xl font-bold mb-4">{message}</p>
      <button
        onClick={startNewGame}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow-md"
      >
        New Game
      </button>
    </div>
  );
};

export default GameEndMessage;
