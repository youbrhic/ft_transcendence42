import React from 'react';
import Subtract from '../Assets/Subtract.svg';
import ping_pong from '../Assets/ping-pong.svg';
import tic_tac from '../Assets/tic-tac-toe-game.svg';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const GameHome: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full bg-[#222831] rounded-2xl overflow-auto">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-16 sm:w-20 md:w-24 lg:w-28 h-16 sm:h-20 md:h-24 lg:h-28 bg-[#0077FF]/3 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 bg-[#0077FF]/2 rounded-full blur-3xl"></div>
        <div className="absolute top-0 left-1/2 w-1 h-12 sm:h-16 md:h-20 bg-[#0077FF]/20 rounded-b-full transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-1 h-8 sm:h-12 md:h-16 bg-[#0077FF]/20 rounded-t-full transform -translate-x-1/2"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 h-full flex flex-col">
        
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16 flex-shrink-0">
          <div className="relative inline-block mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-russo text-white tracking-wider relative">
            {t("game_center")}
            </h1>
            <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 md:w-36 lg:w-40 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-[#0077FF] to-transparent rounded-full"></div>
          </div>
          
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <p className="text-[#EEEEEE]/80 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-xl md:max-w-2xl mx-auto leading-relaxed font-light px-4">
              {t("select_favorite_game")}
            </p>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <div className="w-1 h-1 bg-[#0077FF] rounded-full"></div>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#0077FF] rounded-full"></div>
              <div className="w-1 h-1 bg-[#0077FF] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Games Grid - Responsive Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="m-auto max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-16 xl:gap-24">
              
              {/* Ping Pong Card */}
              <div className="group relative w-full max-w-xs sm:max-w-sm md:max-w-none">
                <div className="absolute inset-0 bg-[#0077FF]/8 rounded-2xl sm:rounded-3xl transform rotate-1 sm:rotate-2 group-hover:rotate-0 transition-all duration-500 ease-out"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0077FF]/5 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div 
                  className="relative flex flex-col items-center justify-center bg-[#393E46] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 w-full aspect-square max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm xl:max-w-md transition-all duration-500 group-hover:translate-y-[-4px] sm:group-hover:translate-y-[-6px] md:group-hover:translate-y-[-8px] group-hover:scale-[1.01] sm:group-hover:scale-[1.02] border border-[#393E46] group-hover:border-[#0077FF]/30 shadow-lg group-hover:shadow-xl group-hover:shadow-[#0077FF]/10"
                  style={{ backgroundImage: `url(${Subtract})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {/* Badge */}
                  <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-[#0077FF] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-russo opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 sm:translate-y-2 group-hover:translate-y-0">
                  {t("classic")}
                  </div>

                  {/* Icon Container */}
                  <div className="flex-1 flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#0077FF]/15 rounded-full blur-xl sm:blur-2xl scale-125 sm:scale-150 group-hover:scale-110 sm:group-hover:scale-125 transition-all duration-700"></div>
                      <div className="relative p-3 sm:p-4 md:p-5 lg:p-6 bg-[#222831]/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-[#0077FF]/20  transition-all duration-300">
                        <img 
                          src={ping_pong} 
                          alt="Ping Pong" 
                          className="w-12 sm:w-16 md:w-20 lg:w-24 xl:w-28 h-auto filter drop-shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-2 sm:space-y-3 md:space-y-4 w-full">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-russo text-white group-hover:text-[#0077FF] transition-colors duration-300">
                      {t("ping_pong_title")}
                    </h3>
                    <p className="text-[#EEEEEE]/70 text-xs sm:text-sm md:text-base leading-relaxed px-2 sm:px-4">
                      {t("ping_pong_desc")}
                    </p>
                    <div className="pt-1 sm:pt-2">
                      <Link 
                        to="ping-pong" 
                        className="inline-block bg-[#0077FF] hover:bg-[#0066DD] text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-russo text-sm sm:text-base md:text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#0077FF]/30 active:scale-95 transform hover:translate-y-[-1px] sm:hover:translate-y-[-2px]"
                      >
                        {t("play_now")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tic Tac Toe Card */}
              <div className="group relative w-full max-w-xs sm:max-w-sm md:max-w-none">
                <div className="absolute inset-0 bg-[#0077FF]/8 rounded-2xl sm:rounded-3xl transform -rotate-1 sm:-rotate-2 group-hover:rotate-0 transition-all duration-500 ease-out"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-[#0077FF]/5 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div 
                  className="relative flex flex-col items-center justify-center bg-[#393E46] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 w-full aspect-square max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm xl:max-w-md transition-all duration-500 group-hover:translate-y-[-4px] sm:group-hover:translate-y-[-6px] md:group-hover:translate-y-[-8px] group-hover:scale-[1.01] sm:group-hover:scale-[1.02] border border-[#393E46] group-hover:border-[#0077FF]/30 shadow-lg group-hover:shadow-xl group-hover:shadow-[#0077FF]/10"
                  style={{ backgroundImage: `url(${Subtract})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {/* Badge */}
                  <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-[#0077FF] text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-russo opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 sm:translate-y-2 group-hover:translate-y-0">
                    {t("strategy")}
                  </div>

                  {/* Icon Container */}
                  <div className="flex-1 flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#0077FF]/15 rounded-full blur-xl sm:blur-2xl scale-125 sm:scale-150 group-hover:scale-110 sm:group-hover:scale-125 transition-all duration-700"></div>
                      <div className="relative p-3 sm:p-4 md:p-5 lg:p-6 bg-[#222831]/50 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-[#0077FF]/20 group-hover:border-[#0077FF]/40 transition-all duration-300">
                        <img 
                          src={tic_tac} 
                          alt="Tic Tac Toe" 
                          className="w-12 sm:w-16 md:w-20 lg:w-24 xl:w-28 h-auto filter drop-shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-2 sm:space-y-3 md:space-y-4 w-full">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-russo text-white group-hover:text-[#0077FF] transition-colors duration-300">
                      {t("tic_tac_toe_title")}
                    </h3>
                    <p className="text-[#EEEEEE]/70 text-xs sm:text-sm md:text-base leading-relaxed px-2 sm:px-4">
                      {t("tic_tac_toe_desc")}
                    </p>
                    <div className="pt-1 sm:pt-2">
                      <Link 
                        to="tic-tac-toe" 
                        className="inline-block bg-[#0077FF] hover:bg-[#0066DD] text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-russo text-sm sm:text-base md:text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#0077FF]/30 active:scale-95 transform hover:translate-y-[-1px] sm:hover:translate-y-[-2px]"
                      >
                        {t("play_now")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16 flex-shrink-0">
          <div className="inline-flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 text-[#EEEEEE]/50 text-xs sm:text-sm md:text-base">
              <div className="flex gap-0.5 sm:gap-1">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#0077FF] rounded-full animate-pulse"></div>
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#0077FF]/60 rounded-full animate-pulse delay-150"></div>
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#0077FF]/40 rounded-full animate-pulse delay-300"></div>
              </div>
              <span className="font-russo tracking-wide text-center">{t("choose_your_game")}</span>
              <div className="flex gap-0.5 sm:gap-1">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#0077FF]/40 rounded-full animate-pulse delay-500"></div>
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#0077FF]/60 rounded-full animate-pulse delay-650"></div>
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#0077FF] rounded-full animate-pulse delay-800"></div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-[#EEEEEE]/30 text-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1 h-1 bg-[#0077FF] rounded-full"></div>
                <span>{t("single_player")}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1 h-1 bg-[#0077FF] rounded-full"></div>
                <span>{t("multiplayer")}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-1 h-1 bg-[#0077FF] rounded-full"></div>
                <span>{t("tournaments")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHome;