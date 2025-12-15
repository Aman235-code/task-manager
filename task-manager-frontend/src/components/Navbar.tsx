import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          Task<span className="text-indigo-600">Manager</span>
        </Link>

        {/* Right */}
        <nav className="flex items-center gap-4">
          {!user ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-md px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-md px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="text-sm text-slate-600">
                Hi, <span className="font-semibold">{user.name}</span>
              </span>

              <button
                onClick={handleLogout}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
