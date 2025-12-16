// socket.ts
import { Server } from "socket.io";

export function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    if (userId) {
      socket.join(userId); // each user has a room
    }

    console.log("User connected:", userId);

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });
  });

  return io;
}
