// src/components/RemotePong.tsx
import React, { useState, useRef, useEffect } from 'react';
import GameWrapper from './GameWrapper';
import socket, { joinGame, onReady } from '../../../Chat/services/socket';
import { FiUsers } from 'react-icons/fi';
import { RiPingPongFill } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const RemotePong: React.FC = () => {
  const {t} = useTranslation();
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [joined, setJoined] = useState(false);
  const [ready, setReady] = useState(false);
  const [playerLeft, setPlayerLeft] = useState(false);
  const userNameRef = useRef<string | null>(null);
  const userDisplayNameRef = useRef<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const location = useLocation();


  useEffect(() => {
    socket.connect();
    socket.emit('get-my-profile');

    const handleProfile = (user: any) => {
      const userId = user.id;
      const username = user.username || user.id;
      
      
      if (userId) {
        setName(userId);
        setDisplayName(username);
        userNameRef.current = userId;
        userDisplayNameRef.current = username;

        if (!joined) {
          setJoined(true);
          joinGame(userId.toString());
        }
      }
    };

    socket.on('profile-data', handleProfile);

    const handleCountdown = (time: number) => {
      setCountdown(time);
    };

    const handleReady = () => {
      setCountdown(null);
      setReady(true);
    };

    socket.on('countdown', handleCountdown);
    socket.on('ready', handleReady);

    return () => {
      socket.off('countdown', handleCountdown);
      socket.off('ready', handleReady);
      socket.off('profile-data', handleProfile);
    };
  }, []);

  useEffect(() => {
    const handleGameOver = () => {
      setJoined(false);
      setReady(false);
      socket.disconnect();
    };

    socket.on('gameOver', handleGameOver);

    return () => {
      socket.off('gameOver', handleGameOver);
    };
  }, []);

  useEffect(() => {
    socket.on('playerLeft', () => {
      setPlayerLeft(true);
    })

    const handleBeforeUnload = () => {
      if (userNameRef.current) {
        socket.emit('playerLeft', userNameRef.current);
        socket.disconnect();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (joined && userNameRef.current) {
        socket.emit('playerLeft', userNameRef.current);
        socket.disconnect();
      }
    };
  }, [location, joined]);
  
  const handleAnotherGame = () => {
    window.location.reload();
  }

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-72 w-full flex flex-col justify-center items-center h-full">
      {playerLeft ? (
        <div className="flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-extrabold text-blue-500 drop-shadow-lg mb-6 animate-pulse">
            {t("palyer_left")}
          </h1>
          <button
          onClick={handleAnotherGame}
          className="mt-6 px-6 py-2 text-lg font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {t("another_game")}
        </button>
        </div>
      ) : countdown !== null ? (
        <div className="flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-extrabold text-blue-400 drop-shadow-lg mb-6 animate-pulse">
            {t("match_found")}
          </h1>
          <p className="text-lg text-gray-300 mb-4 tracking-wide uppercase">
            {t("game_start_in")}
          </p>
          <div className="text-8xl font-mono text-blue-300 drop-shadow-xl animate-scaleUp">
            {countdown}
          </div>
        </div>
      ) : !ready ? (
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
                <span className="text-sm text-white font-medium truncate max-w-[100px] md:overflow-visible md:max-w-full">{displayName || 'You'}</span>
              </div>

              <div className="flex-1 mx-2 sm:mx-4 relative">
                <div className="h-0.5 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full animate-pulse"
                    style={{
                      animation: 'loading 2s ease-in-out infinite',
                      width: '60%',
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-2 border-dashed border-gray-500 rounded-full flex items-center justify-center mb-2 animate-pulse">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
                <span className="text-sm text-gray-400 font-medium">{t("opponant")}</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-3 bg-[#222831] px-6 py-3 rounded-full border border-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              <span className="text-gray-300 font-medium">{t("search_for_players")}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-600">
            <p className="text-sm text-gray-400 text-center">
              {t("get_some_water")}
            </p>
          </div>
        </div>
      ) : (
        <GameWrapper 
          playerName={userNameRef.current.toString() || ''} 
          playerDisplayName={userDisplayNameRef.current.toString() || ''}
        />
      )}
    </div>
  );
};

export default RemotePong;
