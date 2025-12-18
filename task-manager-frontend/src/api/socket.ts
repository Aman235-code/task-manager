import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000";

// Connect to backend Socket.io server
export const socket: Socket = io(SOCKET_URL, {
  withCredentials: true, // send cookies for auth
  autoConnect: false, // don't connect automatically
});

/**
 * Initializes the socket connection with the user ID.
 * @param userId - The ID of the authenticated user
 */
export const initializeSocket = (userId: string) => {
  socket.auth = { userId };
  socket.connect();
};

/**
 * Disconnects the socket.
 */
export const disconnectSocket = () => {
  socket.disconnect();
};
