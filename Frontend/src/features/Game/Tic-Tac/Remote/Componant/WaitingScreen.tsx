import React from "react";
import { FiUsers } from "react-icons/fi";
import { RiPingPongFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
interface Props {
  onCancel: () => void;
}

const WaitingScreen: React.FC<Props> = ({ onCancel }) => {
  const {t} = useTranslation();
  return (
    <>
      {/* <div className="bg-[#393e46] rounded-2xl p-8 shadow-2xl w-auto lg:w-[900px] max-w-2xl mx-auto border border-gray-600"> */}
      <div className="bg-[#393e46] rounded-2xl p-8 shadow-2xl w-full max-w-2xl mx-auto border border-gray-600">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#222831] rounded-full flex items-center justify-center mb-4 mx-auto border border-gray-600">
            <RiPingPongFill className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t("finding_match")}</h1>
          <p className="text-gray-300">{t("connecting_u_with_an_opp")}</p>
        </div>

        <div className="relative mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2 border-2 border-blue-500">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-white font-medium">{t("you")}</span>
            </div>

            <div className="flex-1 mx-2 sm:mx-4 relative">
              <div className="h-0.5 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full animate-pulse"
                  style={{
                    animation: "loading 2s ease-in-out infinite",
                    width: "60%",
                  }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-2 border-dashed border-gray-500 rounded-full flex items-center justify-center mb-2 animate-pulse">
                <div className="flex space-x-1">
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
              <span className="text-sm text-gray-400 font-medium">
                {t("opponant")}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-3 bg-[#222831] px-6 py-3 rounded-full border border-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <span className="text-gray-300 font-medium">
              {t("search_for_players")}
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-600">
          <button
            onClick={onCancel}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg"
          >
            {t("cancel_search")}
          </button>
        </div>
      </div>
    </>
  );
};

export default WaitingScreen;
