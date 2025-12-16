import { Server } from "socket.io";

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;

    if (userId) {
      socket.join(userId); // room = userId
      console.log("User connected:", userId);
    }

    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });
  });

  return io;
}
