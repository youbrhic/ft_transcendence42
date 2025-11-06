import {FaCrown, FaMedal, FaTrophy, FaBolt, FaStar, FaGamepad} from "react-icons/fa";
import { useTranslation } from "react-i18next";;
interface DisplayItemProps {
  type: "level" | "stat";
  name?: string;
  level?: string | number;
  stat?: string;
  color?: string;
  rank?: number;
  avatar?: string;
  user_avatar?: string;
  opponent_avatar?: string;
  score?: string;
  game?: string,
}

const DisplayItem: React.FC<DisplayItemProps> = ({ type, name, level, stat, rank, avatar, user_avatar, opponent_avatar, score, game, }) => {
  
  const level_int = level ? parseFloat(level.toString()) : 0;
  const progress = (level_int % 1) * 100;
  const {t} = useTranslation();

  const getRankIcon = (rank?: number) => {
    switch (rank) {
      case 1:
        return <FaCrown className="text-yellow-400 text-lg" />;
      case 2:
        return <FaMedal className="text-gray-300 text-lg" />;
      case 3:
        return <FaMedal className="text-amber-600 text-lg" />;
      default:
        return <span className="text-cyan-200 font-bold text-lg">{rank}</span>;
    }
  };
  let Pong_score: string[] | undefined = score?.split("-");
  let color: string;


  if (stat === "Draw")
    color = "text-[#469CFD]";
  else if (stat === "Lose")
    color = "text-[#F85761]";
  else
    color = "text-[#3AA64B]";

  let user_score: number = 1;
  let opp_score: number = 1;

  if (stat === "Win") {
    stat = t("win");
    user_score = 1;
    opp_score = 0; 
  } else if (stat === "Lose") {
    stat = t("lose");
    user_score = 0;
    opp_score = 1;
  } else {
    stat = t("draw");
  }

  if (game === "Pong" && Pong_score) {
    if (stat === "Win"){
      user_score = parseInt(Pong_score?.[0]) || 0;
      opp_score = parseInt(Pong_score?.[1]) || 0;
    } else {
      user_score = parseInt(Pong_score?.[1]) || 0;
      opp_score = parseInt(Pong_score?.[0]) || 0;
    }
  }


  const getStatElement = (stat?: string, color?: string) => {
    switch (stat?.toLowerCase()) {
      case "win":
        return (
          <div
            className={`px-2 py-2 rounded-full text-sm font-bold ${color} bg-slate-700/30 border border-slate-600/50 backdrop-blur-sm group-hover:bg-[#393E46] group-hover:border-[#0077FF]/50 transition-all duration-300 flex items-center gap-2`}
          >
            <FaTrophy className="text-emerald-400 animate-pulse" />
            {stat}
          </div>
        );
      case "lose":
        return (
          <div
            className={`px-2 py-2 rounded-full text-sm font-bold ${color} bg-slate-700/30 border border-slate-600/50 backdrop-blur-sm group-hover:bg-[#393E46] group-hover:border-[#0077FF]/50 transition-all duration-300 flex items-center gap-2`}
          >
            <FaBolt className="text-red-400 animate-pulse" />
            {stat}
          </div>
        );
      case "draw":
        return (
          <div
            className={`px-2 py-2 rounded-full text-sm font-bold ${color} bg-slate-700/30 border border-slate-600/50 backdrop-blur-sm group-hover:bg-[#393E46] group-hover:border-[#0077FF]/50 transition-all duration-300 flex items-center gap-2`}
          >
            <FaStar className="text-blue-400 animate-spin" />
            {stat}
          </div>
        );
      default:
        return (
          <div
            className={`px-2 py-2 rounded-full text-sm font-bold ${color} bg-slate-700/30 border border-slate-600/50 backdrop-blur-sm group-hover:bg-[#393E46] group-hover:border-[#0077FF]/50 transition-all duration-300 flex items-center gap-2`}
          >
            <FaGamepad className="text-gray-400" />
            {stat}
          </div>
        );
    }
  };

  return (
    <>
      {type === "level" && (
        <div className="flex items-center p-3 xs:p-4 bg-[#222831] m-2 h-16 rounded-3xl border border-[#393E46]/50 hover:border-[#0077FF]/50 transition-all duration-300 justify-between">
          <div className="flex items-center gap-2 xs:gap-4 flex-shrink min-w-0">
            <div className="relative flex-shrink-0 p-2">
              {getRankIcon(rank)}
            </div>
            <img
              src={avatar}
              className="size-8 xs:size-10 sm:size-12 rounded-full border-2 border-white flex-shrink-0"
              alt="player profile"
            />
            <p className="font-russo text-white truncate  max-w-[200px]  leading-tight p-2">
              {name}
            </p>
          </div>
          <div className=" flex flex-col items-start  gap-1 xs:gap-2">
            <p className="font-russo text-white text-left">{t("level")} {level_int}</p>
            <div className="h-3 bg-[#5e7396] rounded-full overflow-hidden border border-[#393E46] w-24">
              <div
                className="h-full bg-gradient-to-r from-[#0077FF] to-[#00AAFF] rounded-full transition-all duration-500 ease-out shadow-lg shadow-[#0077FF]/30"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {type === "stat" && (
        <div className="group bg-[#222831]  m-2 h-16 rounded-3xl flex items-center p-4 justify-between border border-[#393E46]/50 hover:border-[#0077FF]/50 transition-all duration-300 hover:shadow-md">
          <img
            src={user_avatar}
            className="size-12 rounded-full border-2 border-[#393E46] group-hover:border-[#0077FF] transition-all shadow-md"
            alt="player profile"
          />

          <div className="flex-1 flex items-center justify-between pl-4 pr-2">
            <p className={`font-russo ${color} text-lg font-bold`}>
              {user_score}
            </p>

            <div className="group-hover:scale-105 transition-transform duration-300 p-2">
              {getStatElement(stat, color)}
            </div>
            <p className={`font-russo ${color} text-lg font-bold`}>
              {opp_score}
            </p>
          </div>
          <img
            src={opponent_avatar}
            className="size-12 rounded-full border-2 border-[#393E46] group-hover:border-[#0077FF] transition-all shadow-md ml-4"
            alt="opponent profile"
          />
        </div>
      )}
    </>
  );
};

export default DisplayItem;
