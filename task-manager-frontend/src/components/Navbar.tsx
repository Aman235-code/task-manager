import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
      logout();
      navigate("/register");
    } catch (err: any) {
      alert(err.response?.data?.message || "Logout failed");
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? "bg-white/20 text-white"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 grid grid-cols-3 items-center">
          {/* Left: Brand */}
          <Link
            to="/"
            className="text-white text-2xl font-bold tracking-wide"
          >
            TaskManager
          </Link>

          {/* Center: Nav links */}
          <div className="flex justify-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Dashboard
            </NavLink>

            {user && (
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
            )}
          </div>

          {/* Right: Auth actions */}
          <div className="flex justify-end items-center gap-3">
            {user ? (
              <>
                <span className="text-white/90 text-sm hidden sm:block">
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-50 transition"
                >
                  Login
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
