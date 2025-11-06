import React, { FC } from "react";
import { Search } from "lucide-react";
import meProfile from "../Assets/me.jpeg";
import { User } from "../types/User";
import { useTranslation } from "react-i18next";

interface Message {
  id: string | number;
  sender: string;
  username: string;
  text: string;
  timestamp: string;
}

interface Messages {
  [key: string]: Message[];
}

interface ContactListProps {
  users: User[];
  messages: Messages;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  unreadCounts: Record<number, number>;
}

const ContactList: FC<ContactListProps> = ({
  users,
  messages,
  selectedUser,
  setSelectedUser,
  searchTerm,
  setSearchTerm,
  unreadCounts,
}) => {
  const { t } = useTranslation();

  const sortedUsers = [...users].sort((a, b) => {
    const lastA = messages[a.id]?.[messages[a.id].length - 1];
    const lastB = messages[b.id]?.[messages[b.id].length - 1];

    const timeA = lastA ? new Date(lastA.timestamp).getTime() : 0;
    const timeB = lastB ? new Date(lastB.timestamp).getTime() : 0;

    return timeB - timeA;
  });

  return (
    <div className="p-2 rounded-2xl w-[40%] h-full">
      <div className="h-full w-full bg-[#222831] rounded-xl custom-scroll overflow-y-auto">
        <div className="w-full">

          <div className="sticky top-0 z-10 bg-[#222831] px-14  pt-4 pb-4 border-b border-gray-700">
            <div className="flex items-center bg-[#393E46] rounded-full px-4 h-12 shadow-md">
              <Search className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                placeholder={t("search_conv")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-white placeholder-gray-500 outline-none w-full text-sm"
              />
            </div>
          </div>

          <div className="p-4">
            {users.length === 0 ? (
              <p className="text-gray-400 mt-4 text-center">
                {t("no_contact_found")}
              </p>
            ) : (
              sortedUsers.map((user, index) => {
                const userMessages = messages[user.id] || [];
                const lastMessage = userMessages[userMessages.length - 1];
                const hasUnread = unreadCounts[user.id];
                const lastTime = lastMessage
                  ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                const isSelected = selectedUser?.id === user.id;
                const unreadCount = unreadCounts[user.id] || 0;

                return (
                  <div
                    key={
                      user.id ? `${user.id}-${user.username}` : `user-${index}`
                    }
                    onClick={() => setSelectedUser(user)}
                    className={`relative flex items-center justify-between rounded-xl p-4 h-16 my-2 cursor-pointer transition-all duration-100 ${
                      isSelected
                        ? "bg-[#2f3542] border-l-4  border-[#0077FF]"
                        : "bg-[#222831] hover:bg-[#2f3542]"
                    }`}
                  >
                    <div className="flex items-center gap-x-4">
                      <img
                        src={user.image_url}
                        className="size-14 rounded-full object-cover border-2 border-gray-600"
                        alt="profile"
                      />
                      <div className="flex flex-col overflow-hidden">
                        <strong className="text-white text-base font-semibold truncate max-w-60">
                          {user.username}
                        </strong>
                        <span className="text-sm text-gray-400 truncate max-w-60 mt-1">
                          {lastMessage?.text}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-5">
                      {lastTime && (
                        <span className="text-xs text-gray-500 font-medium">
                          {lastTime}
                        </span>
                      )}
                      {unreadCount > 0 && (
                        <span className="size-4 bg-[#0077FF] rounded-full text-center text-xs ring-white">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
