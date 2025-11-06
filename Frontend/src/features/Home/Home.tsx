import React, { use, useEffect, useState } from "react";
import socket from "../Chat/services/socket";
import "../../styles/index.css";
import { useTranslation } from "react-i18next";;
import DisplayItem from "./Componant/DisplayItems";
import WelcomeCard from "./Componant/WelcomeCard";
import NoStatFound from "./Componant/NoStatFound";

interface User {
  username: string;
  level: string | number;
  rank: number;
  avatar: string;
}

interface History {
  user_avatar: string;
  opponent_avatar: string;
  Score: string;
  result: string;
  Game: string,
}

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const { t } = useTranslation();
  useEffect(() => {
    if (!socket.connect())
      socket.connect();
  });

  useEffect(() => {
    const fetch_Leaderboard = async () => {
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/api/home/Leaderboard/12`,
        {
          credentials: "include",
          method: "GET",
        }
      );
      const data = await resp.json();
      setUsers(data);
    };
    const fetch_HistoryHome = async () => {
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL}/api/home/HistoryHome/10`,
        {
          credentials: "include",
          method: "GET",
        }
      );
      const data = await resp.json();
      setHistory(data);
    };
    fetch_HistoryHome();
    fetch_Leaderboard();
  }, []);

  return (
    <div className="m-auto w-full h-full flex flex-col 2xl:flex-row   p-5 gap-5  max-sm:p-1  max-[375px]:p-1 max-[390px]:w-[95%] max-[375px]:w-[90%] max-[360px]:w-[87%] max-[344px]:w-[60%]">
      <div className="w-full flex flex-col gap-4 2xl:w-[70%]">
        <WelcomeCard />
        <div className="flex-1 bg-[#393E46] rounded-3xl text-[#EEEEEE] overflow-auto custom-scroll ">
          <div className="sticky top-0 z-10 font-russo  text-2xl h-16 size-auto bg-[#393E46] p-5">
            {t("LeaderBoard")}
          </div>
          {users.length > 0 ? (
            users.map((user, idx) => (
              <DisplayItem
                key={idx}
                type="level"
                name={user.username}
                level={user.level}
                rank={user.rank}
                avatar={user.avatar}
              />
            ))
          ) : (
            <span className="text-blue-400 text-center">{t("no_user")}</span>
          )}
        </div>
      </div>
      <div className="w-full 2xl:w-[30%]  flex flex-col">
        <div className="flex-1  bg-[#393E46]  rounded-3xl text-[#EEEEEE] overflow-auto custom-scroll pb-3">
          <div className="sticky top-0 z-10 font-russo p-5 h-16 text-2xl size-auto bg-[#393E46]">
            {t("History")}
          </div>
          {history.length > 0 ? (
            history.map((stat, idx) => (
              <DisplayItem
                key={idx}
                type="stat"
                stat={stat.result}
                user_avatar={stat.user_avatar}
                opponent_avatar={stat.opponent_avatar}
                score={stat.Score}
                game={stat.Game}
              />
            ))
          ) : (
            <NoStatFound />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
