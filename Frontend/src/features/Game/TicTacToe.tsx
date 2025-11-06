import React from "react";
import Subtract from "../Assets/Subtract.svg";
import f_logo from "../Assets/local.svg";
import t_logo from "../Assets/remote.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TicTacToe: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full bg-[#222831] rounded-2xl overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-20 sm:w-28 md:w-32 h-20 sm:h-28 md:h-32 bg-[#0077FF]/3 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 sm:w-36 md:w-40 h-24 sm:h-36 md:h-40 bg-[#0077FF]/2 rounded-full blur-2xl sm:blur-3xl"></div>
        {/* <div className="absolute top-0 left-1/2 w-1 h-16 sm:h-20 md:h-24 bg-[#0077FF]/20 rounded-b-full transform -translate-x-1/2"></div> */}
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 h-full overflow-y-auto overflow-x-hidden custom-scroll">
        <div className="min-h-full flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 md:py-10 lg:py-16">
          
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 flex-shrink-0">
            <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-russo text-white tracking-wider relative">
                {t("tic_tac_toe_title")}
              </h1>
              <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-32 sm:w-40 md:w-48 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#0077FF] to-transparent rounded-full"></div>
            </div>

            <div className="space-y-3 sm:space-y-4 px-2 sm:px-4">
              <p className="text-[#EEEEEE]/80 text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed font-light">
                {t("tic_tac_toe_desc")}
              </p>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#0077FF] rounded-full"></div>
                <div className="w-1 h-1 sm:w-2 sm:h-2 bg-[#0077FF] rounded-full"></div>
                <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#0077FF] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Game Modes Grid */}
          <div className="flex-1 flex items-center justify-center pb-6 sm:pb-8 md:pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 xl:gap-24 w-full max-w-5xl">
              
              {/* Local Game Card */}
              <div className="group relative w-full">
                <div className="absolute inset-0 bg-[#0077FF]/8 rounded-2xl sm:rounded-3xl transform rotate-1 sm:rotate-2 group-hover:rotate-0 transition-all duration-500 ease-out"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0077FF]/5 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div 
                  className="relative flex flex-col items-center justify-between bg-[#393E46] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 w-full aspect-square transition-all duration-500 group-hover:translate-y-[-4px] sm:group-hover:translate-y-[-6px] md:group-hover:translate-y-[-8px] group-hover:scale-[1.01] sm:group-hover:scale-[1.02] border border-[#393E46] group-hover:border-[#0077FF]/30 shadow-lg group-hover:shadow-xl group-hover:shadow-[#0077FF]/10"
                  style={{
                    backgroundImage: `url(${Subtract})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-[#0077FF] text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-russo opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 sm:translate-y-2 group-hover:translate-y-0">
                    {t("classic")}
                  </div>

                  {/* Icon Container */}
                  <div className="flex-1 flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#0077FF]/15 rounded-full blur-lg sm:blur-xl md:blur-2xl scale-110 sm:scale-125 md:scale-150 group-hover:scale-100 sm:group-hover:scale-110 md:group-hover:scale-125 transition-all duration-700"></div>
                      <div className="relative p-3 sm:p-4 md:p-5 lg:p-6 bg-[#222831]/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-[#0077FF]/20 group-hover:border-[#0077FF]/40 transition-all duration-300">
                        <img
                          src={f_logo}
                          alt="Local Game"
                          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 filter drop-shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-2 sm:space-y-3 md:space-y-4 w-full px-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-russo text-white group-hover:text-[#0077FF] transition-colors duration-300">
                      {t("tic_local_title")}
                    </h3>
                    <p className="text-[#EEEEEE]/70 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 p-1">
                      {t("tic_local_desc")}
                    </p>
                    <div className="pt-1 sm:pt-2 w-full flex justify-center">
                      <Link
                        to="local-game"
                        className="inline-block w-auto max-w-full bg-[#0077FF] hover:bg-[#0066DD] text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl font-russo text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#0077FF]/30 active:scale-95 transform hover:translate-y-[-1px] sm:hover:translate-y-[-2px] whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {t("tic_local_btn")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remote Game Card */}
              <div className="group relative w-full">
                <div className="absolute inset-0 bg-[#0077FF]/8 rounded-2xl sm:rounded-3xl transform -rotate-1 sm:-rotate-2 group-hover:rotate-0 transition-all duration-500 ease-out"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-[#0077FF]/5 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div 
                  className="relative flex flex-col items-center justify-between bg-[#393E46] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 w-full aspect-square transition-all duration-500 group-hover:translate-y-[-4px] sm:group-hover:translate-y-[-6px] md:group-hover:translate-y-[-8px] group-hover:scale-[1.01] sm:group-hover:scale-[1.02] border border-[#393E46] group-hover:border-[#0077FF]/30 shadow-lg group-hover:shadow-xl group-hover:shadow-[#0077FF]/10"
                  style={{
                    backgroundImage: `url(${Subtract})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Badge */}
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-[#0077FF] text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-russo opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 sm:translate-y-2 group-hover:translate-y-0">
                    {t("strategy")}
                  </div>

                  {/* Icon Container */}
                  <div className="flex-1 flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#0077FF]/15 rounded-full blur-lg sm:blur-xl md:blur-2xl scale-110 sm:scale-125 md:scale-150 group-hover:scale-100 sm:group-hover:scale-110 md:group-hover:scale-125 transition-all duration-700"></div>
                      <div className="relative p-3 sm:p-4 md:p-5 lg:p-6 bg-[#222831]/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-[#0077FF]/20 group-hover:border-[#0077FF]/40 transition-all duration-300">
                        <img 
                          src={t_logo}
                          alt="Remote Game"
                          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 filter drop-shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-2 sm:space-y-3 md:space-y-4 w-full px-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-russo text-white group-hover:text-[#0077FF] transition-colors duration-300">
                      {t("tic_online_title")}
                    </h3>
                    <p className="text-[#EEEEEE]/70 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 p-1">
                      {t("tic_online_desc")}
                    </p>
                    <div className="pt-1 sm:pt-2 w-full flex justify-center">
                      <Link
                        to="remote-game"
                        className="inline-block w-auto max-w-full bg-[#0077FF] hover:bg-[#0066DD] text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl font-russo text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#0077FF]/30 active:scale-95 transform hover:translate-y-[-1px] sm:hover:translate-y-[-2px] whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {t("tic_online_btn")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="text-center mt-8 sm:mt-10 md:mt-12 lg:mt-16 flex-shrink-0">
            <div className="inline-flex flex-col items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 text-[#EEEEEE]/50 text-xs sm:text-sm md:text-base">
                <div className="flex gap-0.5 sm:gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0077FF] rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0077FF]/60 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0077FF]/40 rounded-full animate-pulse delay-300"></div>
                </div>
                <span className="font-russo tracking-wide text-center">
                  {t("tic_footer_select")}
                </span>
                <div className="flex gap-0.5 sm:gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0077FF]/40 rounded-full animate-pulse delay-500"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0077FF]/60 rounded-full animate-pulse delay-650"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#0077FF] rounded-full animate-pulse delay-800"></div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-[#EEEEEE]/30 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#0077FF] rounded-full"></div>
                  <span className="whitespace-nowrap">{t("tic_footer_local")}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#0077FF] rounded-full"></div>
                  <span className="whitespace-nowrap">{t("tic_footer_online")}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#0077FF] rounded-full"></div>
                  <span className="whitespace-nowrap">{t("tic_footer_strategy")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;