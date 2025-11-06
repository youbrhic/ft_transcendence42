// src/features/Game/PingPong/Tournaments/TournamentJoin.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import socket from "../../../Chat/services/socket";
import type { Tournament, Game, UserPlayer } from "./types";
import { useTranslation } from "react-i18next";
import {toast} from "react-hot-toast";

const TournamentJoin: React.FC = () => {
  const {t} = useTranslation();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const userRef = useRef<UserPlayer | null>(null);
  const [playerJoinedTournament, setPlayerJoinedTournament] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();
    socket.emit("get-my-profile");

    const onProfile = (user: UserPlayer) => {
      if (user?.id) {
        setUserId(user.id);
        userRef.current = user;
        setIsProfileLoaded(true);
      }
    };
    socket.on("profile-data", onProfile);
    return () => {socket.off("profile-data", onProfile);}
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tournaments`, {
        credentials: "include",
      });
      const data: Tournament[] = await res.json();
      if (playerJoinedTournament === false)
        data.some(t => {
          if (userRef.current && t.players.includes(userRef.current.id)) {
            setPlayerJoinedTournament(true);
            return true;
          }
          return false;
        });
    setTournaments(data);
    } catch (err) {
      console.error("Failed to fetch tournaments:", err);
    }
  };

  useEffect(() => {
    fetchTournaments();

    const onAdded = (t: Tournament) => {
      setTournaments((prev) => [...prev, t]);
      setPlayerJoinedTournament(t.players.includes(userRef.current?.id || "") || (t.owner === userRef?.current?.id));
    }
    const onUpdated = (updated: Tournament) => {
      setTournaments((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setPlayerJoinedTournament(updated.players.includes(userRef?.current?.id || "") || (updated.owner === userRef?.current?.id));
    }
    const onStarted = (updated: Tournament) => 
      setTournaments((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

    socket.on("tournament:added", onAdded);

    const onTournamentsUpdate = (data: any) => {
      if (Array.isArray(data)) {
        setTournaments(data);
      } else {
        console.error("Expected array, got:", data);
        setTournaments([]);
      }
    };
  
    socket.on("tournaments_updated", onTournamentsUpdate);
    socket.on("tournament:started", onStarted);

    // When a match is started from backend start flow
    socket.on("tournament:matchStarted", (payload: { tournamentId: string; matchId: string; round: number; players: [string, string] }) => {
      navigate(`/game/ping-pong/tournament-game/tournament/${payload.matchId}/game`);
    });

    return () => {
      socket.off("tournament:added", onAdded);
      socket.off("tournaments_updated", onUpdated);
      socket.off("tournament:started", onStarted);
      socket.off("tournament:matchStarted");
    };
  }, [navigate, isProfileLoaded]);

  const handleJoin = async (tournament: Tournament) => {
    if (!userId) return toast.error(t("User_not_loaded_yet"));
    const alreadyJoined = tournament.players.includes(userId.toString());
    if (alreadyJoined) return toast.error(t("You_are_already_in_this_tournament"));
    if (tournament.currentPlayers >= tournament.maxPlayers) return toast.error(t("Tournament_is_full"));
    if (tournament.status !== "waiting") return toast.error(t("Tournament_already_started"));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tournaments/${tournament.id}/join`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userId }),
      });
      if (!res.ok) {
        const err = await res.json();
        return toast.error(err.message || "Error joining tournament");
      }
      const updated: Tournament = await res.json();
      setTournaments((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setPlayerJoinedTournament(true);
    } catch (e: any) {
      toast.error(e?.message || "Error joining tournament");
    }
  };

  const handleLeave = async (tournament: Tournament) => {
    if (!userId) return toast.error(t("User_not_loaded_yet"));

    if (tournament.status !== "waiting") return toast.error(t("Tournament_already_started"));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tournaments/${tournament.id}/leave`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userId }),
      });
      if (!res.ok) {
        const err = await res.json();
        if (err.error === "Tournament not found.")
          return toast.error(t("Tournament_not_found"));
        else if (err.error === "Tournament already started.")
          return toast.error(t("Tournament_already_started"));
        else if (err.error === "Player not in tournament.")
          return toast.error(t("Player_not_in_tournament"));
        return toast.error(err.message || "Error leaving tournament");
      }
      const updated: Tournament = await res.json();
      setTournaments((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setPlayerJoinedTournament(false);
    } catch (e: any) {
      console.error("Error leaving tournament:", e);
    }
  };

  return (
    <div className="relative overflow-y-scroll max-h-[90vh] custom-scroll" style={{ backgroundColor: '#21283000' }}>
      {/* Background gradient blob */}
      <div className="relative inset-0 flex items-center justify-center">
        <div className="w-full h-full sm:w-2/3 sm:h-2/3 bg-gradient-to-r from-blue-500/10 via-[#318cf1]/20 to-[#7fb4ed]/5 rounded-full blur-3xl animate-blob"></div>
      </div>
      
      {/* Content container */}
      <div className="relative w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 via-[#318cf1] to-[#7fb4ed] bg-clip-text text-transparent">
              {t("Tournament_Arena")}
            </span>
          </h1>
          <p className="text-white/60 text-lg mt-2">
            {t("join_parag")}
          </p>
        </div>

        {/* Tournament Grid */}
        {tournaments.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#383e4500' }}>
              <span className="text-2xl sm:text-3xl">🏆</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {t("no_tourn")}
            </h3>
            <p className="text-white/60">{t("check_back_later_par")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-16">
            {tournaments.map((to) => {
              const isJoined = (!!userId && to.players.includes(userId.toString())) || (to.ownerPlays && to.owner === userId);
              const isOwner = !!userId && to.owner === userId;
              const isFull = to.currentPlayers >= to.maxPlayers;
              const canJoin = !isJoined && !isFull && to.status === "waiting" && !playerJoinedTournament;
              const canLeave = isJoined && to.status === "waiting";

              const statusConfig = {
                waiting: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', dot: 'bg-yellow-400' },
                in_progress: { color: 'text-blue-400', bg: 'bg-blue-400/10', dot: 'bg-blue-400' },
                completed: { color: 'text-green-400', bg: 'bg-green-400/10', dot: 'bg-green-400' },
              }[to.status] || { color: 'text-gray-400', bg: 'bg-gray-400/10', dot: 'bg-gray-400' };

              return (
                <div
                  key={to.id}
                  className="group relative backdrop-blur-xl border border-white/20 rounded-3xl p-4 sm:p-6 hover:border-white/30 transition-all duration-500"
                  style={{ backgroundColor: '#383e4500' }}
                >
                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                      <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                      <span className="text-xs font-medium capitalize">
                        {to.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Tournament Header */}
                  <div className="mb-4 sm:mb-6 pr-16 sm:pr-20">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 truncate">
                      {to.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {isOwner && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-400/10 text-yellow-400 text-xs font-medium">
                          👑 {t("owner")}
                        </span>
                      )}
                      {isJoined && !isOwner && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-400/10 text-green-400 text-xs font-medium">
                          ✓ {t("Joined")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Player Count */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 rounded-lg" style={{ backgroundColor: '#21283000' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">👥</span>
                      <span className="text-white font-medium text-sm sm:text-base">{t("Players")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm sm:text-base">
                        {to.currentPlayers}/{to.maxPlayers}
                      </span>
                      {isFull && (
                        <span className="px-2 py-1 bg-red-400/10 text-red-400 text-xs rounded-lg">
                          {t("Full")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {to.description && (
                    <p className="text-white/60 text-sm mb-4 sm:mb-6 line-clamp-2">
                      {to.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {/* Join/Leave Button */}
                      {!isJoined ? (
                        <button
                          onClick={() => handleJoin(to)}
                          disabled={!canJoin}
                          className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                            canJoin
                              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white hover:scale-[1.02] transition-transform duration-300"
                              : "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {isFull ? t("Full") : t("Join_Tournament")}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLeave(to)}
                          disabled={!canLeave}
                          className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                            canLeave
                              ? "bg-gradient-to-r from-red-500/20 to-red-600/20 text-white hover:scale-[1.02] transition-transform duration-300 border border-red-500/30"
                              : "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {t("Leave")}
                        </button>
                      )}

                      {/* View Button */}
                      <Link
                        to={`/game/ping-pong/tournament-game/tournament/${to.id}/view`}
                        className="flex justify-center items-center sm:flex-none py-2.5 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-white rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02] text-center border border-purple-500/30"
                      >
                        {t("View_Board")}
                      </Link>
                    </div>

                    {/* Status Message */}
                    {!canJoin && !isJoined && (
                      <div className="text-center py-2 px-3 rounded-lg" style={{ backgroundColor: '#21283000' }}>
                        <span className="text-white/60 text-xs">
                          {isFull ? t("Tournament_is_full"): 
                          to.status !== "waiting" ? t("Already_started") :
                          playerJoinedTournament ? t("Already_in_another_tournament") : t("Cannot_join")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentJoin;
