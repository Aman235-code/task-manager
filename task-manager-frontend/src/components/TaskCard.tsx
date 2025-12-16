import { Calendar, Pencil, Trash2 } from "lucide-react";
import type { Task } from "../hooks/useTasks";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

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

  type User = {
    _id: string;
    name: string;
    email: string;
  };

  const [creatorName, setCreatorName] = useState<User | null>(null);
  const [assignedToName, setAssignedToName] = useState<User | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!task.creatorId || !task.assignedToId) return;

    const fetchUsers = async () => {
      try {
        const [creatorRes, assigneeRes] = await Promise.all([
          fetch(`http://localhost:4000/api/v1/users/${task.creatorId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
          fetch(`http://localhost:4000/api/v1/users/${task.assignedToId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }),
        ]);

        if (!creatorRes.ok || !assigneeRes.ok) {
          throw new Error("Failed to fetch users");
        }

        const creatorData = await creatorRes.json();
        const assigneeData = await assigneeRes.json();

        setCreatorName(creatorData.user);
        setAssignedToName(assigneeData.user);
      } catch (err) {
        console.error("User fetch failed", err);
      }
    };

    fetchUsers();
  }, [task.creatorId, task.assignedToId]);

  const getUserLabel = (
    targetUser: { _id: string; name: string } | null,
    currentUser: { id: string } | null
  ) => {
    if (!targetUser) return "Loading...";
    if (targetUser._id === currentUser?.id) return "Me";
    return targetUser.name;
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all
        hover:-translate-y-1 hover:shadow-2xl
        ${
          isOverdue
            ? "border-red-400/60 bg-linear-to-br from-red-50 via-white to-rose-50"
            : "border-slate-200 bg-linear-to-br from-indigo-50/40 via-white to-cyan-50/40"
        }
      `}
    >
      {/* Top gradient bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1.5 ${
          isOverdue
            ? "bg-linear-to-r from-red-400 to-rose-500"
            : "bg-linear-to-r from-indigo-400 via-sky-400 to-cyan-400"
        }`}
      />

      {/* Floating actions */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={() => onEdit(task)}
          className="rounded-xl bg-white/70 p-2 text-indigo-500 hover:bg-indigo-100"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={() => onDelete(task)}
          className="rounded-xl bg-white/70 p-2 text-rose-500 shadow-sm backdrop-blur hover:bg-rose-100 hover:text-rose-600"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <h2 className="text-lg font-bold text-slate-800">{task.title}</h2>

      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
        {task.description}
      </p>

      {/* Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge text={task.status} />
        <Badge text={task.priority} />
        {isOverdue && <Badge text="Overdue" danger />}
      </div>

      {/* Footer */}
      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar size={15} className="text-slate-500" />
          <span>
            Due{" "}
            <span className="font-medium text-slate-800">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </span>
        </div>

        <div className="mt-3 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              CREATED
            </span>
            <span className="font-medium text-slate-700">
              by{" "}
              <span className="font-semibold text-blue-600">
                {getUserLabel(creatorName, user)}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              ASSIGNED
            </span>
            <span className="font-medium text-slate-700">
              to{" "}
              <span className="font-semibold text-emerald-600">
                {getUserLabel(assignedToName, user)}
              </span>
            </span>
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
    "To Do": "bg-gradient-to-r from-slate-200 to-slate-100 text-slate-700",
    "In Progress": "bg-gradient-to-r from-blue-500 to-sky-400 text-white",
    Review: "bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900",
    Completed: "bg-gradient-to-r from-emerald-500 to-teal-400 text-white",
    Low: "bg-gradient-to-r from-gray-200 to-gray-100 text-gray-700",
    Medium: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
    High: "bg-gradient-to-r from-orange-500 to-amber-500 text-black",
    Urgent: "bg-gradient-to-r from-rose-500 to-red-500 text-white",
  };

  return (
    <span className={`${base} ${map[text] || "bg-indigo-100 text-indigo-700"}`}>
      {text}
    </span>
  );
};
