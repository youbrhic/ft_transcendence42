import React, { useEffect, useState } from "react";
import { useUsers } from "../layout/useUsers";
import socket from "../Chat/services/socket";
import { Navigate, useNavigate } from "react-router";
import HandleNotifs from "./Componant/HandleNotifs";

const Notification: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { currentUserRef } = useUsers();
  const [showNotifs, setShowNotifs] = useState(window.innerWidth < 1024);
  const [locked, setLocked] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    let timeout: any;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const isSmallScreen = window.innerWidth < 1024;
        setShowNotifs(isSmallScreen);
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
    
  }, []);

  useEffect(() => {
    if (!showNotifs && !locked) {
      nav("/");
    }
  }, [showNotifs, locked, nav]);

  const handleNotifClick = () => {
    setLocked(true);
  };

  useEffect(() => {
    if (!socket.connect()) socket.connect();
  }, []);

  useEffect(() => {
    if (currentUserRef.current) {
      socket.emit("notification:get", Number(currentUserRef.current));
    }
  }, [currentUserRef.current]);

  useEffect(() => {
    const handleNotification = (notif: any) => {
      setNotifications((prev) => [notif.messageData || notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleNotificationList = (data: any[]) => {
      setNotifications(data);
      setUnreadCount(0);
    };

    if (currentUserRef.current) {
      socket.emit("notification:get", Number(currentUserRef.current));
    }

    socket.on("notification", handleNotification);
    socket.on("notification:list", handleNotificationList);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("notification:list", handleNotificationList);
    };
  }, [currentUserRef.current]);

  const clearNotifs = () => {
    const currentUserId = Number(currentUserRef.current);
    socket.emit("notification:clear", currentUserId);
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div
      className="w-ful bg-[#222831]"
      onClick={handleNotifClick}
    >
      {showNotifs ? (
        <HandleNotifs notifications={notifications} clearNotifs={clearNotifs} />
      ) : (
        <div className="flex items-center justify-center text-white h-full">
          Redirecting...
        </div>
      )}
    </div>
  );
};

export default Notification;
