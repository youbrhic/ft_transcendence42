import gf2 from "../Assets/giphy1.gif";
import { useTranslation } from "react-i18next";;

const NoStatFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-[250px] gap-4 p-6 ">
      <img
        src={gf2}
        // className="h-60 w-auto rounded-xl shadow-lg border border-[#393E46]/40"
        className="size-64  rounded-xl shadow-lg border border-[#393E46]/40"
        alt="no history"
      />
      <h2 className="font-russo text-xl sm:text-2xl text-slate-200 tracking-wide">
        {t("No_recent_matches")}
      </h2>
      <p className="text-slate-400 text-sm sm:text-base text-center">
        {t("Play_games_to_see_your_match_history_here")}
      </p>
    </div>
  );
};

export default NoStatFound;
