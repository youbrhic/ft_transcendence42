import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";;
import { Shield, Users, Send, UserPlus} from "lucide-react";
import socket from "../Chat/services/socket";
import FriendList from "./Componant/FriendList"

const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState< "all" | "sent" | "request" | "blocked" >("all");
  const {t} = useTranslation();

  const tabs = [
    { key: "all", label: t("all"), icon: <Users size={15} /> },
    { key: "sent", label: t("sent"), icon: <Send size={15} /> },
    { key: "request", label: t("request"), icon: <UserPlus size={15} /> },
    { key: "blocked", label: t("blocked"), icon: <Shield size={15} /> },
  ] as const;

  useEffect(() => {
    // socket.disconnect()
    socket.connect();
  }, []);

  return (
    <div className=" m-auto pt-10 flex justify-center">
      <div className="mx-auto h-full w-full 2xl:w-[70%] xl:w-[60%] lg:w-[80%] md:w-[90%] flex flex-col rounded-2xl p-2 bg-[#393E46]">
        <div className="sticky top-0 z-30 h-12 flex flex-row justify-center gap-4 items-center bg-[#393E46]">
          {tabs.map(({ key, label, icon }) => (
            <div
              key={key}
              onClick={() => setActiveTab(key)}
              className={`${
                activeTab === key
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                  : "text-white hover:text-blue-600"
              } cursor-pointer font-russo text-sm flex items-center gap-1`}
            >
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </div>
        <FriendList status={activeTab} />
      </div>
    </div>
  );
};

export default Friends;
