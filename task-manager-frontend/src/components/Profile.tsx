import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";
import { Mail, User } from "lucide-react";

const Profile = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="text-center text-gray-400 mt-20">
        Please login to view your profile.
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage("Name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const res = await api.patch("api/v1/users/me", { name: name.trim() });
      login({ ...user, name: res.data.name });
      setMessage("Profile updated successfully");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-800 shadow-2xl p-8 space-y-6 text-gray-100">
        <h1 className="text-2xl font-bold text-center text-white">Your Profile</h1>

        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Email (read-only) */}
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full rounded-xl bg-gray-700 px-10 py-2 text-gray-400 cursor-not-allowed border border-gray-600"
            />
          </div>

          {/* Name (editable) */}
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl bg-gray-700 px-10 py-2 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Message */}
          {message && (
            <p className="text-sm text-center text-indigo-400">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 py-2.5 rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
