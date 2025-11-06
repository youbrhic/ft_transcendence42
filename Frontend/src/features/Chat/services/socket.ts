import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL_SOCKET, {       
  path: "/socket.io/",
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export function joinGame(name: string) {
  console.log("here", name);
  socket.emit("join", name);
}

export function sendInput(keys: Record<string, boolean>) {
  socket.emit("input", keys);
}

export function sendScale(scale: number) {
  socket.emit("scale", scale);
}


export function onState(cb: (state: any) => void) {
  socket.on("state", cb);
}

export function onReady(cb: () => void) {
  socket.on("ready", cb);
}

export default socket;
