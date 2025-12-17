/* eslint-disable no-empty-pattern */
// components/NotificationsDropdown.tsx
import { Check, Trash2 } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

const NotificationsDropdown = ({ }: { onClose?: () => void }) => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();

  return (
    <div className="rounded-2xl bg-gray-900 shadow-2xl ring-1 ring-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <span className="text-sm font-semibold text-gray-100">
          Notifications
        </span>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="divide-y divide-gray-800">
        {notifications.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            No notifications
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => !n.read && markAsRead(n._id)}
            className={`group flex gap-3 px-4 py-3 cursor-pointer transition ${
              n.read
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-indigo-950/40 hover:bg-indigo-900/40"
            }`}
          >
            {!n.read && (
              <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <p
                className={`text-sm wrap-break-word ${
                  n.read ? "text-gray-400" : "text-gray-100 font-semibold"
                }`}
              >
                {n.message}
              </p>
              <span className="block mt-1 text-xs text-gray-500">Just now</span>
            </div>

            <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              {!n.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(n._id);
                  }}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  <Check size={16} />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n._id);
                }}
                className="text-rose-400 hover:text-rose-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsDropdown;
