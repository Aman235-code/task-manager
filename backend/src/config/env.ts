import dotenv from "dotenv";

/**
 * Load environment variables from a .env file into process.env.
 * This should be called at the very start of the application
 * to ensure all subsequent modules can access environment values.
 */
dotenv.config();

/**
 * Application configuration loaded from environment variables.
 *
 * @property PORT - The port the server will listen on (default: 4000)
 * @property NODE_ENV - Node environment, e.g., "development", "production"
 * @property MONGO_URI - MongoDB connection string
 */
export const env = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
};
