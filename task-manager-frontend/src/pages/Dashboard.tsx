/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo } from "react";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../hooks/useTasks";
import type { Task } from "../hooks/useTasks";
import { socket } from "../api/socket";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import { Plus, UserCheck, ClipboardList, AlertTriangle } from "lucide-react";
import { Filter, Flag, ArrowUpDown } from "lucide-react";
import CreateTaskModal from "../components/CreateTaskModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const Dashboard = () => {
  const { user } = useAuth();
  const { data: tasks = [], isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [realtimeTasks, setRealtimeTasks] = useState<Task[]>([]);
  const [openCreate, setOpenCreate] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  /* ---------- Socket sync ---------- */

  useEffect(() => {
    setRealtimeTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    socket.on("taskCreated", (task: Task) => {
      setRealtimeTasks((prev) => [...prev, task]);
    });

    socket.on("taskUpdated", (task: Task) => {
      setRealtimeTasks((prev) =>
        prev.map((t) => (t._id === task._id ? task : t))
      );
    });

    socket.on("taskDeleted", (id: string) => {
      setRealtimeTasks((prev) => prev.filter((t) => t._id !== id));
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  /* ---------- Derived views ---------- */
  const assignedToMe = useMemo(
    () => realtimeTasks.filter((t) => t.assignedToId === user?.id),
    [realtimeTasks, user]
  );

  const createdByMe = useMemo(
    () => realtimeTasks.filter((t) => t.creatorId === user?.id),
    [realtimeTasks, user]
  );

  const overdueTasks = useMemo(() => {
    const now = new Date();
    return realtimeTasks.filter(
      (t) => new Date(t.dueDate) < now && t.status !== "Completed"
    );
  }, [realtimeTasks]);

  const filteredTasks = useMemo(() => {
    let temp = [...realtimeTasks];

    if (statusFilter) temp = temp.filter((t) => t.status === statusFilter);
    if (priorityFilter)
      temp = temp.filter((t) => t.priority === priorityFilter);

    temp.sort((a, b) => {
      const da = new Date(a.dueDate).getTime();
      const db = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? da - db : db - da;
    });

    return temp;
  }, [realtimeTasks, statusFilter, priorityFilter, sortOrder]);

  if (isLoading) return <div className="text-center">Loading dashboard…</div>;
  if (error) return <div className="text-center">Failed to load tasks</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Create Task
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Assigned to you"
          count={assignedToMe.length}
          icon={UserCheck}
        />
        <SummaryCard
          title="Created by you"
          count={createdByMe.length}
          icon={ClipboardList}
        />
        <SummaryCard
          title="Overdue"
          count={overdueTasks.length}
          icon={AlertTriangle}
          danger
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-linear-to-r from-indigo-50 via-white to-cyan-50 p-4 shadow-sm">
        {/* Status filter */}
        <div className="relative">
          <Filter
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
            size={16}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 bg-white/70 py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition
                 hover:border-indigo-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority filter */}
        <div className="relative">
          <Flag
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rose-500"
            size={16}
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 bg-white/70 py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition
                 hover:border-rose-300 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* Sort order */}
        <div className="relative ml-auto">
          <ArrowUpDown
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
            size={16}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="appearance-none rounded-xl border border-slate-200 bg-white/70 py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition
                 hover:border-emerald-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="asc">Due Date ↑</option>
            <option value="desc">Due Date ↓</option>
          </select>
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task._id} className="animate-fade-in">
                <TaskCard
                  task={task}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setOpenCreate(true);
                  }}
                  onDelete={(task) => {
                    setTaskToDelete(task);
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-linear-to-br from-slate-50 to-white p-12 text-center shadow-sm">
              <div className="mb-3 rounded-full bg-indigo-100 p-3 text-indigo-600">
                📋
              </div>
              <p className="text-sm font-semibold text-slate-700">
                No tasks found
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try adjusting your filters or create a new task
              </p>
            </div>
          )}
        </div>
      </div>

      <CreateTaskModal
        open={openCreate}
        initialTask={editingTask}
        onClose={() => {
          setOpenCreate(false);
          setEditingTask(null);
        }}
        onSubmit={(task) => {
          if (editingTask) {
            updateTaskMutation.mutate({
              id: editingTask._id,
              task,
            });
          } else {
            createTaskMutation.mutate(task);
          }
        }}
      />

      <ConfirmDeleteModal
        open={!!taskToDelete}
        loading={deleteTaskMutation.isLoading}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (!taskToDelete) return;

          deleteTaskMutation.mutate(taskToDelete._id, {
            onSuccess: () => {
              setTaskToDelete(null);
            },
          });
        }}
      />
    </div>
  );
};

export default Dashboard;

/* ---------- Summary Card ---------- */

const SummaryCard = ({
  title,
  count,
  icon: Icon,
  danger,
}: {
  title: string;
  count: number;
  icon: any;
  danger?: boolean;
}) => (
  <div
    className={`rounded-xl p-6 shadow text-white flex items-center gap-4 ${
      danger ? "bg-red-500" : "bg-linear-to-r from-indigo-500 to-purple-500"
    }`}
  >
    <Icon size={36} />
    <div>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  </div>
);
