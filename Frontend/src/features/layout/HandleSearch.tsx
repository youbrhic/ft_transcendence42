import React, { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { User } from "../Chat/types/User";
import { UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import gf2 from "../Home/Assets/giphy1.gif";
import { useTranslation } from "react-i18next";;

interface HandleSearchProps {
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
  showSearch: boolean;
  result: User[];
}

const HandleSearch: React.FC<HandleSearchProps> = ({setShowSearch,  showSearch, result }) => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  if (!showSearch)
    return null;
  return (
    <div className="absolute top-full mt-2 p-4 z-50 w-[500px] bg-[#222831] bg-opacity-85 rounded-xl flex flex-col items-center justify-center max-lg:w-[100%]"
      onClick={(e) => e.stopPropagation()}
    >
      {result.length > 0 ? (
        result.map((user, idx) => (
          <div
          key={idx}
            className="p-4 w-full mb-2 bg-[#222831] text-white flex items-center rounded-3xl border border-[#393E46]/50 hover:border-[#0077FF]/50"
            >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={user.image_url}
                className="size-12 flex-shrink-0 rounded-full border-2 border-white"
                alt="player profile"
              />
              <strong className="text-white text-xl font-bold max-lg:text-sm truncate">
                {user.username}
              </strong>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
              <button
                className="bg-[#0077FF] text-white py-2 px-4 rounded-full text-sm max-lg:text-xs font-semibold hover:bg-opacity-80 transition-colors flex items-center gap-2"
                onClick={() => {
                  navigate(`/profile/${user.username}`)
                  setShowSearch(false)
                }
              }
              >
                <UserIcon className="size-4 max-lg:size-4" /> {t("view_profile")}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-[250px] gap-4 p-6 ">
          <img
            src={gf2}
            className="size-64  rounded-xl shadow-lg border border-[#393E46]/40"
            alt="no history"
            />
          <h2 className="font-russo text-xl sm:text-2xl text-slate-200 tracking-wide">
            {t("no_user")}
          </h2>
        </div>
      )}
    </div>
  );
};

export default HandleSearch;
