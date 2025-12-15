import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import taskRoutes from "./modules/tasks/task.routes";


export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.get("/", (_req, res) => {
  res.send("Server is running");
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

