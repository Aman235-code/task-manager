import { useQuery, useMutation, useQueryClient } from "react-query";
import { api } from "../api/axios";

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  creatorId: string;
  assignedToId: string;
}

// Fetch all tasks
export const useTasks = () => {
  return useQuery<Task[]>("tasks", async () => {
    const { data } = await api.get("/api/v1/tasks");
    return data.tasks;
  });
};

// Create a task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (task: Partial<Task>) => api.post("/tasks", task),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
      },
    }
  );
};

// Update a task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, task }: { id: string; task: Partial<Task> }) =>
      api.put(`/tasks/${id}`, task),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
      },
    }
  );
};

// Delete a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (id: string) => api.delete(`/tasks/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
      },
    }
  );
};
