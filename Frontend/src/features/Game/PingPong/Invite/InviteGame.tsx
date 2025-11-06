import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameWrapper from '../Remote/GameWrapper';
import socket from '../../../Chat/services/socket';
import { RiPingPongFill } from 'react-icons/ri';
import { useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-hot-toast";

const InviteGame: React.FC = () => {
  const {t} = useTranslation();
  const { roomId } = useParams<{ roomId: string }>();
  const [playerName, setPlayerName] = useState<string>('');
  const [playerDisplayName, setPlayerDisplayName] = useState<string>('');
  const [gameReady, setGameReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [playerLeft, setPlayerLeft] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setError('');

    const fetchGame = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/invite/${roomId}`, {
          credentials: "include",
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error("Game not found.");
        }
        return response.ok;
      } catch (error:any) {
        toast.error(t("Game_Not_Found"));
        navigate('/chat');
      }
    };

    fetchGame();
    socket.connect();
    socket.emit('get-my-profile');

    socket.on('profile-data', (user: any) => {
      if (user?.id) {
        setPlayerName(String(user.id));
        setPlayerDisplayName(user.username || String(user.id));
      }
    });

    // Listen for game events
    socket.on('countdown', (time: number) => {
      setCountdown(time);
    });

    socket.on('ready', () => {
      setGameReady(true);
      setCountdown(null);
    });

    socket.on('error', (errorData: { message: string }) => {
      if (errorData && errorData.message === 'Authentication required')
        setError(t("Authentication_required"));
      else if (errorData && errorData.message === 'Game room not found or expired')
        setError(t("Game_room_not_found_or_expired"));
      else if (errorData && errorData.message === "Opponent_not_found")
        setError(t("Opponent_not_found"));
      else if (errorData && errorData.message === "You are not part of this game")
        setError(t("You_are_not_part_of_this_game"));
    });

    socket.on('playerLeft', (leftPlayer: string) => {
        setPlayerLeft(true);
        setTimeout(() => {
          navigate('/chat');
        }, 1000);
    });

    const handleBeforeUnload = () => {
      if (playerName) {
        socket.emit('playerLeft', playerName);
        socket.disconnect();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (gameReady)
        socket.emit('playerLeft', playerName);
      socket.off('profile-data');
      socket.off('countdown');
      socket.off('ready');
      socket.off('error');
      socket.off('playerLeft');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      socket.disconnect();
    };
  }, [roomId]);

  const handleGameEnd = (winner: string | null) => {
    setTimeout(() => {
      navigate('/chat');
    }, 3000);
  };

  const handleGoBack = () => {
    if (playerName) {
      socket.emit('playerLeft', playerName);
    }
    navigate('/chat');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222831] text-white">
        <div className="text-center p-8 bg-[#393E46] rounded-xl border border-red-500/30">
          <h1 className="text-2xl font-bold text-red-400 mb-4">{t("game_err")}</h1>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
          >
            {t("go_back_to_chat")}
          </button>
        </div>
      </div>
    );
  }

  if (playerLeft) {
    return (
         <div className="flex flex-col items-center justify-center text-white">
           <h1 className="text-5xl font-extrabold text-blue-500 drop-shadow-lg mb-6 animate-pulse">
             {t("palyer_left")}
           </h1>
           <button
             onClick={() => navigate('/chat')}
             className="mt-6 px-6 py-2 text-lg font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200"
           >
             {t("back_to_chat")}
           </button>
         </div>
       );
   }

  if (countdown !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222831] text-white">
        <div className="text-center">
          <RiPingPongFill className="w-20 h-20 mx-auto text-blue-400 mb-6" />
          <h1 className="text-4xl font-bold text-blue-400 mb-4">{t("get_ready")}</h1>
          <p className="text-xl text-white/80 mb-8">{t("game_start_in")}</p>
          <div className="text-8xl font-mono text-blue-300 font-bold animate-pulse">
            {countdown}
          </div>
        </div>
      </div>
    );
  }

  if (!gameReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#222831] text-white">
        <div className="text-center p-8 bg-[#393E46] rounded-xl">
          <RiPingPongFill className="w-16 h-16 mx-auto text-blue-400 mb-4 animate-spin" />
          <h1 className="text-2xl font-bold mb-4">{t("waiting_for_game")}</h1>
          <p className="text-white/70">{t("setting_up")}</p>
          <button
            onClick={handleGoBack}
            className="mt-6 px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#222831]">

      <GameWrapper 
        playerName={playerName}
        playerDisplayName={playerDisplayName}
        onGameEnd={handleGameEnd}
      />
    </div>
  );
};

export default InviteGame;