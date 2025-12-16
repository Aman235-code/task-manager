import TaskCard from "../components/TaskCard";

const TaskGrid = ({ tasks, onEdit, onDelete }: any) => (
  <div className="mt-6">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.length > 0 ? (
        tasks.map((task: any) => (
          <div
            key={task._id}
            className="animate-fade-in transition-transform hover:scale-[1.02]"
          >
            <TaskCard
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task)}
            />
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-gray-600 bg-gray-800 p-12 text-center shadow-md">
          <div className="mb-3 rounded-full bg-gray-700 p-4 text-gray-200 text-2xl">
            📋
          </div>
          <p className="text-sm font-semibold text-gray-100">No tasks found</p>
          <p className="mt-1 text-xs text-gray-400">
            Try adjusting your filters or create a new task
          </p>
        </div>
      )}
    </div>
  </div>
);

export default TaskGrid;
