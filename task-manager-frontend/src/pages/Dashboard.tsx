/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useMemo, useRef } from "react";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../hooks/useTasks";
import { socket } from "../api/socket";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import Filters from "./Filters";
import TaskGrid from "./TaskGrid";
import SummaryCards from "./SummaryCards";
import CreateTaskModal from "../components/CreateTaskModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import type { Task } from "../hooks/useTasks";
import toast from "react-hot-toast";

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

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && tasks.length > 0) {
      setRealtimeTasks(tasks);
      initializedRef.current = true;
    }
  }, [tasks]);

  useEffect(() => {
    socket.on("taskCreated", (task: Task) =>
      setRealtimeTasks((prev) => [...prev, task])
    );
    socket.on("taskUpdated", (task: Task) =>
      setRealtimeTasks((prev) =>
        prev.map((t) => (t._id === task._id ? task : t))
      )
    );
    socket.on("taskDeleted", (id: string) =>
      setRealtimeTasks((prev) => prev.filter((t) => t._id !== id))
    );
    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, []);

  // Derived task views
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
    temp.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );
    return temp;
  }, [realtimeTasks, statusFilter, priorityFilter, sortOrder]);

  if (isLoading) return <div className="text-center">Loading dashboard…</div>;
  if (error) return <div className="text-center">Failed to load tasks</div>;

  return (
    <div className="space-y-8">
      <Header onCreate={() => setOpenCreate(true)} />
      <SummaryCards
        assignedToMe={assignedToMe}
        createdByMe={createdByMe}
        overdueTasks={overdueTasks}
      />
      <Filters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <TaskGrid
        tasks={filteredTasks}
        onEdit={(task) => {
          setEditingTask(task);
          setOpenCreate(true);
        }}
        onDelete={setTaskToDelete}
      />

      <CreateTaskModal
        open={openCreate}
        initialTask={editingTask}
        onClose={() => {
          setOpenCreate(false);
          setEditingTask(null);
        }}
        onSubmit={(task) => {
          if (editingTask) {
            updateTaskMutation.mutate(
              { id: editingTask._id, task },
              {
                onSuccess: (updatedTask) => {
                  setRealtimeTasks((prev) =>
                    prev.map((t) =>
                      t._id === editingTask._id ? updatedTask.data : t
                    )
                  );
                  toast.success("Task updated successfully");
                  setEditingTask(null);
                  setOpenCreate(false);
                },
                onError: (error: any) => {
                  const message =
                    error?.response?.data?.message || "Failed to update task";
                  toast.error(message);
                },
              }
            );
          } else {
            createTaskMutation.mutate(task, {
              onSuccess: (newTask) => {
                toast.success("Task created successfully");
                setRealtimeTasks((prev) => [...prev, newTask.data]);
                setOpenCreate(false);
              },
              onError: (error: any) => {
                const message =
                  error?.response?.data?.message || "Failed to create task";
                toast.error(message);
              },
            });
          }
        }}
      />

      <ConfirmDeleteModal
        open={!!taskToDelete}
        loading={deleteTaskMutation.isLoading}
        onClose={() => {
          if (!deleteTaskMutation.isLoading) {
            setTaskToDelete(null);
          }
        }}
        onConfirm={() => {
          if (!taskToDelete) return;

          deleteTaskMutation.mutate(taskToDelete._id, {
            onSuccess: () => {
              setRealtimeTasks((prev) =>
                prev.filter((t) => t._id !== taskToDelete._id)
              );
              toast.success("Task deleted successfully");
              setTaskToDelete(null);
            },
            onError: (error: any) => {
              const message =
                error?.response?.data?.message || "Failed to delete task";
              toast.error(message);
            },
          });
        }}
      />
    </div>
  );
};

export default Dashboard;
