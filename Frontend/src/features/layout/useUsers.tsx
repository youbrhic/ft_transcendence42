import { useEffect, useRef, useState } from "react";
import socket from "../Chat/services/socket";
import { User } from "../Chat/types/User";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState("");
  const usersRef = useRef<User[]>([]);
  const currentUserRef = useRef("");

  useEffect(() => {
    socket.emit("request:init");
    socket.emit("get-my-profile");

    socket.on("user:list", (backendUsers: User[]) => {
      setUsers(backendUsers);
      usersRef.current = backendUsers;
    });
    socket.on( "profile-data", (socketData: { username: string; id: number; online: boolean }) => {
        currentUserRef.current = socketData.id.toString();
        setCurrentUser(socketData.username);
        socket.emit("profile-data", socketData);
      }
    );

    return () => {
      socket.off("user:list");
      socket.off("profile-data");
    };
  }, []);

  return { users, currentUser, usersRef, currentUserRef };
};

export default useUsers;
