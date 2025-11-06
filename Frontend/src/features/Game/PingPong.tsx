import React from 'react';
import Subtract from '../Assets/Subtract.svg';
import f_logo from '../Assets/local.svg'
import s_logo from '../Assets/tournament.svg'
import t_logo from '../Assets/remote.svg'
import { Link } from 'react-router';
import { useTranslation } from "react-i18next";


const PingPong: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative bg-[#222831] rounded-2xl h-full overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-16 sm:w-24 md:w-32 lg:w-40 h-16 sm:h-24 md:h-32 lg:h-40 bg-[#0077FF]/3 rounded-full blur-xl sm:blur-2xl md:blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-20 sm:w-32 md:w-40 lg:w-48 h-20 sm:h-32 md:h-40 lg:h-48 bg-[#0077FF]/2 rounded-full blur-xl sm:blur-2xl md:blur-3xl"></div>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 h-full overflow-y-auto overflow-x-hidden custom-scroll">
        <div className="min-h-full flex flex-col px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 xs:py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16">
          
          {/* Header Section */}
          <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 flex-shrink-0">
            <div className="relative inline-block mb-3 xs:mb-4 sm:mb-5 md:mb-6">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-russo text-white tracking-wider relative">
                {t("pong")}
              </h1>
              <div className="absolute -bottom-0.5 xs:-bottom-1 sm:-bottom-1.5 md:-bottom-2 left-1/2 transform -translate-x-1/2 w-16 xs:w-20 sm:w-24 md:w-28 lg:w-32 h-0.5 sm:h-0.5 md:h-1 bg-gradient-to-r from-transparent via-[#0077FF] to-transparent rounded-full"></div>
            </div>
            
            <div className="space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4 px-2 xs:px-3 sm:px-4">
              <p className="text-[#EEEEEE]/80 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-[280px] xs:max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto leading-relaxed font-light">
                {t("Choose_your_gaming_experience_and_challenge_yourself")}
              </p>
              <div className="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2">
                <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#0077FF] rounded-full"></div>
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-[#0077FF] rounded-full"></div>
                <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#0077FF] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex-1 flex items-center justify-center pb-4 xs:pb-6 sm:pb-8 md:pb-10 lg:pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 max-w-7xl w-full">
              
              {/* Tournaments Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-[#0077FF]/8 rounded-xl sm:rounded-2xl md:rounded-3xl transform rotate-1 sm:rotate-1.5 md:rotate-2 group-hover:rotate-0 transition-all duration-500 ease-out"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0077FF]/5 to-transparent rounded-xl sm:rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div 
                  className="relative flex flex-col items-center justify-between bg-[#393E46] rounded-xl sm:rounded-2xl md:rounded-3xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 h-56 xs:h-64 sm:h-72 md:h-80 lg:h-[22rem] xl:h-96 transition-all duration-500 group-hover:translate-y-[-3px] sm:group-hover:translate-y-[-4px] md:group-hover:translate-y-[-6px] lg:group-hover:translate-y-[-8px] group-hover:scale-[1.01] sm:group-hover:scale-[1.015] md:group-hover:scale-[1.02] border border-[#393E46] group-hover:border-[#0077FF]/30 shadow-lg group-hover:shadow-xl group-hover:shadow-[#0077FF]/10"
                  style={{ backgroundImage: `url(${Subtract})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {/* Badge */}
                  <div className="absolute -top-1.5 -right-1.5 xs:-top-2 xs:-right-2 sm:-top-2.5 sm:-right-2.5 md:-top-3 md:-right-3 bg-[#0077FF] text-white px-1.5 py-0.5 xs:px-2 xs:py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-russo opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-0.5 xs:translate-y-1 sm:translate-y-1.5 md:translate-y-2 group-hover:translate-y-0">
                    {t("competitive")}
                  </div>

                  {/* Icon Container */}
                  <div className="flex-1 flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#0077FF]/15 rounded-full blur-md sm:blur-lg md:blur-xl lg:blur-2xl scale-110 sm:scale-125 md:scale-150 group-hover:scale-100 sm:group-hover:scale-110 md:group-hover:scale-125 transition-all duration-700"></div>
                      <div className="relative p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-4 xl:p-5 bg-[#222831]/50 rounded-lg sm:rounded-xl md:rounded-2xl backdrop-blur-sm border border-[#0077FF]/20 group-hover:border-[#0077FF]/40 transition-all duration-300">
                        <img
                          src={s_logo} 
                          alt="Tournaments" 
                          className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 filter drop-shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-1.5 xs:space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 w-full px-1.5 xs:px-2 sm:px-2.5 md:px-3">
                    <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-2xl font-russo text-white group-hover:text-[#0077FF] transition-colors duration-300 leading-tight">
                      {t("tournaments")}
                    </h3>
                    <p className="text-[#EEEEEE]/70 text-[10px] xs:text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2">
                      {t("compete")}
                    </p>
                    <div className="pt-0.5 xs:pt-1 sm:pt-1.5 md:pt-2 w-full flex justify-center">
                      <Link 
                        to="tournament-game" 
                        className="inline-block w-auto max-w-full bg-[#0077FF] hover:bg-[#0066DD] text-white px-2.5 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-2.5 xl:px-8 xl:py-3 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl font-russo text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-xs transition-all duration-300 hover:shadow-lg hover:shadow-[#0077FF]/30 active:scale-95 transform hover:translate-y-[-0.5px] sm:hover:translate-y-[-1px] md:hover:translate-y-[-2px] whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {t("join_tournanemt")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Game Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-[#0077FF]/8 rounded-xl sm:rounded-2xl md:rounded-3xl transform -rotate-0.5 sm:-rotate-0.75 md:-rotate-1 group-hover:rotate-0 transition-all duration-500 ease-out"></div>
                <div className="absolute inset-0 bg-gradient-to-tl from-[#0077FF]/5 to-transparent rounded-xl sm:rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div 
                  className="relative flex flex-col items-center justify-between bg-[#393E46] rounded-xl sm:rounded-2xl md:rounded-3xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 h-56 xs:h-64 sm:h-72 md:h-80 lg:h-[22rem] xl:h-96 transition-all duration-500 group-hover:translate-y-[-3px] sm:group-hover:translate-y-[-4px] md:group-hover:translate-y-[-6px] lg:group-hover:translate-y-[-8px] group-hover:scale-[1.01] sm:group-hover:scale-[1.015] md:group-hover:scale-[1.02] border border-[#393E46] group-hover:border-[#0077FF]/30 shadow-lg group-hover:shadow-xl group-hover:shadow-[#0077FF]/10"
                  style={{ backgroundImage: `url(${Subtract})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {/* Badge */}
                  <div className="absolute -top-1.5 -right-1.5 xs:-top-2 xs:-right-2 sm:-top-2.5 sm:-right-2.5 md:-top-3 md:-right-3 bg-[#0077FF] text-white px-1.5 py-0.5 xs:px-2 xs:py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-russo opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-0.5 xs:translate-y-1 sm:translate-y-1.5 md:translate-y-2 group-hover:translate-y-0">
                    {t("classic")}
                  </div>

                  {/* Icon Container */}
                  <div className="flex-1 flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#0077FF]/15 rounded-full blur-md sm:blur-lg md:blur-xl lg:blur-2xl scale-110 sm:scale-125 md:scale-150 group-hover:scale-100 sm:group-hover:scale-110 md:group-hover:scale-125 transition-all duration-700"></div>
                      <div className="relative p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-4 xl:p-5 bg-[#222831]/50 rounded-lg sm:rounded-xl md:rounded-2xl backdrop-blur-sm border border-[#0077FF]/20 group-hover:border-[#0077FF]/40 transition-all duration-300">
                        <img
                          src={f_logo} 
                          alt="Local" 
                          className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 filter drop-shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-1.5 xs:space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 w-full px-1.5 xs:px-2 sm:px-2.5 md:px-3">
                    <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-2xl font-russo text-white group-hover:text-[#0077FF] transition-colors duration-300 leading-tight">
                      {t("local")}
                    </h3>
                    <p className="text-[#EEEEEE]/70 text-[10px] xs:text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2">
                      {t("classic_couch")}
                    </p>
                    <div className="pt-0.5 xs:pt-1 sm:pt-1.5 md:pt-2 w-full flex justify-center">
                      <Link
                        to="local-game" 
                        className="inline-block w-auto max-w-full bg-[#0077FF] hover:bg-[#0066DD] text-white px-2.5 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-2.5 xl:px-8 xl:py-3 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl font-russo text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-xs transition-all duration-300 hover:shadow-lg hover:shadow-[#0077FF]/30 active:scale-95 transform hover:translate-y-[-0.5px] sm:hover:translate-y-[-1px] md:hover:translate-y-[-2px] whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {t("tic_local_btn")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remote Game Card */}
              <div className="group relative sm:col-span-2 lg:col-span-1 sm:max-w-sm sm:mx-auto md:max-w-md lg:max-w-none">
                <div className="absolute inset-0 bg-[#0077FF]/8 rounded-xl sm:rounded-2xl md:rounded-3xl transform rotate-0.5 sm:rotate-0.75 md:rotate-1 group-hover:rotate-0 transition-all duration-500 ease-out"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-[#0077FF]/5 to-transparent rounded-xl sm:rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div 
                  className="relative flex flex-col items-center justify-between bg-[#393E46] rounded-xl sm:rounded-2xl md:rounded-3xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 h-56 xs:h-64 sm:h-72 md:h-80 lg:h-[22rem] xl:h-96 transition-all duration-500 group-hover:translate-y-[-3px] sm:group-hover:translate-y-[-4px] md:group-hover:translate-y-[-6px] lg:group-hover:translate-y-[-8px] group-hover:scale-[1.01] sm:group-hover:scale-[1.015] md:group-hover:scale-[1.02] border border-[#393E46] group-hover:border-[#0077FF]/30 shadow-lg group-hover:shadow-xl group-hover:shadow-[#0077FF]/10"
                  style={{ backgroundImage: `url(${Subtract})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  {/* Badge */}
                  <div className="absolute -top-1.5 -right-1.5 xs:-top-2 xs:-right-2 sm:-top-2.5 sm:-right-2.5 md:-top-3 md:-right-3 bg-[#0077FF] text-white px-1.5 py-0.5 xs:px-2 xs:py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-russo opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-0.5 xs:translate-y-1 sm:translate-y-1.5 md:translate-y-2 group-hover:translate-y-0">
                    {t("online")}
                  </div>

                  {/* Icon Container */}
                  <div className="flex-1 flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#0077FF]/15 rounded-full blur-md sm:blur-lg md:blur-xl lg:blur-2xl scale-110 sm:scale-125 md:scale-150 group-hover:scale-100 sm:group-hover:scale-110 md:group-hover:scale-125 transition-all duration-700"></div>
                      <div className="relative p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-4 xl:p-5 bg-[#222831]/50 rounded-lg sm:rounded-xl md:rounded-2xl backdrop-blur-sm border border-[#0077FF]/20 group-hover:border-[#0077FF]/40 transition-all duration-300">
                        <img
                          src={t_logo} 
                          alt="Remote" 
                          className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 filter drop-shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-1.5 xs:space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 w-full px-1.5 xs:px-2 sm:px-2.5 md:px-3">
                    <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-2xl font-russo text-white group-hover:text-[#0077FF] transition-colors duration-300 leading-tight">
                      {t("remote")}
                    </h3>
                    <p className="text-[#EEEEEE]/70 text-[10px] xs:text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2">
                      {t("challenge")}
                    </p>
                    <div className="pt-0.5 xs:pt-1 sm:pt-1.5 md:pt-2 w-full flex justify-center">
                      <Link
                        to="remote-game" 
                        className="inline-block w-auto max-w-full bg-[#0077FF] hover:bg-[#0066DD] text-white px-2.5 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-2.5 xl:px-8 xl:py-3 rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl font-russo text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-xs transition-all duration-300 hover:shadow-lg hover:shadow-[#0077FF]/30 active:scale-95 transform hover:translate-y-[-0.5px] sm:hover:translate-y-[-1px] md:hover:translate-y-[-2px] whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {t("start_battle")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="text-center mt-4 xs:mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16 flex-shrink-0">
            <div className="inline-flex flex-col items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
              <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 text-[#EEEEEE]/50 text-[10px] xs:text-xs sm:text-sm md:text-base">
                <div className="flex gap-0.5 sm:gap-1">
                  <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-[#0077FF] rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-[#0077FF]/60 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-[#0077FF]/40 rounded-full animate-pulse delay-300"></div>
                </div>
                <span className="font-russo tracking-wide text-center">{t("select_ur_prefered")}</span>
                <div className="flex gap-0.5 sm:gap-1">
                  <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-[#0077FF]/40 rounded-full animate-pulse delay-500"></div>
                  <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-[#0077FF]/60 rounded-full animate-pulse delay-650"></div>
                  <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-[#0077FF] rounded-full animate-pulse delay-800"></div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 lg:gap-6 text-[#EEEEEE]/30 text-[9px] xs:text-[10px] sm:text-xs">
                <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#0077FF] rounded-full"></div>
                  <span className="whitespace-nowrap">{t("local_and_remote")}</span>
                </div>
                <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#0077FF] rounded-full"></div>
                  <span className="whitespace-nowrap">{t("tournament")}</span>
                </div>
                <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-[#0077FF] rounded-full"></div>
                  <span className="whitespace-nowrap">{t("cros_platforme")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PingPong;