import { useEffect, useState } from "react";
import socket from "../../../../Chat/services/socket";
import { useTranslation } from "react-i18next";

interface ChooseProps {
  onChoose: (
    playerName: string,
    choice: "X" | "O",
    currentUser: string
  ) => void;
}

export default function Choose({ onChoose }: ChooseProps) {
  const [name, setName] = useState("");
  const [currentUser, setCurrentUser] = useState<string>("default user");

  useEffect(() => {
    socket.emit("request:init");
    socket.emit("get-my-profile");

    socket.on( "profile-data", (socket_data: { username: string; id: number; online: boolean }) => {
        setCurrentUser(socket_data.username);
      }
    );

    return () => {
      socket.off("profile-data");
    };
  }, []);

  const {t} = useTranslation();
  return (
    <div className="bg-[#393E46] rounded-xl shadow-lg p-8 max-w-md w-full text-white">
      <h2 className="text-3xl font-bold text-center mb-6">{t("welcome")}</h2>

      <div className="mb-4">
        <label className="block text-sm mb-2">{t("enter_ur_name")}</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-[#222831] text-white border border-[#0077FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0077FF]"
        />
      </div>

      <div className="mb-4">
        <p className="text-center mb-2">{t("choose_ur_symbole")}</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onChoose(name || "Player", "X", currentUser)}
            className="bg-[#0077FF] hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
          >
            X
          </button>

          <button
            onClick={() => onChoose(name || "Player", "O", currentUser)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-md"
          >
            O
          </button>
        </div>
      </div>

      <p className="text-xs text-center text-gray-300">
        {t("play_against")} {currentUser}
      </p>
    </div>
  );
}
