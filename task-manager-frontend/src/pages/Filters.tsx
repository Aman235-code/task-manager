import { Filter, Flag, ArrowUpDown } from "lucide-react";

const Filters = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortOrder,
  setSortOrder,
}: any) => (
  <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-linear-to-r from-indigo-50 via-white to-cyan-50 p-4 shadow-sm">
    <div className="relative">
      <Filter
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
        size={16}
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="appearance-none rounded-xl border border-slate-200 bg-white/70 py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:border-indigo-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        <option value="">All Status</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Review">Review</option>
        <option value="Completed">Completed</option>
      </select>
    </div>

    <div className="relative">
      <Flag
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rose-500"
        size={16}
      />
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="appearance-none rounded-xl border border-slate-200 bg-white/70 py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:border-rose-300 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>
    </div>

    <div className="relative ml-auto">
      <ArrowUpDown
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
        size={16}
      />
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as never)}
        className="appearance-none rounded-xl border border-slate-200 bg-white/70 py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:border-emerald-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      >
        <option value="asc">Due Date ↑</option>
        <option value="desc">Due Date ↓</option>
      </select>
    </div>
  </div>
);

export default Filters;
