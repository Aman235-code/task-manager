import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DesktopLinks from "./DesktopLinks";
import DesktopAuth from "./DesktopAuth";
import MobileMenu from "./MobileMenu";
import { api } from "../api/axios";
import toast from "react-hot-toast";

/**
 * Navbar component that displays the application brand, navigation links,
 * user authentication actions, and responsive mobile menu.
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  /**
   * Handles user logout by calling the API, showing a toast notification,
   * updating the auth context, and redirecting to the login page.
   */
  const handleLogout = async () => {
    const res = await api.post("/api/v1/auth/logout");
    if (res.status === 200) {
      toast.success("Logged out");
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex justify-between items-center">
          {/* Brand */}
          <Link to="/" className="text-white text-2xl font-bold tracking-wide">
            TaskManager
          </Link>

          {/* Desktop navigation links */}
          <DesktopLinks user={user} />

          {/* Desktop authentication and notifications */}
          <DesktopAuth user={user} logout={handleLogout} />

          {/* Mobile menu toggle button */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu (shown when toggled) */}
        {mobileOpen && <MobileMenu user={user} logout={handleLogout} />}
      </div>
    </nav>
  );
};

export default Navbar;
