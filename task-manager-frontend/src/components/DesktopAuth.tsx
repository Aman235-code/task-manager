import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiBell,
  FiCheck,
  FiLogIn,
  FiLogOut,
  FiTrash2,
} from "react-icons/fi";
import { useNotifications } from "../context/NotificationContext";
import { api } from "../api/axios";

const DesktopAuth = ({ user, logout }: { user: any; logout: () => void }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { notifications, markAsRead, setNotifications } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch("/api/v1/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="hidden md:flex items-center gap-4 relative" ref={notifRef}>
      {user && (
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative">
            <FiBell size={20} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-gray-900 shadow-2xl ring-1 ring-white/10 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-sm font-semibold text-gray-100">
                  Notifications
                </span>

                {notifications.some((n) => !n.read) && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-gray-400">
                    No notifications
                  </div>
                )}

                {notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => !n.read && markAsRead(n._id)}
                    className={`group flex items-start gap-3 px-4 py-3 cursor-pointer transition
            ${
              n.read
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-indigo-950/40 hover:bg-indigo-900/40"
            }
          `}
                  >
                    {/* Unread dot */}
                    {!n.read && (
                      <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
                    )}

                    {/* Message */}
                    <div className="flex-1">
                      <p
                        className={`text-sm leading-snug ${
                          n.read
                            ? "text-gray-400"
                            : "text-gray-100 font-semibold"
                        }`}
                      >
                        {n.message}
                      </p>

                      <span className="mt-1 block text-xs text-gray-500">
                        Just now
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                      {/* Mark as read */}
                      {!n.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(n._id);
                          }}
                          className="text-emerald-400 hover:text-emerald-300"
                          title="Mark as read"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Delete notification:", n._id);
                        }}
                        className="text-rose-400 hover:text-rose-300"
                        title="Delete notification"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {user ? (
        <>
          <span className="text-white/90 text-sm">Hi, {user.name}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1 bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-50 transition"
          >
            <FiLogOut /> Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="flex items-center gap-1 bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-50 transition"
          >
            <FiLogIn /> Login
          </Link>
          <Link
            to="/register"
            className="bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-800 transition"
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
};

export default DesktopAuth;
