import { Calendar, Pencil, Trash2 } from "lucide-react";
import type { Task } from "../hooks/useTasks";
import { useEffect, useState } from "react";

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

  const [creatorName, setCreatorName] = useState<string>("");

  useEffect(() => {
    if (!task.creatorId) return;

    const fetchCreator = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/v1/users/${task.creatorId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch creator");

        const data = await res.json();
        setCreatorName(data.user?.name || "");
      } catch (err) {
        console.error("Creator fetch failed", err);
      }
    };

    fetchCreator();
  }, [task.creatorId]);

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
      <div className="mt-5 space-y-1 text-sm font-medium text-slate-500">
        <div className="flex items-center gap-2">
          <Calendar size={15} />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>

        <div className="text-xs">
          Created by{" "}
          <span className="font-semibold text-slate-700">
            {creatorName || "Loading..."}
          </span>
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
