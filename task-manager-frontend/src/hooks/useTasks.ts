import { useQuery, useMutation, useQueryClient } from "react-query";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/tasks");
      return data.tasks;
    },
    enabled: !!user?.id
  });
};


// Create a task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation(
    (task: Partial<Task>) => api.post("/api/v1/tasks", task),
    {
      onSuccess: () => {
        if (!user?.id) return;

        queryClient.invalidateQueries({
          queryKey: ["tasks", user.id]
        });
      }
    }
  );
};



// Update a task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation(
    ({ id, task }: { id: string; task: Partial<Task> }) =>
      api.put(`/api/v1/tasks/${id}`, task),
    {
      onSuccess: () => {
        if (!user?.id) return;

        queryClient.invalidateQueries({
          queryKey: ["tasks", user.id]
        });
      }
    }
  );
};

// Delete a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation(
    (id: string) => api.delete(`/api/v1/tasks/${id}`),
    {
      onSuccess: () => {
        if (!user?.id) return;

        queryClient.invalidateQueries({
          queryKey: ["tasks", user.id]
        });
      }
    }
  );
};