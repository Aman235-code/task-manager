import { NavLink } from "react-router-dom";
import { FiHome, FiUser } from "react-icons/fi";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition ${
    isActive
      ? "bg-white/20 text-white"
      : "text-white/80 hover:text-white hover:bg-white/10"
  }`;

const DesktopLinks = ({ user }: { user: any }) => {
  if (!user) return null;

  return (
    <div className="hidden md:flex items-center gap-4">
      <NavLink to="/" className={navLinkClass}>
        <FiHome /> Dashboard
      </NavLink>
      <NavLink to="/profile" className={navLinkClass}>
        <FiUser /> Profile
      </NavLink>
    </div>
  );
};

export default DesktopLinks;
