import React from "react";
import { useTranslation } from "react-i18next";
interface Props {
  playerXName: string;
  playerOName: string;
  mySymbol: "X" | "O" | null;
}

const GameHeader: React.FC<Props> = ({
  playerXName,
  playerOName,
  mySymbol,
}) => {
  const {t} = useTranslation();
    return(
    <div className="bg-[#393E46] p-4 rounded-xl shadow-md w-full text-white flex justify-around">
      <div
        className={`text-center p-2 rounded-xl ${
          mySymbol === "X" ? "bg-blue-600 w-1/3" : ""
        }`}
      >
        <p className="font-bold">{playerXName}</p>
        <p className="text-blue-400">X</p>
        {mySymbol === "X" && <p className="text-xs text-green-400">{t("you")}</p>}
      </div>

      <div
        className={`text-center p-2 rounded ${
          mySymbol === "O" ? "bg-green-600 w-1/3" : ""
        }`}
      >
        <p className="font-bold">{playerOName}</p>
        <p className="text-green-400">O</p>
        {mySymbol === "O" && <p className="text-xs text-green-400">{t("you")}</p>}
      </div>
    </div>

  )
};

export default GameHeader;
