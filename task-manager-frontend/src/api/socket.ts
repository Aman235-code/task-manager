import { io } from "socket.io-client";

// Connect to backend Socket.io server
export const socket = io(import.meta.env.VITE_API_BASE || "http://localhost:4000", {
  withCredentials: true, // send cookies for auth
});
