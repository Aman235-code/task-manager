import { X, Calendar, Flag, User, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function CreateTaskModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (task: any) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "To Do",
    assignedToId: "",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onCreate({
      ...form,
      dueDate: new Date(form.dueDate).toISOString(),
    });

    onClose(); // ✅ close modal after create
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg animate-modal-in rounded-2xl bg-gradient-to-br from-white via-white to-indigo-50 p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-5 border-b border-slate-200 pb-3">
          <h2 className="text-lg font-bold text-slate-800">Create Task</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add task details below
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task title"
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          />

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Task description"
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          />

          {/* Due date */}
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
            <input
              type="datetime-local"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Priority */}
          <div className="relative">
            <Flag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" />
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>

          {/* Status */}
          <div className="relative">
            <CheckCircle2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full appearance-none rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Review</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Assigned user */}
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
            <input
              name="assignedToId"
              value={form.assignedToId}
              onChange={handleChange}
              placeholder="Assigned User ID"
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}
