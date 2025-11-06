import { useEffect, useRef, useState } from "react";
import socket from "../../../../Chat/services/socket";
import { FiUsers } from "react-icons/fi";
import { RiPingPongFill } from "react-icons/ri";
import { User } from "../../../../Chat/types/User";
import { useTranslation } from "react-i18next";
interface ChooseProps {
  onChoose: (playerName: string | undefined) => void;
}

export default function Choose({ onChoose }: ChooseProps) {
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const {t} = useTranslation();
  
  useEffect(() => {
    socket.disconnect();
    socket.connect();
  }, []);

  useEffect(() => {
    socket.emit("request:init");
    socket.emit("get-my-profile");

    socket.on( "profile-data", (data: { id: number; username: string; online: boolean }) => {
        setCurrentUser({
          id: data.id,
          username: data.username,
          online: data.online,
        });
      }
    );

    return () => {
      socket.off("profile-data");
    };
  }, []);

  const handleJoinGame = () => {
    if (currentUser) {
      onChoose(currentUser?.username);
    }
  };

  return (
    <div className="bg-[#393E46] rounded-xl shadow-lg p-8 max-w-md w-full text-white">
      <h2 className="text-3xl font-bold text-center mb-6">{t("welcome")}</h2>

      <div className="mb-6 text-center">
        <p className="text-gray-300 mb-2">Player:</p>
        <p className="text-xl font-semibold text-blue-400">
          {currentUser?.username}
          {currentUser?.id}
        </p>
      </div>

      <div className="mb-6 text-center">
        <p className="text-gray-300 text-sm">
            {t("text")}
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleJoinGame}
          className={`px-8 py-3 rounded-md font-bold text-lg ${"bg-[#0077FF] hover:bg-blue-700"} transition duration-200`}
        >
          {t("join_game")}
        </button>
      </div>
    </div>
  );
}
