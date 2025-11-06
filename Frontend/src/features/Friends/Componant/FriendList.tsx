import { useEffect, useState } from "react";
import { User } from "../../Chat/types/User";
import { useTranslation } from "react-i18next";import socket from "../../Chat/services/socket";
import { Search } from "lucide-react";
import FriendCard from "./FriendCard"

interface FriendCardProps {
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
  
const FriendList: React.FC<{ status: FriendCardProps["status"] }> = ({status,}) => {
    const [friends, setFriends] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [allreqs, setAllreqs] = useState<User[]>([]);
    const [allBlocked, setAllBlocked] = useState<User[]>([]);
    const [dataUpdate, setDataUpdate] = useState<boolean>(false);
    const {t} = useTranslation();
  
    useEffect(() => {
      socket.on("user:status",({ id, online }: { id: number; online: boolean }) => {
  
          setAllUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, online } : u))
          );
        }
      );
  
      return () => {
        socket.off("user:status");
      };
    }, []);
  
    useEffect(() => {
      const fetchRequest = async () => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/friends/allsendreq`,
          { credentials: "include" }
        );
        const data = await res.json();
        setFriends(Array.isArray(data) ? data : []);
      };
  
      const myAllfriends = async () => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/friends/allfriends`,
          { credentials: "include" }
        );
        const data = await res.json();
        setAllUsers(data);
      };
  
      const allRecvReq = async () => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/friends/allrecvreq`,
          { credentials: "include" }
        );
        const data = await res.json();
        setAllreqs(Array.isArray(data) ? data : []);
      };
  
      const allBlocked = async () => {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/friends/blockReq`,
          { credentials: "include" }
        );
        const data = await res.json();
        console.log("all blocked : ", data);
        setAllBlocked(Array.isArray(data) ? data : []);
      };
  
      if (status === "sent")
        fetchRequest();
      if (status === "all")
        myAllfriends();
      if (status === "request")
        allRecvReq();
      // if (status === "blocked")
        allBlocked();
    }, [status, dataUpdate]);
  
    const handleAccept = async (username: string) => {
      await fetch(`${import.meta.env.VITE_API_URL}/api/friends/acceptrequest`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frined_username: username }),
        credentials: "include",
      });
  
      setAllreqs((prev) => prev.filter((u) => u.username !== username));
      setDataUpdate(true);
    };
  
    const handleReject = async (username: string) => {
      await fetch(`${import.meta.env.VITE_API_URL}/api/friends/deletereq`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frined_username: username, type: "receiv" }),
        credentials: "include",
      });
  
      setAllreqs((prev) => prev.filter((u) => u.username !== username));
      setDataUpdate(true);
    };
  
    const handleCancel = async (username: string) => {
      await fetch(`${import.meta.env.VITE_API_URL}/api/friends/deletereq`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frined_username: username, type: "send" }),
        credentials: "include",
      });
  
      setFriends((prev) => prev.filter((u) => u.username !== username));
      setDataUpdate(true);
    };
  
    const unblockUser = async (username: string) => {
      console.log(" in unblock !!!");
      await fetch(`${import.meta.env.VITE_API_URL}/api/friends/unblockUser`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frined_username: username, type: "send" }),
        credentials: "include",
      });
      setDataUpdate(true);
    };

    const blockedUserIds = new Map<number, string>();
    allUsers.forEach(users => {
      allBlocked.forEach(blocked => {
        if (users.id === blocked.id){
          console.log(users.username, blocked.username)
          blockedUserIds.set(users.id, users.username)
        }
      });
    });

    return (
      <div className="flex flex-col font-russo text-base sm:text-lg ">
        <div className="sticky top-12 z-20 px-14 pt-4 pb-4 bg-[#393E46]">
          <div className="flex items-center bg-[#222831] rounded-full px-4 h-12 shadow-md">
            <Search className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              placeholder={t("search_friends_by_username")}
              className="bg-transparent text-white placeholder-gray-500 outline-none w-full text-sm"
            />
          </div>
        </div>
  
        <div className="flex flex-col ">
          {status === "sent" && friends.length > 0 ? (
            friends.map((user) => (
              <FriendCard
                key={user.username}
                name={user.username}
                id={user.id}
                image_url={user.image_url}
                isOnline={user.online}
                status="sent"
                onCancel={handleCancel}
              />
            ))
          ) : status === "all" && allUsers.length > 0 ? (
            allUsers.map((user) => (
              <FriendCard
                blockedUserIds={blockedUserIds}
                key={user.username}
                name={user.username}
                id={user.id}
                image_url={user.image_url}
                isOnline={user.online}
                status="all"
              />
            ))
          ) : // <></>
  
          status === "request" && allreqs.length > 0 ? (
            allreqs.map((user) => (
              <FriendCard
                key={user.username}
                name={user.username}
                id={user.id}
                image_url={user.image_url}
                isOnline={user.online}
                status="request"
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))
          ) : status === "blocked" && allBlocked.length > 0 ? (
            allBlocked.map((user) => (
              <FriendCard
                key={user.username}
                name={user.username}
                id={user.id}
                image_url={user.image_url}
                isOnline={user.online}
                status="blocked"
                unblockUser={unblockUser}
              />
            ))
          ) : (
            <p className="text-gray-400 text-center">{t("no_user_found")}</p>
          )}
        </div>
      </div>
    );
  };

export default FriendList;