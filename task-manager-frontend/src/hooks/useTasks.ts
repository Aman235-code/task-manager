import { useQuery, useMutation, useQueryClient } from "react-query";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";

/**
 * Task interface representing the structure of a task object
 */
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

/**
 * Custom hook to fetch all tasks for the current user
 * @returns React Query object with tasks data, loading, and error state
 */
export const useTasks = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/tasks");
      return data.tasks;
    },
    enabled: !!user?.id, // only fetch if user is logged in
  });
};

/**
 * Custom hook to create a new task
 * @returns Mutation object with create task function and status
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation((task: Partial<Task>) => api.post("/api/v1/tasks", task), {
    onSuccess: () => {
      if (!user?.id) return;

      // Invalidate task queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["tasks", user.id],
      });
    },
  });
};

/**
 * Custom hook to update an existing task
 * @returns Mutation object with update task function and status
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation(
    ({ id, task }: { id: string; task: Partial<Task> }) =>
      api.put(`/api/v1/tasks/${id}`, task),
    {
      onSuccess: () => {
        if (!user?.id) return;

        // Refresh tasks after update
        queryClient.invalidateQueries({
          queryKey: ["tasks", user.id],
        });
      },
    }
  );
};

/**
 * Custom hook to delete a task
 * @returns Mutation object with delete task function and status
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation((id: string) => api.delete(`/api/v1/tasks/${id}`), {
    onSuccess: () => {
      if (!user?.id) return;

      // Refresh tasks after deletion
      queryClient.invalidateQueries({
        queryKey: ["tasks", user.id],
      });
    },
  });
};
