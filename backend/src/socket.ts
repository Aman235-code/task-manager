import { Server } from "socket.io";

/**
 * Initializes and configures the Socket.IO server.
 *
 * This function attaches a Socket.IO instance to an existing HTTP server
 * and sets up connection lifecycle handling.
 *
 * Each connected client is automatically joined to a room identified
 * by their userId. This allows emitting events to a specific user
 * across multiple devices or tabs.
 *
 * @param server - The HTTP or HTTPS server instance used by Express
 * @returns The initialized Socket.IO server instance
 */
export function setupSocket(server) {
  /**
   * Socket.IO server instance with CORS enabled
   * to support authenticated cross-origin requests.
   */
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  /**
   * Fired whenever a new client establishes a WebSocket connection.
   */
  io.on("connection", (socket) => {
    /**
     * The authenticated user ID sent from the client during the handshake.
     * This should be injected on the frontend when initializing the socket.
     */
    const userId = socket.handshake.auth.userId;

    /**
     * If a valid userId is present, associate this socket
     * with a room named after the userId.
     *
     * This enables targeted real-time events like:
     * - task assigned
     * - task updated
     * - notifications
     */
    if (userId) {
      socket.join(userId);
      console.log("User connected:", userId);
    }

    /**
     * Fired when the client disconnects due to tab close,
     * network loss, or explicit socket termination.
     */
    socket.on("disconnect", () => {
      console.log("User disconnected:", userId);
    });
  });

  return io;
}
