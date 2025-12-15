import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

async function startServer() {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

startServer();
