import React, { useState, useEffect, useRef } from 'react';
import socket from '../../../Chat/services/socket';
import { LuGamepad2, LuZap, LuTarget } from "react-icons/lu";
import { BsFillTrophyFill } from "react-icons/bs";
import { HiUsers } from "react-icons/hi2";
import { useLocation, useNavigate } from 'react-router-dom';
import GameWrapper from '../Remote/GameWrapper';
import { useParams } from 'react-router-dom';
import { Tournament } from './types';
import { useTranslation } from "react-i18next";

const TournamentGameStart: React.FC = () => {
  const {t} = useTranslation();
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerLeftGame, setPlayerLeftGame] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const userNameRef = useRef<string | null>(null);
  const checkedInRef = useRef(false);
  const location = useLocation();
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const customStyles = {
    primaryBg: { backgroundColor: '#007cf700' },
    secondaryBg: { backgroundColor: '#383e4500' },
    tertiaryBg: { backgroundColor: '#21283000' },
  };


  const checkIn = async () => {
    if (!tournamentId || !userNameRef.current || checkedInRef.current) {
      return;
    }

    setLoading(true);
    
    try {      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tournament-game`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournamentId,
          playerId: userNameRef.current,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('❌ Check-in error response:', errData);
        if (errData.error === "Tournament not found.")
          throw new Error(t("trn_not_found"));
      }
      
      checkedInRef.current = true;
      setLoading(false);
      
    } catch (error: any) {
      console.error("Check-in failed:", error.message);
      

      if (!playerLeftGame && !gameStarted && !gameEnded) {
        setError(error.message || "Failed to join tournament match");
      }
      setLoading(false);
    }
  };

  const fetchUserData = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/display-names`, {
        credentials: "include",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [id] }), // ✅ Send as array
      });
  
      if (!response.ok) {
        throw new Error(t("Failed_to_fetch_users"));
      }
  
      const responseData = await response.json();
      
      return responseData.users?.[0] || id;
    } catch (error) {
      console.error("Error fetching users:", error);
      return id;
    }
  };


  function waitForUserNameRef(userNameRef: React.RefObject<any>, timeout = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
      const interval = 100;
      let elapsedTime = 0;
  
      const checkInterval = setInterval(() => {
        if (userNameRef.current) {
          clearInterval(checkInterval);
          resolve();
        } else {
          elapsedTime += interval;
          if (elapsedTime >= timeout) {
            clearInterval(checkInterval);
            reject(new Error("Timeout: userNameRef did not become non-null"));
          }
        }
      }, interval);
    });
  }

  useEffect(() => {
    socket.connect();
    socket.emit('get-my-profile');

    const handleProfile = async (user: any) => {
      const userName = user.id;
      if (userName) {
        const fetchedName: string = await fetchUserData(userName);
        setName(fetchedName);
        userNameRef.current = userName;

        if (!joined) {
          setJoined(true);
          socket.emit('join-tournament', userName);
        }
      }
    };

    socket.on('profile-data', handleProfile);

    socket.on('playerLeft', (data) => {
      setPlayerLeftGame(true);
      setCountdown(null);
      setGameStarted(false);
      
      if (data !== userNameRef.current) {
        setTimeout(() => {
          navigate(`/game/ping-pong/tournament-game/tournament/${tournamentId}/view`);
        }, 2000);
      }
    });


    waitForUserNameRef(userNameRef)
      .then(() => {
        checkIn();
      })
      .catch((error) => {
        console.error("❌ Failed to load user profile:", error.message);
        setError(t("Failed_to_load_user_profile"));
        setLoading(false);
      });

    
    const handleBeforeUnload = () => {
      if (userNameRef.current) {
        socket.emit('playerLeft', userNameRef.current);
        socket.disconnect();
      }
    };
  
      window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (!playerLeftGame && !gameEnded && joined) {
        socket.emit('playerLeft', userNameRef.current);
      }
      socket.off('profile-data', handleProfile);
      socket.off('playerLeft');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (countdown === null || gameEnded) {
      return;
    }

    if (countdown < 0) {
      setGameStarted(true);
      setCountdown(null);
      return;
    }

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown, gameEnded]);

  useEffect(() => {
    const handleGameOver = () => {
      setGameEnded(true);
      setJoined(false);
      setReady(false);
      setGameStarted(false);
      setCountdown(null);
    };

    socket.on('gameOver', handleGameOver);

    return () => {
      socket.off('gameOver', handleGameOver);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (!playerLeftGame && joined && userNameRef.current) {
        socket.emit('playerLeft', userNameRef.current);
        // socket.disconnect();
      }
    };
  }, [location, joined]);

  const handleGoingBack = () => {
    setGameEnded(true);
    setCountdown(null);
    navigate(`/game/ping-pong/tournament-game/tournament/${tournamentId}/view`);
  };

  const handleGameEnd = (winner: string | null) => {
    setGameEnded(true);
    setCountdown(null);
    
    setTimeout(() => {
      navigate(`/game/ping-pong/tournament-game/tournament/${tournamentId}/view`);
    }, 1500);
  };
  
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={customStyles.tertiaryBg}>
        <div className="relative z-10 max-w-sm w-full text-center p-8 rounded-3xl backdrop-blur-xl border border-red-500/30">
          <LuTarget className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h3 className="text-2xl font-bold text-white mb-2">{t("error")}</h3>
          <p className="text-white/70">{error}</p>
          <button onClick={() => {navigate('/')}} className="mt-6 px-6 py-3 rounded-full text-sm font-semibold text-white bg-red-600/50 hover:bg-red-600/70 transition-colors">
            {t("go_home")}
          </button>
        </div>
      </div>
    );
  }

  if (gameStarted && !playerLeftGame) {
    return (
      <div className="flex min-h-screen overflow-hidden">
        <GameWrapper playerName={userNameRef.current.toString() || ''} onGameEnd={handleGameEnd} />
      </div>
    );
  }


  return (
    <div className="min-h-screen overflow-hidden bg-[#0f1117] text-white bg-[#21283000]">
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl text-center">
          {countdown !== null && countdown >= 0 && !gameStarted && !gameEnded ? (
            <>
              {/* Trophy + Heading */}
              <div className="mb-8">
                <div className="flex justify-center mb-4 relative">
                  <BsFillTrophyFill className="w-12 h-12 md:w-16 md:h-16 text-[#007cf7]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#007cf7] rounded-full animate-ping"></div>
                </div>
                <h1 className="text-[clamp(2rem,6vw,4.5rem)] font-black bg-gradient-to-r from-blue-500 via-[#318cf1] to-[#7fb4ed] bg-clip-text text-transparent animate-fade-in mb-2">
                  {t("TOURNAMENT")}
                </h1>
                <div className="flex flex-col sm:flex-row justify-center gap-3 text-white/80 text-sm sm:text-base">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#383e45]/40 rounded-full border border-[#007cf7]/30 backdrop-blur">
                    <HiUsers className="w-4 h-4 text-[#007cf7]" />
                    {t("Elite Competition")}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#383e45]/40 rounded-full border border-[#007cf7]/30 backdrop-blur">
                    <LuZap className="w-4 h-4 text-[#007cf7]" />
                    {t("High Stakes")}
                  </div>
                </div>
              </div>

              {/* Connected Name */}
              {name && (
                <div className="mb-8">
                  <div className="mx-auto max-w-xs sm:max-w-md bg-[#383e45]/40 backdrop-blur border border-[#007cf7]/30 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-[#007cf7] rounded-full animate-pulse" />
                      <span className="text-white/80 text-sm">{t("Connected as")}</span>
                    </div>
                    <div className="text-xl font-bold text-white bg-gradient-to-r from-[#007cf7] to-[#383e45] bg-clip-text text-transparent">
                      {name}
                    </div>
                  </div>
                </div>
              )}

              {/* Countdown Circle */}
              <div className="relative mb-8">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 mx-auto">
                  <div className="absolute inset-0 border-4 border-[#383e45]/50 rounded-full" />
                  <div className="absolute inset-0 border-4 border-transparent border-t-[#007cf7] border-r-[#383e45] animate-spin rounded-full" />
                  <div className="absolute inset-2 sm:inset-4 bg-gradient-to-br from-[#383e45]/80 to-[#21283000]/80 backdrop-blur rounded-full border border-[#007cf7]/30 flex items-center justify-center">
                    <div>
                      <div className="text-[clamp(2rem,6vw,4rem)] font-mono font-black hover:scale-110 transition-transform">
                        {countdown}
                      </div>
                      <div className="text-xs text-white/60">{t("SECONDS")}</div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-[#007cf7]/20 animate-ping" />
                </div>
              </div>

              {/* Get Ready */}
              <div className="max-w-md mx-auto p-4 sm:p-6 bg-gradient-to-r from-[#007cf7]/20 to-[#383e45]/20 border border-[#007cf7]/30 rounded-xl backdrop-blur">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <LuGamepad2 className="w-5 h-5 text-[#007cf7]" />
                  <span className="text-lg font-bold">{t("get_ready")}</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {t("prepare_for_tournament_p")}
                </p>
              </div>
            </>
          ) : playerLeftGame ? (
            // Player Left Screen
            <div className="space-y-8">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#007cf7] to-[#383e45] rounded-full flex items-center justify-center">
                  <HiUsers className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-[clamp(1.75rem,5vw,3.5rem)] font-black">{t("Player_Eliminated")}</h1>
              <p className="text-white/80 text-base sm:text-lg px-4">
                {t("opponent_left_p")}
              </p>

              <div className="bg-[#383e45]/40 border border-[#007cf7]/30 rounded-xl p-6 sm:p-8">
                <div className="flex justify-center items-center gap-2 mb-4">
                  <BsFillTrophyFill className="w-6 h-6 text-[#007cf7]" />
                  <span className="text-xl font-bold text-white">{t("Victory_Default")}</span>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  {t("congrats_player_left")}
                </p>

                <button
                  onClick={handleGoingBack}
                  className="group relative w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#007cf7] to-[#383e45] text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#007cf7]/25 active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <LuGamepad2 className="w-4 h-4" />
                    <span>{t("Continue_Tournament_btn")}</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#007cf7]/80 to-[#383e45]/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TournamentGameStart;