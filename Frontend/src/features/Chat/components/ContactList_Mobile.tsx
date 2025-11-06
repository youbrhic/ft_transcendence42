import React, { FC } from "react";
import { Search } from "lucide-react";
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

interface ContactListMobileProps {
  users: User[];
  messages: Messages;
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  unreadCounts: Record<number, number>;
}

const ContactList_Mobile: FC<ContactListMobileProps> = ({
  users,
  messages,
  selectedUser,
  setSelectedUser,
  searchTerm,
  setSearchTerm,
  unreadCounts,
}) => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-[100%]  bg-[#222831] flex flex-col p-2">
      <div className="sticky bg-[#222831] pb-3 pt-2 px-2 border-b w-[100%] border-gray-700">
        <div className="flex items-center bg-[#393E46] rounded-full px-4 h-12 shadow-md">
          <Search className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            placeholder={t("search_connv")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-white placeholder-gray-500 outline-none w-full text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll">
        {users.length === 0 ? (
          <p className="text-white mt-4">{t("no_contact_found")}</p>
        ) : (
          users.map((user) => {
            const userMessages = messages[user.id] || [];
            const lastMessage = userMessages[userMessages.length - 1];
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
                key={user.id}
                onClick={() => setSelectedUser(user)}
                // className=" flex justify-between rounded-xl p-4 h-16 my-2 cursor-pointer" >
                className={`relative flex items-center justify-between rounded-xl p-4 h-16 my-2 cursor-pointer transition-all duration-100 
                ${
                  isSelected
                    ? "bg-[#2f3542] border-l-4  border-[#0077FF]"
                    : "bg-[#222831] hover:bg-[#2f3542]"
                }
                `}
              >
                <div className="flex items-center gap-x-3 ">
                  <img
                    src={user.image_url}
                    className="w-12 h-12 rounded-full border-2 border-gray-600"
                    alt={`${user.username}'s profile`}
                  />
                  <div className="flex flex-col overflow-hidden">
                    <strong className="text-white text-base font-semibold truncate max-w-40">
                      {user.username}
                    </strong>
                    <span className="text-sm text-gray-400 truncate max-w-40 mt-1">
                      {/* {lastMessage?.text || "No messages yet."} */}
                      {lastMessage?.text}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-5 ">
                  {lastTime && (
                    <span className="text-xs text-gray-500 font-medium">
                      {lastTime}
                    </span>
                  )}
                  {unreadCount > 0 && (
                    <span className="size-4 bg-[#0077FF] rounded-full text-center text-xs ring-white ">
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
  );
};

export default ContactList_Mobile;
