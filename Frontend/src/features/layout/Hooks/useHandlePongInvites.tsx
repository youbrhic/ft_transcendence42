import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../Chat/services/socket";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface UseHandlePongInvitesProps {
  navigate: ReturnType<typeof useNavigate>;
  currentUserRef: { current: string | number | null };
}

const useHandlePongInvites = ({ navigate, currentUserRef }: UseHandlePongInvitesProps) => {
  const {t} = useTranslation();

  useEffect(() => {
    const handlePongInvite = (notification: any) => {
      if (!currentUserRef.current) return;

      socket.emit("get-my-profile");
      socket.once("profile-data", (user: any) => {
        if (user?.id !== notification.recipientId) return;

        const [roomId, senderName] = notification.text.split(":");

        toast.custom((toastId) => (
          <div
            className={`${
              toastId.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-[#393E46] shadow-lg rounded-xl p-4`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
            🏓
          </div>
              </div>
              <div className="flex-1">
          <p className="font-medium text-white">{t("Pong_Challenge")}</p>
          <p className="text-sm text-gray-300">{senderName} {t("wants_to_play")}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
          onClick={() => {
            socket.emit("accept-invite", { roomId, playerName: String(user.id) });
            navigate(`/game/ping-pong/invite/${roomId}`);
            toast.success(`${t("Accepted")} ${senderName}${t("s_Pong_challenge")}`);
            toast.dismiss(toastId.id);
          }}
          className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
              >
          {t("Accept")}
              </button>
              <button
          onClick={() => {
            toast.error(`${t("Declined")} ${senderName}${t("s_Pong_challenge")}`);
            toast.dismiss(toastId.id);
            socket.emit("refuse-invite", { roomId, playerName: user.id });
          }}
          className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
              >
          {t("Decline")}
              </button>
            </div>
          </div>
        ));
      });
    };

    const handleTournamentNotif = (notif:any) => {

      toast.success(`${t("The_following_tournament_is_about_to_start")} ` + notif?.notif?.name);
    }

    socket.on("pong-invite-notification", handlePongInvite);
    socket.once("tournament-notification", handleTournamentNotif);

    return () => {
      socket.off("pong-invite-notification", handlePongInvite);
      socket.off("tournament-notification", handleTournamentNotif);
    };
  }, [navigate, currentUserRef]);
};

export default useHandlePongInvites;
