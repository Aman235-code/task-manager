import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTask } from "../hooks/useTasks";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  status: z.enum(["To Do", "In Progress", "Review", "Completed"]),
  assignedToId: z.string(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskForm() {
  const createTask = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = (data: TaskFormData) => {
    createTask.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border p-4 rounded"
    >
      <h2 className="text-lg font-bold">Create Task</h2>

      <input {...register("title")} placeholder="Title" className="input" />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <textarea
        {...register("description")}
        placeholder="Description"
        className="input"
      />
      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}

      <input type="datetime-local" {...register("dueDate")} className="input" />

      <select {...register("priority")} className="input">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Urgent</option>
      </select>

      <select {...register("status")} className="input">
        <option>To Do</option>
        <option>In Progress</option>
        <option>Review</option>
        <option>Completed</option>
      </select>

      <input
        {...register("assignedToId")}
        placeholder="Assigned User ID"
        className="input"
      />

      <button
        type="submit"
        disabled={createTask.isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {createTask.isLoading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
