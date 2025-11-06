import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import socket from "../Chat/services/socket";

const Game: React.FC = () => {
  useEffect(() => {
    if (!socket.connect()) {
      socket.connect();
    }
  });

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <Outlet />
    </div>
  );
};

export default Game;
