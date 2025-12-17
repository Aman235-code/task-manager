import http from "http";
import helmet from "helmet";

import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { setupSocket } from "./socket";

/**
 * Boots the application server.
 *
 * Responsibilities:
 * - Establish database connection
 * - Apply global security middleware
 * - Create HTTP server
 * - Attach Socket.IO for real-time communication
 * - Start listening on the configured port
 *
 * This function is intentionally isolated to ensure
 * predictable startup sequencing and easier testing.
 */
async function startServer() {
  /**
   * Ensure database connection is established
   * before accepting any incoming requests.
   */
  await connectDB();

  /**
   * Apply security-related HTTP headers early
   * so they affect all incoming requests.
   */
  app.use(helmet());

  /**
   * Create a raw HTTP server so it can be shared
   * between Express and Socket.IO.
   */
  const server = http.createServer(app);

  /**
   * Initialize Socket.IO and bind it to the HTTP server.
   *
   * The returned instance is stored on the Express app
   * to allow emitting real-time events from controllers,
   * services, or background jobs.
   */
  const io = setupSocket(server);
  app.set("io", io);

  /**
   * Start listening for incoming connections.
   *
   * Logging avoids hardcoded localhost URLs to keep
   * output environment-agnostic for production.
   */
  server.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

/**
 * Trigger application startup.
 *
 * Any unhandled error here should crash the process
   so orchestration tools (PM2, Docker, Kubernetes)
 * can restart the service cleanly.
 */
startServer();
