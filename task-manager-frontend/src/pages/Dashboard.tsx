/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../hooks/useTasks";
import { socket } from "../api/socket";
import TaskForm from "../components/TaskForm";

const Dashboard = () => {
  const { data: tasks, isLoading, error } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Update tasks in real-time
  useEffect(() => {
    socket.on("taskCreated", (task: Task) => {
      setFilteredTasks((prev) => [...prev, task]);
    });
    socket.on("taskUpdated", (task: Task) => {
      setFilteredTasks((prev) =>
        prev.map((t) => (t._id === task._id ? task : t))
      );
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
    };
  }, []);

  useEffect(() => {
    if (tasks && Array.isArray(tasks)) {
      let temp = [...tasks];
      if (statusFilter) temp = temp.filter((t) => t.status === statusFilter);
      if (priorityFilter)
        temp = temp.filter((t) => t.priority === priorityFilter);
      setFilteredTasks(temp);
    }
  }, [tasks, statusFilter, priorityFilter]);

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div className="p-4">
      <TaskForm />
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="flex gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <h2 className="font-bold">{task.title}</h2>
              <p>{task.description}</p>
              <p>
                <strong>Status:</strong> {task.status} |{" "}
                <strong>Priority:</strong> {task.priority}
              </p>
              <p>
                <strong>Due:</strong> {new Date(task.dueDate).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
