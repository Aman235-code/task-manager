// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";

const Navbar = () => {
  // const user = true;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  console.log(user);

  const handleLogout = async () => {
    try {
      const res = await api.post("/api/v1/auth/logout");
      console.warn("user lgged out", res);
      logout();
      navigate("/register");
      alert("Logged out");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <nav className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left: Logo / Title */}
        <Link
          to="/"
          className="text-white text-2xl font-bold tracking-wide hover:opacity-90 transition"
        >
          TaskManager
        </Link>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-white font-medium">Hello, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold hover:bg-indigo-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-indigo-600 px-4 py-2 rounded-md font-semibold hover:bg-indigo-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
