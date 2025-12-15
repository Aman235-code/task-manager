import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { Server } from "socket.io";
import http from "http";

async function startServer() {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true
    }
  });

   io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // Make io accessible in controllers/services
  app.set("io", io);

 server.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

startServer();
