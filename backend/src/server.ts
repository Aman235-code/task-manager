import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import http from "http";
import helmet from "helmet";
import { setupSocket } from "./socket";

async function startServer() {
  await connectDB();

  const server = http.createServer(app);
  const io = setupSocket(server);

  app.use(helmet());
  app.set("io", io); // important

  server.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

startServer();
