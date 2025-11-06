import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { HiUsers, HiOutlineSparkles } from "react-icons/hi2";
import { BsFillTrophyFill, BsAward } from "react-icons/bs";
import { FaPlay, FaTrash } from "react-icons/fa";
import { LuCrown, LuTarget, LuSwords } from "react-icons/lu";
import { PiTimer, PiStarFourBold } from "react-icons/pi";
import toast from "react-hot-toast";
import socket from "../../../Chat/services/socket";
import type { Tournament, Match, UserPlayer } from "./types";
import { useTranslation } from "react-i18next";

interface TournamentBoardProps {
  onStartNextRound?: () => void;
}

const TournamentBoard: React.FC<TournamentBoardProps> = ({ onStartNextRound }) => {
  const {t} = useTranslation();
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const tournamentRef = useRef<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const userRef = useRef<UserPlayer | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [completionCountdown, setCompletionCountdown] = useState<number | null>(null);
  const [idToUsernameMap, setIdToUsernameMap] = useState<Record<string, string>>({});
  const [ownerName, setOwnerName] = useState<string>("");
  const [winners, setWinners] = useState<string[]>([]);
  const [losers, setLosers] = useState<string[]>([]);
  const navigate = useNavigate();

  // Race condition prevention
  const [retryCount, setRetryCount] = useState(0);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  // Custom color palette styles
  const customStyles = {
    primaryBg: { backgroundColor: '#007cf700' },
    secondaryBg: { backgroundColor: '#383e4500' },
    tertiaryBg: { backgroundColor: '#21283000' },
  };

  // Helper function to get username from ID
  const getUsernameFromId = (id: string): string => {
    return idToUsernameMap[id] || id;
  };

  // Fetch users by IDs and create mapping
  const fetchUsersData = async (ids: string[]) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/display-names`, {
        credentials: "include",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error(t("Failed to fetch users"));
      }

      const responseData = await response.json();
      const fetchedUsers: string[] = responseData.users;

      const mapping: Record<string, string> = {};
      ids.forEach((id, index) => {
        mapping[id] = fetchedUsers[index] || id;
      });

      setIdToUsernameMap(prev => ({ ...prev, ...mapping }));
      return mapping;
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  // Fetch tournament with retry logic
  const fetchTournament = useCallback(async () => {
    if (!tournamentId || fetchingRef.current) {
      return;
    }
    
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tournaments/${tournamentId}`,
        {
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Tournament not found (ID: ${tournamentId})`);
        }
        const errData = await res.text().catch(() => 'Unknown error');
        throw new Error(errData || `HTTP ${res.status}: Failed to fetch tournament`);
      }

      const text = await res.text();
      if (!text) {
        throw new Error("Empty response from server");
      }

      const data = JSON.parse(text);

      
      if (!data.tournament) {
        throw new Error("Tournament data missing from response");
      }

      if (!mountedRef.current) {
        fetchingRef.current = false;
        return;
      }


      // Update tournament state
      setTournament(data.tournament);
      tournamentRef.current = data.tournament;
      setCountdown(data.tournament.countdown || null);

      // Process players safely - keep IDs internally
      const playersIds = Array.isArray(data.tournament.players) ? data.tournament.players : [];
      const participantsIds = Array.isArray(data.tournament.participants) ? data.tournament.participants : [];
      const winnersIds = Array.isArray(data.tournament.winners) ? data.tournament.winners : [];
      const losersIds = Array.isArray(data.tournament.losers) ? data.tournament.losers : [];
      const ownerId = data.tournament.owner || '';

      // Collect all unique user IDs
      const allUserIds = [
        ...playersIds,
        ...participantsIds,
        ...winnersIds,
        ...losersIds,
        ...(ownerId ? [ownerId] : [])
      ].filter((id, index, arr) => arr.indexOf(id) === index && id);

      // Fetch display names
      const mapping = await fetchUsersData(allUserIds);      
      // Store IDs (not display names) for comparison
      const displayPlayerIds = participantsIds.length > 0 ? participantsIds : playersIds;
      setPlayers(displayPlayerIds);
      setWinners(winnersIds);
      setLosers(losersIds);
      setOwnerName(ownerId);

      if (data.tournament?.status === 'completed' && data.tournament?.countdown === 0) {
        setCompletionCountdown(data.tournament.countdown);
      }
      
      setLoading(false);
      setRetryCount(0);
      fetchingRef.current = false;
      
    } catch (err: any) {
      console.error("❌ Error fetching tournament:", err.message);
      
      if (!mountedRef.current) {
        fetchingRef.current = false;
        return;
      }
      
      if (retryCount < MAX_RETRIES && !err.message.includes('not found')) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount);        
        setRetryCount(prev => prev + 1);
        fetchingRef.current = false;
        
        setTimeout(() => {
          fetchTournament();
        }, delay);
      } else {
        setError(t("Failed_to_load_tournament"));
        setLoading(false);
        fetchingRef.current = false;
      }
    }
  }, [tournamentId, retryCount]);

  // Main effect with proper initialization
  useEffect(() => {
    mountedRef.current = true;
    fetchingRef.current = false;
    setRetryCount(0);

    if (!socket.connected) {
      socket.connect();
    }

    const initTimer = setTimeout(() => {
      if (tournamentId && !tournament && !fetchingRef.current) {
        fetchTournament();
      }
    }, 150);

    return () => {
      mountedRef.current = false;
      clearTimeout(initTimer);
    };
  }, [tournamentId]);

  // Fetch user profile and socket setup
  useEffect(() => {
    socket.connect();
    socket.emit("get-my-profile");
    
    const onProfile = (user: UserPlayer) => {
      if (user?.id) {
        setUserId(user.id);
        setUserName(user.username || user.id);
        userRef.current = user;
      }
    };

    socket.on("profile-data", onProfile);

    socket.emit("join-tournament-room", tournamentId);

    const handleTournamentUpdated = async (updatedTournament: Tournament) => {
      setLoading(false);
      if (updatedTournament.id === tournamentId) {        
        setTournament(updatedTournament);
        tournamentRef.current = updatedTournament;
        setCountdown(updatedTournament.countdown || null);
        
        if (updatedTournament.countdown) {
          setTimerStarted(true);
        }

        const playersIds = Array.isArray(updatedTournament.players) ? updatedTournament.players : [];
        const participantsIds = Array.isArray(updatedTournament.participants) ? updatedTournament.participants : [];
        const winnersIds = Array.isArray(updatedTournament.winners) ? updatedTournament.winners : [];
        const losersIds = Array.isArray(updatedTournament.losers) ? updatedTournament.losers : [];
        const ownerId = updatedTournament.owner || '';

        const allUserIds = [
          ...playersIds,
          ...participantsIds,
          ...winnersIds,
          ...losersIds,
          ...(ownerId ? [ownerId] : [])
        ].filter((id, index, arr) => arr.indexOf(id) === index && id);

        const mapping = await fetchUsersData(allUserIds);
        
        const displayPlayerIds = participantsIds.length > 0 ? participantsIds : playersIds;
        setPlayers(displayPlayerIds);
        setWinners(winnersIds);
        setLosers(losersIds);
        setOwnerName(ownerId);

        if (updatedTournament?.status === 'completed' && updatedTournament?.countdown === 0) {
          setCompletionCountdown(updatedTournament.countdown);
        }
      }
    };

    const handleMatchUpdate = (matchData: {
      tournamentId: string;
      roomId: string;
      score?: { left: number; right: number };
      winner?: string;
      loser?: string;
      status: string;
      finalScore?: { left: number; right: number };
      players?: string[];
    }) => {
      if (matchData.tournamentId === tournamentId && tournament) {        
        setTournament(prevTournament => {
          if (!prevTournament) return prevTournament;
          
          const updatedTournament = { ...prevTournament };
          const matchIndex = updatedTournament.matches.findIndex(m => m.roomId === matchData.roomId);
          
          if (matchIndex !== -1) {
            const updatedMatch = { ...updatedTournament.matches[matchIndex] };
            
            if (matchData.status === 'completed') {
              updatedMatch.progress = 'completed';
              updatedMatch.winner = matchData.winner;
              updatedMatch.loser = matchData.loser;
              
              if (matchData.finalScore && updatedMatch.state) {
                updatedMatch.state.score = matchData.finalScore;
              }
            } else if (matchData.status === 'in_progress') {
              updatedMatch.progress = 'in_progress';
              
              if (matchData.score && updatedMatch.state) {
                updatedMatch.state.score = matchData.score;
              }
            }
            
            updatedTournament.matches[matchIndex] = updatedMatch;
          }
          
          return updatedTournament;
        });
      }
    };

    const handleTournamentDeleted = (data: { message: string; tournamentId: string }) => {
      if (data.tournamentId === tournamentId) {
        toast.error(data.message || "Tournament has been deleted.", {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#ef4444',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '12px',
            padding: '16px',
          },
          icon: '🏆',
        });
        
        setTimeout(() => {
          navigate('/game/ping-pong/tournament-game/tournament-join');
        }, 2000);
      }
    };

    socket.on("tournament-updated", handleTournamentUpdated);
    socket.on("tournament-match-update", handleMatchUpdate);
    socket.on("tournament-deleted", handleTournamentDeleted);

    socket.on('readyToPlay', (payload) => {
      if (tournamentRef.current?.winners.findIndex(winner => winner == userRef?.current?.id) !== -1) {
        socket.emit("addToRoom", userRef.current?.id);
        navigate(`/game/ping-pong/tournament-game/tournament/${tournamentId}/game`);
      }
    });

    return () => {
      socket.emit("leave-tournament-room", { userId: userRef.current?.id, tournamentId });
      socket.off("tournament-updated", handleTournamentUpdated);
      socket.off("tournament-match-update", handleMatchUpdate);
      socket.off("tournament-deleted", handleTournamentDeleted);
      socket.off("profile-data", onProfile);
      socket.off("readyToPlay");
    };
  }, [tournamentId, navigate, tournament, tournamentRef]);

  // Countdown handling
  useEffect(() => {
    socket.on("tournament-starting", (countdownDuration: number) => {
      setCountdown(countdownDuration);
      setTimerStarted(true);
    });
    socket.on("countdown", (countdown: number) => {
      setCountdown(countdown);
      setTimerStarted(true);
    });
    socket.on("tournament-started", () => {
      setTimerStarted(false);
      setCountdown(null);
    });
    return () => {
      socket.off("tournament-starting");
      socket.off("countdown");
      socket.off("tournament-started");
    };
  }, []);

  const handleStartTournament = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tournaments/${tournamentId}/start`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(t("Failed to start tournament"));
      }
      setCountdown(180);
      setTimerStarted(true);
      socket.emit("tournament-starting", 180);
    } catch (error:any) {
      setError(error.message);
    }
  };

  const handleDeleteTournament = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete the tournament "${tournament?.name}"? This action cannot be undone.`);
    
    if (!confirmed) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tournaments/${tournamentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete tournament");
      }

      navigate('/game/ping-pong/tournament-game/tournament-join');
    } catch (error:any) {
      setError(t("Failed to delete tournament"));
    }
  };

  useEffect(() => {
    socket.on('tournaments_updated', (updatedTournaments) => {
      if (!updatedTournaments.find((t:Tournament) => t.id === tournamentId)) {
        navigate('/game/ping-pong/tournament-game/tournament-join');
      }
    });

    return () => {
      socket.off('tournaments_updated');
    };
  }, [tournamentId, navigate]);

  useEffect(() => {
    socket.on('tournament:state', (updatedTournament: Tournament) => {
      if (updatedTournament.id === tournamentId) {
        setTournament(updatedTournament);
        setCompletionCountdown(updatedTournament.countdown || null);
      }
    });

    return () => {
      socket.off('tournament:state');
    };
  }, [tournamentId, tournamentRef]);

  const matchesByRound = (tournament?.matches ?? []).reduce<Record<number, Match[]>>((acc, game) => {
    const round = game.round ?? 1;
    if (!acc[round]) acc[round] = [];
    
    const playersIds = Array.isArray(game.players) && game.players.length == 2 ? game.players : game.readyPlayers;
    const player1Id = playersIds[0] || '';
    const player2Id = playersIds[1] || '';
    
    acc[round].push({
      id: game.roomId || '',
      round: round,
      players: [
        player1Id ? (getUsernameFromId(player1Id)) : 'TBD',
        player2Id ? (getUsernameFromId(player2Id)) : 'TBD',
      ],
      status: game.progress === 'in_progress' ? 'playing' : game.progress === 'completed' ? 'finished' : 'pending',
      winner: game.winner ? getUsernameFromId(game.winner) : null,
      roomId: game.roomId,
      score: {
        [player1Id ? (getUsernameFromId(player1Id)) : 'TBD']: game.state?.score?.left || 0,
        [player2Id ? (getUsernameFromId(player2Id)) : 'TBD']: game.state?.score?.right || 0,
      },
    });
    return acc;
  }, {});

  const rounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  const generateMatchPreview = (playerIds: string[]) => {
    const pairs = [];
    for (let i = 0; i < playerIds.length; i += 2) {
      const p1Id = playerIds[i];
      const p2Id = playerIds[i + 1];
      const p1 = p1Id ? getUsernameFromId(p1Id) : t("awaiting_challenger");
      const p2 = p2Id ? getUsernameFromId(p2Id) : t("awaiting_challenger");
      pairs.push([p1, p2]);
    }
    return pairs;
  };

  const hasMatches = Array.isArray(tournament?.matches) && tournament.matches.length > 0;
  const matchPreviews = !hasMatches ? generateMatchPreview(players) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={customStyles.tertiaryBg}>
        <div className="relative z-10 text-center space-y-4">
          <BsFillTrophyFill className="w-20 h-20 mx-auto text-blue-400 animate-pulse-slow" />
          <h2 className="text-3xl font-bold text-white">{t("loading_arena")}</h2>
          <p className="text-white/60">{t("praeparing_stage")}</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-gradient-to-r from-blue-500/20 to-[#7fb4ed]/20 rounded-full blur-3xl animate-blob"></div>
        </div>
      </div>
    );
  }

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

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={customStyles.tertiaryBg}>
        <div className="text-center">
          <BsFillTrophyFill className="w-20 h-20 mx-auto mb-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white mb-2">{t("trn_not_found")}</h2>
          <p className="text-white/60">{t("has_vanished")}</p>
        </div>
      </div>
    );
  }

  const isOwner = userId === parseInt(ownerName);

  return (
    <div className="relative w-full" style={customStyles.tertiaryBg}>
      <div className="relative overflow-y-scroll max-h-[90vh] custom-scroll">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full sm:w-2/3 sm:h-2/3 bg-gradient-to-r from-blue-500/10 via-[#318cf1]/20 to-[#7fb4ed]/5 rounded-full blur-3xl animate-blob"></div>
      </div>
      <div className="relative z-10 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="relative inline-block">
            <BsFillTrophyFill className="w-24 h-24 mx-auto text-transparent bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 bg-clip-text" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mt-4">
            <span className="bg-gradient-to-r from-blue-500 via-[#318cf1] to-[#7fb4ed] bg-clip-text text-transparent">
              {tournament.name}
            </span>
          </h1>
          <p className="text-white/60 text-lg mt-2">
            {t("an_elite")}
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-white/80">
              <HiUsers className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">{players.length} / {tournament.maxPlayers} {t("Players")}</span>
            </div>
          </div>
        </div>

        {/* Countdown & Owner Controls */}
        {timerStarted && countdown !== null && tournament.status !== "completed" && (
          <div className="mb-12 max-w-lg mx-auto p-8 rounded-3xl backdrop-blur-xl border border-white/20 text-center transition-all duration-500" style={customStyles.secondaryBg}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <PiTimer className="w-8 h-8 text-orange-400 animate-ping-slow" />
              <h3 className="text-2xl font-bold text-orange-400">{t("battle_comm")}</h3>
            </div>
            <div className="text-6xl sm:text-7xl font-mono font-black text-white/90">
              {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
            </div>
            <p className="text-white/70 mt-2">{t("prepare_for_glory")}</p>
          </div>
        )}

        {(tournament.status === "completed" && winners.length === 1) && (
          <div className="mb-12 max-w-lg mx-auto p-8 rounded-3xl backdrop-blur-xl border border-white/20 text-center transition-all duration-500" style={customStyles.secondaryBg}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <BsAward className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-yellow-400">
                {tournament.status === "completed" ? "Tournament Concluded" : "Champion Crowned!"}
              </h3>
            </div>
            {winners.length > 0 ? (
              <div className="text-white/90">
                <p className="text-lg">{t("champions")}</p>
                <h2 className="text-3xl font-bold">{getUsernameFromId(winners[0])}</h2>
                {completionCountdown !== null && tournament.status === "completed" && (
                  <p className="mt-4 text-white/60">
                    {t("trn_ending_in")} {completionCountdown}s
                  </p>
                )}
              </div>
            ) : (
              <p className="text-white/70">{t("no_champion")}</p>
            )}
          </div>
        )}

        {isOwner && tournament.status === "waiting" && (
          <div className="mb-12 max-w-lg mx-auto p-8 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500 text-center" style={customStyles.secondaryBg}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <LuCrown className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-yellow-400">{t("trn_master")}</h3>
            </div>
            <div className="space-y-4">
              {players.length === tournament.maxPlayers ? (
                <button 
                  onClick={handleStartTournament} 
                  className="w-full relative overflow-hidden flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white font-semibold group hover:scale-[1.02] transition-transform duration-300"
                >
                  <FaPlay className="w-6 h-6 text-green-400 group-hover:animate-spin-slow" />
                  <span className="text-lg">{t("start_trn")}</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-yellow-400 text-sm">
                    {t("waiting_for")} {tournament.maxPlayers - players.length} {t("more_players_to_join")}
                  </p>
                </div>
              )}
              
              <button 
                onClick={handleDeleteTournament}
                className="w-full relative overflow-hidden flex items-center justify-center gap-3 py-3 px-6 rounded-2xl bg-gradient-to-r from-red-500/20 to-red-600/20 text-white font-semibold group hover:scale-[1.02] transition-transform duration-300 border border-red-500/30"
              >
                <FaTrash className="w-5 h-5 text-red-400" />
                <span className="text-base">{t("delete_trn")}</span>
              </button>
            </div>
          </div>
        )}

        {isOwner && tournament.status === "in_progress" && (!tournament.matches.length || tournament.matches.every((match) => match.progress === "completed")) && winners.length !== 1 && !countdown && (
          <div className="mb-12 max-w-lg mx-auto p-8 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500 text-center" style={customStyles.secondaryBg}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <LuCrown className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-yellow-400">{t("trn_master")}</h3>
            </div>
            <button onClick={handleStartTournament} className="w-full relative overflow-hidden flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white font-semibold group hover:scale-[1.02] transition-transform duration-300">
              <FaPlay className="w-6 h-6 text-green-400 group-hover:animate-spin-slow" />
              <span className="text-lg">{t("start_next_round")}</span>
            </button>
          </div>
        )}

        {/* Players Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            {t("Players")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {players.map((playerId, index) => {
              const isCurrentUser = playerId === userId.toString();
              const isWinner = winners.includes(playerId);
              const isLoser = losers.includes(playerId);
              const displayName = getUsernameFromId(playerId);
              
              return (
                <div key={index} className="relative p-4 rounded-xl border border-white/20 backdrop-blur-sm group hover:border-blue-400/50 transition-colors duration-300" style={customStyles.primaryBg}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-[#7fb4ed]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-[#7fb4ed] flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <span className="flex-1 text-white font-semibold truncate">{displayName}</span>
                    {isWinner && <span className="text-green-400">{t("active")}</span>}
                    {isLoser && <span className="text-red-400">{t("Eliminated")}</span>}
                    {isCurrentUser && <PiStarFourBold className="w-4 h-4 text-yellow-400 animate-pulse" />}
                  </div>
                </div>
              );
            })}
            {tournament.status === 'waiting' && Array.from({ length: tournament.maxPlayers - players.length }).map((_, index) => (
              <div key={`empty-${index}`} className="relative p-4 rounded-xl border-2 border-dashed border-white/20 backdrop-blur-sm flex items-center justify-center" style={customStyles.tertiaryBg}>
                <span className="text-white/50 text-sm">{t("awaitng_warr")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Matches/Bracket Section */}
        {rounds.length > 0 && (
          <div className="space-y-8">
            {rounds.map((round) => {
              const roundMatches = matchesByRound[round];
              
              return (
                <div key={round} className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500" style={customStyles.secondaryBg}>
                  <div className="flex items-center gap-4 mb-6">
                    <BsAward className="w-8 h-8 text-orange-400" />
                    <h3 className="text-2xl font-bold text-white">{t("Round")} {round}</h3>
                    <span className="text-sm text-white/60">({roundMatches.length} {t("matches")})</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {roundMatches.map((match, matchIndex) => (
                      <Link
                        key={match.id}
                        to={`/game/ping-pong/tournament-game/tournament/${tournament.id}/match/${match.id}`}
                        className="group p-4 rounded-xl border border-white/20 backdrop-blur-sm hover:border-orange-400/50 transition-colors duration-300"
                        style={customStyles.primaryBg}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-orange-400">Match {matchIndex + 1}</span>
                          {match.status === 'finished' && <span className="text-xs text-green-400 font-medium">✓ {t("Completed")}</span>}
                          {match.status === 'playing' && <span className="text-xs text-blue-400 font-medium">🎮 {t("Live")}</span>}
                          {match.status === 'pending' && <span className="text-xs text-yellow-400 font-medium">⏳ {t("Pending")}</span>}
                        </div>
                        <div className="flex items-center justify-between text-white font-semibold">
                          <span className={`truncate ${match.winner === match.players[0] ? 'text-green-400' : match.winner ? 'text-red-400' : ''}`}>
                            {match.players[0]}
                          </span>
                          <LuSwords className="w-4 h-4 mx-2 text-white/60" />
                          <span className={`truncate ${match.winner === match.players[1] ? 'text-green-400' : match.winner ? 'text-red-400' : ''}`}>
                            {match.players[1]}
                          </span>
                        </div>
                        {match.winner && (
                          <div className="mt-2 text-xs text-center text-green-400">
                            {t("winner_")} {match.winner}
                          </div>
                        )}
                        {match.status === 'playing' && (
                          <div className="mt-2 text-xs text-center text-blue-400">
                            {t("score")} {(match.players[0] ? match.score?.[match.players[0]] ?? 0 : 0)} - {(match.players[1] ? match.score?.[match.players[1]] ?? 0 : 0)}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default TournamentBoard;