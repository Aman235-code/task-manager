import { X, Calendar, Flag, User, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
/**
 * Modal component for creating or editing a task.
 * Fetches users for assignment, handles form validation, and submits task data.
 */
export default function CreateTaskModal({
  open,
  onClose,
  onSubmit,
  initialTask,
}: {
  /** Whether the modal is open */
  open: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Function to handle task submission */
  onSubmit: (task: any) => void;
  /** Optional task to edit */
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
  const isEdit = Boolean(initialTask);

  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validates form fields and sets errors.
   * @returns true if form is valid, false otherwise
   */
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

  // Fetch users when modal opens
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

  /**
   * Updates form state on input change
   * @param e - Input change event
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  /**
   * Handles form submission, validates, and triggers onSubmit prop
   */
  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, dueDate: new Date(form.dueDate).toISOString() });
    onClose();
  };

  const inputBase =
    "w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:outline-none transition";

  const selectBase =
    "w-full appearance-none rounded-xl border py-2 pl-9 pr-3 text-sm focus:ring-2 focus:outline-none transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-in rounded-2xl bg-gray-900 p-6 shadow-2xl text-gray-100">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-5 border-b border-gray-700 pb-3">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? "Edit Task" : "Create Task"}
          </h2>
          <p className="mt-1 text-sm text-gray-400">Add task details below</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-400">
              Title
            </label>
            <input
              name="title"
              placeholder="Enter task title"
              value={form.title}
              onChange={handleChange}
              className={`${inputBase} ${
                errors.title
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              } bg-gray-800 text-white`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-400">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the task"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className={`${inputBase} ${
                errors.description
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
              } bg-gray-800 text-white`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-400">
              Due Date
            </label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"
              />
              <input
                type="datetime-local"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className={`${inputBase} ${
                  errors.dueDate
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                } pl-10 bg-gray-800 text-white`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-400">
              Priority
            </label>
            <div className="relative">
              <Flag
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400"
              />
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={`${selectBase} ${
                  errors.priority
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-700 focus:border-rose-500 focus:ring-rose-500"
                } pl-10 bg-gray-800 text-white`}
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
            <label className="mb-1 block text-xs font-semibold text-gray-400">
              Status
            </label>
            <div className="relative">
              <CheckCircle2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`${selectBase} ${
                  errors.status
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
                } pl-10 bg-gray-800 text-white`}
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

          {/* Assigned User */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-400">
              Assign To
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400"
              />
              <select
                name="assignedToId"
                value={form.assignedToId}
                onChange={handleChange}
                disabled={loadingUsers}
                className={`${selectBase} ${
                  errors.assignedToId
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-700 focus:border-sky-500 focus:ring-sky-500"
                } pl-10 bg-gray-800 text-white`}
              >
                <option value="" disabled>
                  Select user
                </option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {form.assignedToId === u._id ? "✓ " : ""}
                    {u.name} {u._id === user?._id ? "(You)" : ""}
                  </option>
                ))}
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
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition"
          >
            {isEdit ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
