import { useEffect, useState } from "react";

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
  disabled?: boolean;
  isWinningSquare?: boolean;
}

export default function Square({ value, onSquareClick, disabled = false, isWinningSquare = false, }: SquareProps) {
  const [xcolor, setXColor] = useState("#FF0000");
  const [ocolor, setOColor] = useState("#0000FF");
  const [gridcolor, setGridColor] = useState("#EEEEEE");
  const [boardcolor, setBoardColor] = useState("#393E46");

  useEffect(() => {
    const setTicTacInfo = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/settings/tictacinfo`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = (await response.json()) as {
            x_color: string;
            o_color: string;
            grid_color: string;
            board_color: string;
          };

          setXColor(data.x_color || "#FF0000");
          setOColor(data.o_color || "#0000FF");
          setGridColor(data.grid_color || "#EEEEEE");
          setBoardColor(data.board_color || "#393E46");
        }
      } catch (err) {
        console.error("Failed to fetch tic tac info:", err);
      }
    };

    setTicTacInfo();
  }, []);

  const textColor = value === "X" ? xcolor : value === "O" ? ocolor : "white";

  return (
    <button
      style={{
        backgroundColor: boardcolor,
        borderColor: gridcolor,
        color: textColor,
      }}
      className={`text-4xl font-mono rounded-xl border-2 shadow-lg flex items-center justify-center h-20 sm:h-24 
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${isWinningSquare ? "winner-animate" : ""}
      `}
      onClick={onSquareClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
}
