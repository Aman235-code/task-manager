import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiCheck, FiLogIn, FiLogOut } from "react-icons/fi";
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
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
              <div className="px-4 py-2 flex justify-between items-center border-b">
                <span className="font-semibold text-sm">Notifications</span>
                {notifications.some((n) => !n.read) && (
                  <button
                    onClick={markAllAsRead}
                    className="text-indigo-600 text-xs hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`px-4 py-2 flex justify-between items-start gap-2 cursor-pointer ${
                      !n.read ? "bg-indigo-50" : ""
                    } hover:bg-indigo-100`}
                  >
                    <span className="text-sm">{n.message}</span>
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <FiCheck />
                      </button>
                    )}
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
