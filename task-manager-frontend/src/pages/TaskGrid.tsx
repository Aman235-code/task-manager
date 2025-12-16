import TaskCard from "../components/TaskCard";

const TaskGrid = ({ tasks, onEdit, onDelete }: any) => (
  <div className="mt-6">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.length > 0 ? (
        tasks.map((task: any) => (
          <div key={task._id} className="animate-fade-in">
            <TaskCard
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task)}
            />
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-linear-to-br from-slate-50 to-white p-12 text-center shadow-sm">
          <div className="mb-3 rounded-full bg-indigo-100 p-3 text-indigo-600">
            📋
          </div>
          <p className="text-sm font-semibold text-slate-700">No tasks found</p>
          <p className="mt-1 text-xs text-slate-500">
            Try adjusting your filters or create a new task
          </p>
        </div>
      )}
    </div>
  </div>
);

export default TaskGrid;
