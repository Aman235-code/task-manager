/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
// context/NotificationContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "../api/axios";
import { useAuth } from "./AuthContext";
import { socket, initializeSocket, disconnectSocket } from "../api/socket";
import type { Socket } from "socket.io-client";
import toast from "react-hot-toast";

/**
 * Represents a single notification
 */
export type Notification = {
  _id: string;
  message: string;
  read: boolean;
  taskId?: string;
  createdAt: string;
};

/**
 * Shape of the Notification context
 */
type NotificationContextType = {
  /** Current list of notifications */
  notifications: Notification[];

  /**
   * Add a notification to the list
   * @param notif Notification to add
   */
  addNotification: (notif: Notification) => void;

  /**
   * Mark a single notification as read
   * @param id Notification ID
   */
  markAsRead: (id: string) => void;

  /** Mark all notifications as read */
  markAllAsRead: () => void;

  /** Socket instance for real-time notifications */
  socket?: Socket;

  /** Setter for notifications state */
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;

  /**
   * Delete a notification
   * @param id Notification ID
   */
  deleteNotification: (id: string) => void;
};

/** Context for notifications */
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

/**
 * Provider component for notifications
 *
 * @param {object} props
 * @param {ReactNode} props.children - Components that will have access to notifications
 */
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Initialize socket connection when user logs in
   */
  useEffect(() => {
    if (!user?.id) {
      disconnectSocket();
      return;
    }

    initializeSocket(user.id);

    socket.on("connect", () => console.log("Socket connected"));
    socket.on("disconnect", () => console.log("Socket disconnected"));

    socket.on("notification", (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
      toast(notif.message, { icon: "🔔" });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("notification");
    };
  }, [user?.id]);

  /**
   * Fetch existing notifications from backend on user login
   */
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

  /** Add a notification locally */
  const addNotification = (notif: Notification) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  /** Mark a single notification as read */
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

  /** Mark all notifications as read */
  const markAllAsRead = async () => {
    try {
      await api.patch(`/api/v1/notifications/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  /** Delete a notification */
  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/api/v1/notifications/delete/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        socket,
        setNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook to access notifications context
 * @throws Will throw an error if used outside of NotificationProvider
 * @returns {NotificationContextType} Notifications context
 */
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
