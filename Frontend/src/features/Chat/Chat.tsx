import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChatSocket } from "./hooks/useChatSocket";
import { useResponsive } from "./hooks/useResponsive";
import ChatLayout from "./components/ChatLayout";
import type { User } from "./types/User";

const ChatApp: FC = () => {
  const {
    socket,
    users,
    messages,
    currentUser,
    unreadCounts,
    setUnreadCounts,
    currentUserRef,
  } = useChatSocket();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactList, setShowContactList] = useState(
    window.outerWidth < 1024
  );
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const isMobile = useResponsive();

  
  useEffect(() => {
    if (!username) return;
    const targetUser = users.find((u) => u.username === username);
    if (targetUser) {
      setSelectedUser(targetUser);
      setUnreadCounts((prev) => ({ ...prev, [targetUser.id]: 0 }));
      if (isMobile) setShowContactList(false);
    }
  }, [username, users]);

  const handleSend = () => {
    if (!selectedUser?.id || !currentUserRef.current) return;
    const text = inputs[selectedUser.id] || "";
    if (!text.trim()) return;

    socket.emit("chat:message", {
      senderId: currentUser?.id,
      recipientId: selectedUser?.id,
      text,
    });
    setInputs((prev) => ({ ...prev, [selectedUser.id]: "" }));
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    navigate(`/chat/${user.username}`);
    if (isMobile) setShowContactList(false);
    setUnreadCounts((prev) => ({ ...prev, [user.id]: 0 }));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      u.id !== currentUserRef.current
  );

  return (
    <div className="flex flex-row h-full w-full gap-4 overflow-hidden bg-[#121418] rounded-lg max-lg:p-0">
      <ChatLayout
        isMobile={isMobile}
        showContactList={showContactList}
        setShowContactList={setShowContactList}
        users={users}
        filteredUsers={filteredUsers}
        selectedUser={selectedUser}
        handleUserSelect={handleUserSelect}
        messages={messages}
        unreadCounts={unreadCounts}
        input={selectedUser?.id ? inputs[selectedUser.id] || "" : ""}
        setInput={(v) =>
          selectedUser?.id &&
          setInputs((prev) => ({ ...prev, [selectedUser.id]: v }))
        }
        onSend={handleSend}
        loggedInUserId={currentUserRef.current}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default ChatApp;
