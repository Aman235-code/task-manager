import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database.
 *
 * This function reads the connection URI from the environment
 * variable `MONGO_URI`. If the connection fails, the process
 * will exit with code 1 to allow orchestration tools
 * (Docker, PM2, Kubernetes) to restart the service.
 *
 * @throws Will terminate the process if unable to connect to MongoDB
 */
export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}
