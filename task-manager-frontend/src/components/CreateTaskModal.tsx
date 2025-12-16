 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { X, Calendar, Flag, User, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CreateTaskModal({
  open,
  onClose,
  onSubmit,
  initialTask,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  initialTask?: any;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "To Do",
    assignedToId: "",
  });

  const { user } = useAuth();

  const currentUser = user;

  const isEdit = Boolean(initialTask);

  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.dueDate) newErrors.dueDate = "Due date is required";
    if (!form.priority) newErrors.priority = "Priority is required";
    if (!form.status) newErrors.status = "Status is required";
    if (!form.assignedToId) newErrors.assignedToId = "Assignee is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title,
        description: initialTask.description,
        dueDate: initialTask.dueDate?.slice(0, 16),
        priority: initialTask.priority,
        status: initialTask.status,
        assignedToId: initialTask.assignedToId,
      });
    } else {
      setForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "To Do",
        assignedToId: "",
      });
    }
  }, [initialTask, open]);

  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);

        const res = await fetch("http://localhost:4000/api/v1/users/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      ...form,
      dueDate: new Date(form.dueDate).toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg animate-modal-in rounded-2xl bg-linear-to-br from-white via-white to-indigo-50 p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-5 border-b border-slate-200 pb-3">
          <h2 className="text-lg font-bold text-slate-800">
            {isEdit ? "Edit Task" : "Create Task"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">Add task details below</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Title
            </label>
            <input
              name="title"
              placeholder="Enter task title"
              value={form.title}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-2 text-sm focus:ring-2
    ${
      errors.title
        ? "border-red-400 focus:ring-red-200"
        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-200"
    }
  `}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the task"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={`w-full rounded-xl border px-4 py-2 text-sm focus:ring-2
    ${
      errors.description
        ? "border-red-400 focus:ring-red-200"
        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-200"
    }
  `}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Due date */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Due date
            </label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
              />
              <input
                type="datetime-local"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className={`w-full rounded-xl border py-2 pl-9 pr-3 text-sm focus:ring-2
    ${
      errors.dueDate
        ? "border-red-400 focus:ring-red-200"
        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-200"
    }
  `}
              />
              {errors.dueDate && (
                <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Priority
            </label>
            <div className="relative">
              <Flag
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500"
              />
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={`w-full appearance-none rounded-xl border py-2 pl-9 pr-3 text-sm focus:ring-2
    ${
      errors.priority
        ? "border-red-400 focus:ring-red-200"
        : "border-slate-200 focus:border-rose-400 focus:ring-rose-200"
    }
  `}
              >
                <option value="" disabled>
                  Select priority
                </option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-xs text-red-500">{errors.priority}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Status
            </label>
            <div className="relative">
              <CheckCircle2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`w-full appearance-none rounded-xl border py-2 pl-9 pr-3 text-sm focus:ring-2
    ${
      errors.status
        ? "border-red-400 focus:ring-red-200"
        : "border-slate-200 focus:border-emerald-400 focus:ring-emerald-200"
    }
  `}
              >
                <option value="" disabled>
                  Select status
                </option>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Review</option>
                <option>Completed</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-xs text-red-500">{errors.status}</p>
              )}
            </div>
          </div>

          {/* Assigned user */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Assign to
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500"
              />
              <select
                name="assignedToId"
                value={form.assignedToId}
                onChange={handleChange}
                disabled={loadingUsers}
                className={`w-full appearance-none rounded-xl border py-2 pl-9 pr-3 text-sm focus:ring-2
    ${
      errors.assignedToId
        ? "border-red-400 focus:ring-red-200"
        : "border-slate-200 focus:border-sky-400 focus:ring-sky-200"
    }
  `}
              >
                <option value="" disabled>
                  Select user
                </option>

                {users.map((u) => {
                  const isSelected = form.assignedToId === u._id;

                  return (
                    <option key={u._id} value={u._id}>
                      {isSelected ? "✓ " : ""}
                      {u.name}
                      {u._id === currentUser?._id ? " (You)" : ""}
                    </option>
                  );
                })}
              </select>
              {errors.assignedToId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.assignedToId}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="mt-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90"
          >
            {isEdit ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
