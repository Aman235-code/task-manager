import { NavLink, Link } from "react-router-dom";
import { FiHome, FiUser, FiLogIn, FiLogOut, FiBell } from "react-icons/fi";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition ${
    isActive
      ? "bg-white/20 text-white"
      : "text-white/80 hover:text-white hover:bg-white/10"
  }`;

const MobileMenu = ({ user, logout }: { user: any; logout: () => void }) => (
  <div className="md:hidden mt-2 flex flex-col gap-2 pb-4">
    {user && (
      <>
        <NavLink to="/" className={navLinkClass} onClick={() => {}}>
          <FiHome /> Dashboard
        </NavLink>
        <NavLink to="/profile" className={navLinkClass} onClick={() => {}}>
          <FiUser /> Profile
        </NavLink>
        <div className="relative px-3 py-2 rounded-md bg-white/10">
          <FiBell size={20} className="text-white inline" />{" "}
          <span className="ml-2 text-white text-sm">Notifications</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1 bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-50 transition"
        >
          <FiLogOut /> Logout
        </button>
      </>
    )}
    {!user && (
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

export default MobileMenu;
