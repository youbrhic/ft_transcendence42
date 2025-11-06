
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";import OnlineStatusIcon from "../../Chat/components/Utils/OnlineStatusIcon";
import { Clock, MessageCircle, Shield, UserCheck, UserX, X } from "lucide-react";
;
interface FriendCardProps {
    blockedUserIds?: Map<number, string>,
    name: string;
    id: number;
    status: "sent" | "request" | "blocked" | "all";
    isOnline: boolean;
    image_url: string;
    onAccept?: (username: string) => void;
    onReject?: (username: string) => void;
    onCancel?: (username: string) => void;
    unblockUser?: (username: string) => void;
  }
  
  const FriendCard: React.FC<FriendCardProps> = ({
    blockedUserIds,
    name,
    id,
    status,
    image_url,
    isOnline,
    onAccept,
    onReject,
    onCancel,
    unblockUser,
  }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    let isBlocked: boolean = false;
    blockedUserIds?.forEach((value, key) => {
      if (id === key){
        isBlocked = true;
      }
    });
    
    return (
      (!isBlocked && (
        <div className="flex items-center p-3 xs:p-4 bg-[#222831] m-2 h-16 rounded-3xl border border-[#393E46]/50 hover:border-[#0077FF]/50 transition-all duration-300 justify-between">
        {(status === "all") ? (
          <div className="flex items-center gap-2 xs:gap-4 flex-shrink min-w-0">
            <img
              src={image_url}
              className="size-12 rounded-full border-2 border-white flex-shrink-0"
              alt="profile"
            />
            <div className="flex flex-col h-12 min-w-0">
              <strong className="text-white text-lg font-bold truncate">
                {name}
              </strong>
              <span className="text-gray-400 text-sm flex items-center gap-x-2">
                <OnlineStatusIcon isOnline={isOnline} />
                {isOnline ? t("online") : t("offline")}
              </span>
            </div>
          </div>
        ) : (
           <div className="flex items-center gap-2 flex-shrink min-w-0">
            <img
              src={image_url}
              className="size-8 xs:size-10 sm:size-12 rounded-full border-2 border-white flex-shrink-0"
              alt="profile"
            />
            <p className="font-russo text-white truncate max-w-[200px] leading-tight p-2">
              {name}
            </p>
          </div> 
          
        )}
  
        <div className="flex items-center justify-end gap-2">
          {status === "sent" && (
            <>
              <button className="bg-[#0077FF] text-white p-2 rounded-full text-xs font-semibold flex items-center gap-2">
                <Clock size={20} /> {t("sent")}
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded-full text-xs font-semibold flex items-center gap-2"
                onClick={() => onCancel?.(name)}
              >
                <X size={20} /> {t("cancel")}
              </button>
            </>
          )}
  
          {status === "request" && (
            <>
              <button
                className="bg-[#0077FF] text-white p-2 rounded-full text-xs font-semibold flex items-center gap-2"
                onClick={() => onAccept?.(name)}
              >
                <UserCheck size={20} /> {t("accept")}
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded-full text-xs font-semibold flex items-center gap-2"
                onClick={() => onReject?.(name)}
              >
                <UserX size={20} /> {t("reject")}
              </button>
            </>
          )}
  
          {status === "blocked" && (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-full text-sm font-semibold flex items-center gap-3"
              onClick={() => unblockUser?.(name)}
            >
              <Shield size={20} /> {t("unblock")}
            </button>
          )}
  
          {(status === "all" && !isBlocked) && (
            <button
              className="bg-[#0077FF] text-white py-2 px-4 rounded-full text-sm font-semibold flex items-center gap-2"
              onClick={() => navigate(`/chat/${name}`)}
            >
              <MessageCircle size={16} /> {t("chat")}
            </button>
          )}
        </div>
      </div>
      ))

    );
  };

export default FriendCard;
  