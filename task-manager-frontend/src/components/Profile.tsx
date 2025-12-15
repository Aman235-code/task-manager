import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";

const Profile = () => {
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="text-center text-gray-600">
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

      const res = await api.patch("api/v1/users/me", {
        name: name.trim(),
      });
   
      login({
        ...user,
        name: res.data.name,
      });

      setMessage("Profile updated successfully");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Your Profile
      </h1>

      <form onSubmit={handleUpdate} className="space-y-5">
        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user.email || ""}
            disabled
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Name (editable) */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {message && (
          <p className="text-sm text-center text-indigo-600">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
