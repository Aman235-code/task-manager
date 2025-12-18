import { Calendar, Pencil, Trash2, User, Flag } from "lucide-react";
import type { Task } from "../hooks/useTasks";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { AuthUser } from "../context/AuthContext";
import { api } from "../api/axios";

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "Completed";

  type UserType = { _id: string; name: string; email: string };
  const [creator, setCreator] = useState<UserType | null>(null);
  const [assignee, setAssignee] = useState<UserType | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!task.creatorId || !task.assignedToId) return;

    const fetchUsers = async () => {
      try {
        const [creatorRes, assigneeRes] = await Promise.all([
          api.get(`/api/v1/users/${task.creatorId}`),
          api.get(`/api/v1/users/${task.assignedToId}`),
        ]);

        setCreator(creatorRes.data.user);
        setAssignee(assigneeRes.data.user);
      } catch (err) {
        console.error("User fetch failed", err);
      }
    };

    fetchUsers();
  }, [task.creatorId, task.assignedToId]);

  const getUserLabel = (
    targetUser: UserType | null,
    currentUser: AuthUser | null
  ) => {
    console.warn(targetUser, currentUser);
    if (!targetUser) return "Loading...";
    if (targetUser._id === currentUser?.id) return "Me";
    return targetUser.name;
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-2xl
        ${
          isOverdue
            ? "border-red-500 bg-gray-900"
            : "border-gray-700 bg-gray-800"
        }
      `}
    >
      {/* Top gradient bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1.5 rounded-t-xl ${
          isOverdue
            ? "bg-linear-to-r from-red-500 to-rose-500"
            : "bg-linear-to-r from-indigo-500 via-sky-500 to-cyan-500"
        }`}
      />

      {/* Floating actions */}
      <div className="absolute top-4 right-4 flex gap-2 group-hover:opacity-100">
        <button
          onClick={() => onEdit(task)}
          className="rounded-lg bg-gray-700/70 p-2 text-indigo-400 hover:bg-indigo-600 hover:text-white transition"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="rounded-lg bg-gray-700/70 p-2 text-rose-400 hover:bg-rose-600 hover:text-white transition"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Card content */}
      <div className="p-5 space-y-3">
        <h2 className="text-lg font-bold text-gray-100">{task.title}</h2>
        <p className="text-sm text-gray-300 line-clamp-2">{task.description}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          Status: <Badge text={task.status} />
          Priority: <Badge text={task.priority} />
          {isOverdue && <Badge text="Overdue" danger />}
        </div>

        {/* Footer */}
        <div className="mt-4 rounded-lg bg-gray-700 p-3 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar size={16} className="text-gray-400" />
            <span>
              Due{" "}
              <span className="font-semibold text-gray-100">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2">
              <User size={14} className="text-blue-400" />
              <span className="text-gray-300">
                Created by{" "}
                <span className="font-semibold text-blue-300">
                  {getUserLabel(creator, user)}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flag size={14} className="text-emerald-400" />
              <span className="text-gray-300">
                Assigned to{" "}
                <span className="font-semibold text-emerald-300">
                  {getUserLabel(assignee, user)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Badge = ({ text, danger }: { text: string; danger?: boolean }) => {
  const base = "rounded-full px-3 py-1 text-xs font-semibold shadow-sm";

  if (danger) {
    return (
      <span
        className={`${base} bg-linear-to-r from-red-500 to-rose-500 text-white`}
      >
        {text}
      </span>
    );
  }

  const map: Record<string, string> = {
    "To Do": "bg-gray-700 text-gray-200",
    "In Progress": "bg-blue-500 text-white",
    Review: "bg-amber-400 text-gray-900",
    Completed: "bg-emerald-500 text-white",
    Low: "bg-gray-600 text-gray-100",
    Medium: "bg-indigo-500 text-white",
    High: "bg-orange-500 text-white",
    Urgent: "bg-rose-500 text-white",
  };

  return (
    <span className={`${base} ${map[text] || "bg-indigo-500 text-white"}`}>
      {text}
    </span>
  );
};
