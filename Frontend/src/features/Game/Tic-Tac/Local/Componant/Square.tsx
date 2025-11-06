type SquareProps = {
  value: string | null;
  onSquareClick: () => void;
};

type Square_CostumeProps = {
  value: string | null;
  onClick: () => void;
  xColor: string;
  oColor: string;
  gridColor: string;
  boardColor: string;
};

export default function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button
      className={`bg-[#393E46] text-white text-4xl font-mono rounded-xl border-2 border-[#0077FF] shadow-lg  hover:text-white hover:scale-105
    transition duration-300 ease-in-out flex items-center justify-center h-20 sm:h-24 ${
      value ? "animate-pulse" : ""
    }`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export function Square_Costume({
  value,
  onClick,
  xColor,
  oColor,
  gridColor,
  boardColor,
}: Square_CostumeProps) {
  
  const getColor = () => {
    if (value === "X")
      return xColor;
    if (value === "O")
      return oColor;
    return "white";
  };

  return (
    <button
      onClick={onClick}
      className={`text-4xl font-mono rounded-xl shadow-lg hover:scale-105 transition duration-300 ease-in-out flex items-center justify-center h-20 sm:h-24`}
      style={{
        backgroundColor: boardColor,
        border: `3px solid ${gridColor}`,
        color: getColor(),
      }}
    >
      {value}
    </button>
  );
}
