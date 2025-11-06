import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../../store/store";
import meProfile from "../Assets/me.jpeg";
import logo from "../Assets/pp.jpeg";
import { LiaUserFriendsSolid } from "react-icons/lia";
import NavBar from "./NavBar";

import {
  BubbleChatNotificationIcon,
  Home11Icon,
  Login03Icon,
  GameController03Icon,
  Settings02Icon,
  Notification02Icon,
} from "hugeicons-react";

const Layout: React.FC = () => {
  const [showNotifs, setShowNotifs] = useState(window.outerWidth < 1024);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/")
      ? "bg-[#0077FF] rounded-full size-10 flex items-center justify-center p-2"
      : "";

  const store = useStore();

  return (
    // <div className="flex flex-col h-full">
    <div className="flex flex-col h-screen">
      {/* <NavBar /> */}

      <div className="flex flex-1 overflow-hidden max-lg:pr-0 max-lg:mr-0">
        <div className="p-1 m-4 rounded-2xl w-[80px] max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:w-full max-lg:h-[70px] max-lg:m-0 max-lg:p-0.5">
          <aside className="flex flex-col justify-between items-center h-full w-full bg-[#393E46] text-amber-50 p-4 rounded-2xl max-lg:flex-row max-lg:justify-between max-lg:items-center max-lg:h-[65px]">
            <div className="relative">
              <Link
                to="/profile"
                className={
                  location.pathname === "/profile"
                    ? " rounded-full size-10 flex items-center justify-center"
                    : ""
                }
              >
                <img
                  src={store.image_url}
                  alt="Me"
                  className="rounded-full cursor-pointer block max-lg:size-8 max-lg:mt-0 max-lg:ml-0 lg:hidden mt-2"
                />
              </Link>

              <img
                src={logo}
                alt="Logo"
                className="rounded-full cursor-pointer mt-2 hidden lg:block "
              />
            </div>

            <div className="flex flex-col justify-center items-center gap-y-10 flex-1 max-lg:flex-row max-lg:gap-x-4 max-lg:justify-center max-lg:items-center">
              <Link to="/" className={isActive("/")}>
                <Home11Icon className="size-8 max-lg:size-6 cursor-pointer" />
              </Link>

              <Link to="/game" className={isActive("/game")}>
                <GameController03Icon className="size-8 max-lg:size-6 cursor-pointer" />
              </Link>

              <Link to="/friends" className={isActive("/friends")}>
                <LiaUserFriendsSolid className="size-8 max-lg:size-6 cursor-pointer" />
              </Link>

              <Link to="/chat" className={isActive("/chat")}>
                <BubbleChatNotificationIcon className="size-8 max-lg:size-6 cursor-pointer" />
              </Link>

              <Link to="/settings/profile" className={isActive("/settings")}>
                <Settings02Icon className="size-8 max-lg:size-6 cursor-pointer" />
              </Link>

              {isMobile && (
                <Link to="/notification" className={isActive("/notification")}>
                  <Notification02Icon className="hidden max-lg:block size-8 max-lg:size-6 cursor-pointer" />
                </Link>
              )}
            </div>

            <Link
              to="/logout"
              className={
                location.pathname === "/logout"
                  ? "bg-[#0077FF] rounded-full size-10 flex items-center justify-center pt-4"
                  : "size-10 flex items-center justify-center"
              }
            >
              <Login03Icon className="size-8 max-lg:size-7 cursor-pointer mb-5 max-lg:mr-0 max-lg:mb-0" />
            </Link>
          </aside>
        </div>

        <div className="flex flex-col flex-1 min-h-0 max-lg:pb-[65px] pr-1 pl-1">
          <NavBar />
          <main className="flex-1 overflow-auto min-h-0 max-lg:mb-4 sm:mb-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
