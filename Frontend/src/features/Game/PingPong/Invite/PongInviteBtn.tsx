import React, { useState, useEffect } from 'react';
import socket from '../../../Chat/services/socket';
import { RiPingPongFill } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
interface PongInviteButtonProps {
  recipientUsername: string | number;
  currentUserId: string | number;
  onInviteSent?: () => void;
}

const PongInviteButton: React.FC<PongInviteButtonProps> = ({ 
  recipientUsername, 
  currentUserId, 
  onInviteSent 
}) => {
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();
  const {t} = useTranslation();

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        // Helper function to fetch blocked users for a given userId
        const fetchAndCheckBlockedUsers = async (userId: string | number) => {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-blocked-users`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ userId }),
            headers: { 'Content-Type': 'application/json' },
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log("Blocked users data:", data, currentUserId, recipientUsername);
  
            const blockedUsers = data.blockedUsers;
            console.log("Blocked users array:", blockedUsers);
            if (Array.isArray(blockedUsers)) {
              // Check if the recipient or current user is in the blocked list
              return (blockedUsers.includes(recipientUsername) && blockedUsers.includes(currentUserId) && userId === currentUserId);
            } else {
              console.error("Blocked users data is not an array:", blockedUsers);
            }
          } else {
            console.error(`Failed to fetch blocked users for userId ${userId}:`, response.statusText);
          }
          return false;
        };
  
        const isCurrentUserBlocked = await fetchAndCheckBlockedUsers(currentUserId);
  
        setIsBlocked(isCurrentUserBlocked);
        console.log('Is blocked:', isCurrentUserBlocked);
      } catch (err) {
        console.error('Error fetching blocked users:', err);
      }
    };
  
    fetchBlockedUsers();
  }, [currentUserId, recipientUsername]);

  useEffect(() => {
    const handleInviteSent = (data: any) => {
      setIsInviting(false);
      setInviteSent(true);
      setWaitingForOpponent(true);
      onInviteSent?.();
      
      toast.success(t('Pong_invite_sent_Waiting_for_opponent'), {
        icon: '🏓',
        duration: 3000,
      });
      
      setTimeout(() => {
        setInviteSent(false);
        setWaitingForOpponent(false);
      }, 5000);
    };

    const handleGameStarting = (data: any) => {
      
      setWaitingForOpponent(false);
      setInviteSent(false);
      
      navigate(`/game/ping-pong/invite/${data.roomId}`);
      
      toast.success(t("Opponent_accepted_Starting_game"), {
        icon: '🎮',
        duration: 2000,
      });
    };

    const handleError = (error: any) => {
      setIsInviting(false);
      setWaitingForOpponent(false);
      console.error('❌ Error event received:', error);
      if (error && error.message === 'Authentication required')
        toast.error(t("Authentication_required"), {
          icons: '❌',
          duration: 4000,
        });
      else if (error && error.message === 'Game room not found or expired')
        toast.error(t("Game_room_not_found_or_expired"), {
          icons: '❌',
          duration: 4000,
        });
      else if (error && error.message === "Opponent_not_found")
        toast.error(t("Opponent_not_found"), {
          icons: '❌',
          duration: 4000,
        });
      else if (error && error.message === "You are not part of this game")
        toast.error(t("You_are_not_part_of_this_game"), {
          icons: '❌',
          duration: 4000,
        });
      else if (error && error.message === "Opponent is already in a game")
        toast.error(t("Opponent_is_already_in_a_game"), {
          icons: '❌',
          duration: 4000,
        });
    };

    const handleRefusal = (playerName:any) => {
      if (playerName == recipientUsername) {
        setInviteSent(false);
        setWaitingForOpponent(false);
        setIsInviting(false);
      }
    }

    socket.on('invite-sent', handleInviteSent);
    socket.on('game-starting', handleGameStarting);
    socket.on('error', handleError);
    socket.on('user-refused-game', handleRefusal);

    return () => {
      socket.off('invite-sent', handleInviteSent);
      socket.off('game-starting', handleGameStarting);
      socket.off('error', handleError);
      socket.off('user-refused-game', handleRefusal);

    };
  }, [onInviteSent, navigate]);

  const handleSendInvite = () => {
    if (isInviting || inviteSent) return;
    
    setIsInviting(true);
    
    socket.emit("invite-game", {
      opponent: String(recipientUsername),
      playerName: String(currentUserId)
    });
  };

  const getButtonText = () => {
    if (waitingForOpponent) return t("Waiting_for_opponent");
    if (inviteSent) return t("Invite_Sent");
    if (isInviting) return t("Sending");
    return t("Pong_Challenge");
  };

  const getButtonClass = () => {
    if (waitingForOpponent) return "text-yellow-400 cursor-not-allowed animate-pulse";
    if (inviteSent) return "text-green-400 cursor-not-allowed";
    if (isInviting) return "text-blue-400 cursor-not-allowed opacity-60";
    return "text-blue-400 hover:bg-gray-50 hover:rounded-lg";
  };

  return (
    <button
      onClick={handleSendInvite}
      disabled={isBlocked || isInviting || inviteSent || waitingForOpponent}
      className={`w-full px-4 py-2 text-left flex items-center gap-2 transition-colors duration-150 ${getButtonClass()}`}
    >
      <RiPingPongFill className={`w-5 h-5 ${(isInviting || waitingForOpponent) ? 'animate-spin' : ''}`} />
      {getButtonText()}
    </button>
  );
};

export default PongInviteButton;