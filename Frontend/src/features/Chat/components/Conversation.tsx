import React, { FC, use, useEffect, useRef, useState } from "react";
import Subtract from "../Assets/Subtract.svg";
import { Message } from "../types/Message";
import socket from "../services/socket";
import { User } from "../types/User";
import Header from "./Utils/Header";
import Threedots from "./Utils/Threedots";
import Messages from "./Utils/Messages";
import DeleteMessage from "./Utils/DeleteMessage";
import BlockUser from "./Utils/BlockUser";
import InputSend from "./Utils/InputSend";
import InputBlocked from "./Utils/InputBlocked";
import gf from "../Assets/gf4.gif";
import { useTranslation } from "react-i18next";

interface ConversationProps {
  user: { username: string; id: number; image_url: string; online: boolean };
  messages: Message[];
  history: Message[];
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onBack?: () => void;
  loggedInUserId: number;
  setShowContactList: (value: boolean) => void;

}

const Conversation: FC<ConversationProps> = ({
  user,
  messages,
  input,
  setInput,
  onSend,
  onBack,
  loggedInUserId,
  setShowContactList,
}) => {

  const isMobile = typeof window !== "undefined" && window.outerWidth < 1024;
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<string | number | null>(null);
  const [showInvBlock, setShowInvBlock] = useState<boolean>(false);
  const [showInvBlockMenu, setShowInvBlockmenu] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [messageToDelete, setMessageToDelete] = useState< string | number | null >(null);
  const [allBlocked, setAllBlocked] = useState<User[]>([]);
  const {t} = useTranslation();

  useEffect(() => {
    const allBlocked_fct = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/blockReq`,
        { credentials: "include" }
      );
      const data = await res.json();
      setAllBlocked(Array.isArray(data) ? data : []);
    };
    allBlocked_fct();
  }, []);

  let isBlocked = allBlocked.some(
    (blockedUser) => blockedUser.username === user.username
  );

  const handleBlockUser = () => {
    if (!user) return;

    socket.emit("block:user", {
      blockerId: loggedInUserId,
      blockedId: user.id,
    });

    setAllBlocked((prev) => [...prev, user as User]);
  };

  const handleThreeDotsClick = (
    messageId: string | number,
    e: React.MouseEvent
  ) => {
    setShowMenu(showMenu === messageId ? null : messageId);
  };

  const handleDeleteClick = (messageId: string | number) => {
    setMessageToDelete(messageId);
    setShowDeleteModal(true);
    setShowMenu(null);
  };

  const confirmDelete = () => {
    if (messageToDelete) {
      socket.emit("chat:delete", {
        id: messageToDelete,
        userId: loggedInUserId,
      });

      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMessageToDelete(null);
  };

  const confirmBlock = () => {
    handleBlockUser();
    setShowInvBlockmenu(false);
  };

  const cancelBlock = () => {
    setShowInvBlockmenu(false);
  };

  if (!user){
    setShowContactList(true)
  }

  return (
    <div className="flex flex-col w-full h-full  max-sm:h-[100%] rounded-2xl p-[2px] max-lg:bg-none ">
      <div
        className="flex flex-col flex-grow  rounded-xl max-lg:rounded-none p-2 overflow-hidden bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${Subtract})` }}
      >
        <div className="flex items-center justify-between p-3 m-1 bg-[#2f3542] rounded-xl max-lg:rounded-b-lg max-lg:h-20 max-lg:m-[-4px] border-b-2 border-[#2f3542]">
          <Header isMobile={isMobile} user={user} onBack={onBack} />
          <Threedots
            user={user}
            loggedInUserId={loggedInUserId}
            isBlocked={isBlocked}
            setAllBlocked={setAllBlocked}
            setShowInvBlock={setShowInvBlock}
            setShowInvBlockmenu={setShowInvBlockmenu}
            showInvBlock={showInvBlock}
          />
        </div>

        <Messages
          messages={messages}
          loggedInUserId={loggedInUserId}
          handleThreeDotsClick={handleThreeDotsClick}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          handleDeleteClick={handleDeleteClick}
        />
        <DeleteMessage
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
          showDeleteModal={showDeleteModal}
        />
        <BlockUser
          showInvBlockMenu={showInvBlockMenu}
          confirmBlock={confirmBlock}
          cancelBlock={cancelBlock}
        />

        {!isBlocked ? (
          <InputSend
            input={input}
            setInput={setInput}
            isBlocked={isBlocked}
            onSend={onSend}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
          />
        ) : (
          <InputBlocked
            input={input}
            setInput={setInput}
            onSend={onSend}
            isBlocked={isBlocked}
          />
        )}
      </div>
    </div>
  );
};

export default Conversation;