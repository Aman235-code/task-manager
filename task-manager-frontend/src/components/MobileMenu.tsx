import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiUser, FiBell, FiLogOut } from "react-icons/fi";
import NotificationsDropdown from "./NotificationsDropdown";
import { useNotifications } from "../context/NotificationContext";

const MobileMenu = ({ user, logout }: any) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const { notifications } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="md:hidden mt-2 flex flex-col gap-2 pb-4">
      {user && (
        <>
          <NavLink to="/" className="px-3 py-2 text-white/80">
            <FiHome /> Dashboard
          </NavLink>

          <NavLink to="/profile" className="px-3 py-2 text-white/80">
            <FiUser /> Profile
          </NavLink>

          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-white/80 hover:bg-white/10"
          >
            {/* Bell wrapper */}
            <span className="relative inline-flex">
              <FiBell size={18} />

              {unreadCount > 0 && (
                <span
                  className="
          absolute
          -top-1.5
          -right-1.5
          h-4 w-4
          rounded-full
          bg-red-500
          text-white
          text-[10px]
          font-semibold
          flex items-center justify-center
        "
                >
                  {unreadCount}
                </span>
              )}
            </span>

            <span className="text-sm">Notifications</span>
          </button>

          {notifOpen && (
            <div className="mt-2">
              <NotificationsDropdown />
            </div>
          )}

          <button
            onClick={logout}
            className="mt-2 flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-md"
          >
            <FiLogOut /> Logout
          </button>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
