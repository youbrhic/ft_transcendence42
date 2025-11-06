import { useState } from "react";
import { User } from "../../types/User";
import socket from "../../services/socket";
import { HiEllipsisVertical } from "react-icons/hi2";
import { Cancel01Icon, UserBlock02Icon } from "hugeicons-react";
import { IoBanOutline } from "react-icons/io5";
import PongInviteButton from "../../../Game/PingPong/Invite/PongInviteBtn";
import { useTranslation } from "react-i18next";

interface threedotsProps {
  user: { username: string; id: number; image_url: string; online: boolean };
  loggedInUserId: number;
  isBlocked: boolean;
  showInvBlock: boolean;
  setShowInvBlock: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInvBlockmenu: React.Dispatch<React.SetStateAction<boolean>>;
  setAllBlocked: React.Dispatch<React.SetStateAction<User[]>>;
}

const Threedots: React.FC<threedotsProps> = ({
  user,
  loggedInUserId,
  isBlocked,
  setShowInvBlock,
  setShowInvBlockmenu,
  setAllBlocked,
  showInvBlock,
}) => {
  const {t} = useTranslation();
  const handleThreeDotsInvBlock = (e: React.MouseEvent) => {
    setShowInvBlock(true);
  };

  const handleBlockClick = () => {
    setShowInvBlockmenu(true);
    setShowInvBlock(false);
  };

  const handleUnblockUser = () => {
    if (!user) return;

    socket.emit("unblock:user", {
      blockerId: loggedInUserId,
      blockedId: user.id,
    });
    setAllBlocked((prev) => prev.filter((u) => u.id !== user.id));
    setShowInvBlock(false);
  };

  return (
    <div className="flex gap-x-6">
      <button
        onClick={(e) => handleThreeDotsInvBlock(e)}
        className={`group-hover:opacity-100 transition-opacity duration-200 text-gray-500 rounded-full `}
      >
        <HiEllipsisVertical className="size-6" />
      </button>

      {showInvBlock && (
        <div className={`absolute   right-20 z-[999]`}>
          <div className="bg-[#393E46] rounded-lg shadow-lg border-1 border-gray-900 min-w-[120px]">
            {!isBlocked ? (
              <button
                onClick={handleBlockClick}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 hover:rounded-lg flex items-center gap-2 transition-colors duration-150"
              >
                <UserBlock02Icon />
                {t("block")}
              </button>
            ) : (
              <button
                onClick={handleUnblockUser}
                className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100 flex items-center gap-2"
                role="menuitem"
              >
                <IoBanOutline className="w-5 h-5" />
                {t("UnblockUser")}
              </button>
            )}
            <PongInviteButton
              recipientUsername={user.id}
              currentUserId={loggedInUserId}
            />
            <button
              onClick={() => {
                setShowInvBlock(false);
              }}
              className="w-full px-4 py-2 text-left text-white-600 hover:bg-red-50 hover:rounded-lg flex items-center gap-2 transition-colors duration-150"
            >
              <Cancel01Icon />
              {t("Close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Threedots;
