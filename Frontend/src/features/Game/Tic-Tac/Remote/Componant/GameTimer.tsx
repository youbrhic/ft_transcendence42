import React from "react";

const GameTimer: React.FC<{ xIsNext: boolean; time: number }> = ({ xIsNext, time, }) => (
  <div
    className={`flex items-center justify-center w-24 h-24 rounded-full font-mono text-4xl font-extrabold text-white shadow-xl transition-colors duration-500 ${
      xIsNext ? "bg-blue-600" : "bg-green-600"
    }`}
  >
    {Math.max(0, 10 - time)}
  </div>
);

export default GameTimer;
