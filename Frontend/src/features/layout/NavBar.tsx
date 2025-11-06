import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Notification02Icon } from "hugeicons-react";
import { useStore } from "../../store/store";
import HandleSearch from "./HandleSearch";
import { useUsers } from "./useUsers";
import { User } from "../Chat/types/User";
import socket from "../Chat/services/socket";
import { useLocation, useNavigate } from "react-router-dom";
import HandleNotifs from "./Componant/HandleNotifs";
import useHandleNotifications from "./Hooks/useHandleNotifications";
import useHandlePongInvites from "./Hooks/useHandlePongInvites";
import Profile from "./Componant/Profile";
import { useTranslation } from "react-i18next";;

const NavBar: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<User[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showProfileDropdown, setShowProfileDropdown] =useState<boolean>(false);
  const {t} = useTranslation();
  const store = useStore();
  const { users, currentUserRef } = useUsers();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 1024;

  useEffect ( () => {
    if (!socket.connected)
      socket.connect();
  }, [])

  //  hooks for socket events
  useHandleNotifications({ setNotifications, setUnreadCount, currentUserRef });
  useHandlePongInvites({ navigate, currentUserRef });

  // click outside search & notifications
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
        setQuery("");
      }
      
      if (notifRef.current && !notifRef.current.contains(e.target as Node)){
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // filter users based on search query
  useEffect(() => {
    if (!query.trim()) return setResult([]);
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query.toLowerCase()) &&
        user.username !== currentUserRef.current
    );
    setResult(filtered);
  }, [query, users, currentUserRef]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Clear notifications
  const clearNotifs = () => {
    if (!currentUserRef.current) return;
    socket.emit("notification:clear", Number(currentUserRef.current));
    setNotifications([]);
    setUnreadCount(0);
  };

  const inChat = (location.pathname === "/chat" ||
      /^\/chat\/[^/]+$/.test(location.pathname)) &&
    isMobile;
    const notifIsseen = () => {
      socket.emit("notif:seen", notifications)
    }
  return (
    <>
      {!inChat && (
        <nav className="flex items-center justify-between text-white w-full h-14 px-4 mt-5 mb-4">
          <div className="w-1/3 max-lg:w-1" />

          <div
            className="relative flex justify-center w-1/3 m-3 mt-6 mb-6 max-lg:w-full"
            ref={searchRef}
          >
            <div className="relative flex items-center bg-[#393E46] px-3 py-3 rounded-2xl w-full max-w-auto">
              <Search className="w-5 h-5 text-amber-50 mr-3" />
              <input
                type="text"
                value={query}
                placeholder={t("search")}
                className="flex-grow bg-transparent text-white placeholder-blue-200 outline-none h-7 max-sm:w-full"
                onFocus={() => setShowSearch(true)}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <HandleSearch showSearch={showSearch} setShowSearch={setShowSearch} result={result} />
          </div>

          <div className="relative flex items-center gap-6 w-1/3 justify-end max-lg:hidden">
            <div className="relative">
              <Notification02Icon
                className="size-8 hover:text-blue-700 cursor-pointer max-sm:hidden"
                onClick={() => {
                  setShowNotifs(true);
                  notifIsseen()
                  setUnreadCount(0);
                }}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="relative font-russo">
              <img
                src={store.image_url}
                alt="Profile"
                className="size-12 rounded-full hover:ring-2 cursor-pointer max-sm:hidden transition"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              />
              {showProfileDropdown && (
                <Profile setShowProfileDropdown={setShowProfileDropdown} />
              )}
            </div>
          </div>

          {showNotifs && (
            <HandleNotifs
              showNotifs={showNotifs}
              setShowNotifs={setShowNotifs}
              notifications={notifications}
              notifRef={notifRef}
              clearNotifs={clearNotifs}
            />
          )}
        </nav>
      )}
    </>
  );
};

export default NavBar;
