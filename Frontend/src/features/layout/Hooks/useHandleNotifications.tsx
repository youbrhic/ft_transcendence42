
import { useEffect } from "react";
import socket from "../../Chat/services/socket";
import { toast } from "react-hot-toast";

interface UseHandleNotificationsProps {
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  currentUserRef: { current: string | number | null };
}

const useHandleNotifications = ({
  setNotifications,
  setUnreadCount,
  currentUserRef,
}: UseHandleNotificationsProps) => {

  useEffect(() => {
    if (!currentUserRef.current) return;

    const interval = setInterval(() => {
      socket.emit("notification:count", Number(currentUserRef.current));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUserRef.current]);

  // Connect and re-fetch on reconnect
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleReconnect = () => {
      if (currentUserRef.current) {
        socket.emit("notification:get", Number(currentUserRef.current));
        socket.emit("notification:count", Number(currentUserRef.current));
      }
    };

    socket.on("connect", handleReconnect);
    return () => {
      socket.off("connect", handleReconnect);
    };
  }, [currentUserRef]);

  // Initial fetch when user ID changes
  useEffect(() => {
    if (currentUserRef.current) {
      socket.emit("notification:get", Number(currentUserRef.current));
      socket.emit("notification:count", Number(currentUserRef.current));
    }
  }, [currentUserRef.current]);

  // Listen for new notifications and notification lists
  useEffect(() => {
    const handleNotification = (notif: any) => {
      if (notif.temporary && notif.type === "pong_invite") {
        toast.custom((t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-[#393E46] shadow-lg rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 p-4`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  🏓
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Pong Challenge!</p>
                <p className="text-sm text-gray-300">
                  {notif.sender} wants to play
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
              >
                Accept
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
              >
                Decline
              </button>
            </div>
          </div>
        ));
      } else {
        setNotifications((prev) => [notif.messageData || notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    };

    const handleNotificationList = (data: any[]) => {
      setNotifications(data);
      setUnreadCount(0);
    };

    const handleNotificationCount = (count: number) => {
      setUnreadCount(count);
    };

    if (currentUserRef.current) {
      socket.emit("notification:get", Number(currentUserRef.current));
      socket.emit("notification:count", Number(currentUserRef.current));
    }

    socket.on("notification", handleNotification);
    socket.on("notification:list", handleNotificationList);
    socket.on("notification:getcount", handleNotificationCount);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("notification:list", handleNotificationList);
      socket.off("notification:getcount", handleNotificationCount);
    };
  }, [currentUserRef.current]);
};

export default useHandleNotifications;
