import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiLogIn, FiLogOut } from "react-icons/fi";
import { useNotifications } from "../context/NotificationContext";
import NotificationsDropdown from "./NotificationsDropdown";

const DesktopAuth = ({ user, logout }: { user: any; logout: () => void }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { notifications, setNotifications } = useNotifications();

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

  return (
    <div className="hidden md:flex items-center gap-4 relative" ref={notifRef}>
      {user && (
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative">
            <FiBell size={20} className="text-white cursor-pointer" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-[90vw] sm:w-80 max-w-sm z-50">
              <NotificationsDropdown />
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
