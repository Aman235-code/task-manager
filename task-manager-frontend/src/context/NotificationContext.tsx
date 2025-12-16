// context/NotificationContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "../api/axios";
import { useAuth } from "./AuthContext";
import { io, Socket } from "socket.io-client";

export type Notification = {
  _id: string;
  message: string;
  read: boolean;
  taskId?: string;
  createdAt: string;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notif: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  socket?: Socket;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  // Initialize socket when user logs in
  useEffect(() => {
    if (!user?.id) return;

    const socketClient = io("http://localhost:4000", {
      auth: { userId: user.id },
    });

    socketClient.on("connect", () => console.log("Socket connected"));
    socketClient.on("disconnect", () => console.log("Socket disconnected"));

    socketClient.on("notification", (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
    };
  }, [user?.id]);

  // Fetch existing notifications from backend
  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/api/v1/notifications");
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const addNotification = (notif: Notification) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/api/v1/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch(`/api/v1/notifications/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        socket,
        setNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
