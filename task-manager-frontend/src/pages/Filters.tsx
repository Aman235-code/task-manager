/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filter, Flag, ArrowUpDown } from "lucide-react";

const Filters = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortOrder,
  setSortOrder,
}: any) => (
  <div className="flex flex-col md:flex-row flex-wrap items-center gap-4 p-4 bg-gray-800 rounded-2xl shadow-md border border-gray-700">
    {/* Status Filter */}
    <div className="relative w-full md:w-60">
      <Filter
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"
        size={18}
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full appearance-none rounded-xl border border-gray-600 bg-gray-700/70 py-2 pl-10 pr-8 text-sm font-medium text-gray-100 shadow-sm backdrop-blur-sm transition hover:border-indigo-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">All Status</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Review">Review</option>
        <option value="Completed">Completed</option>
      </select>
    </div>

    {/* Priority Filter */}
    <div className="relative w-full md:w-60">
      <Flag
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rose-400"
        size={18}
      />
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="w-full appearance-none rounded-xl border border-gray-600 bg-gray-700/70 py-2 pl-10 pr-8 text-sm font-medium text-gray-100 shadow-sm backdrop-blur-sm transition hover:border-rose-300 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>
    </div>

    {/* Sort Filter */}
    <div className="relative w-full md:w-60 md:ml-auto">
      <ArrowUpDown
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400"
        size={18}
      />
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as never)}
        className="w-full appearance-none rounded-xl border border-gray-600 bg-gray-700/70 py-2 pl-10 pr-8 text-sm font-medium text-gray-100 shadow-sm backdrop-blur-sm transition hover:border-emerald-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <option value="asc">Due Date ↑</option>
        <option value="desc">Due Date ↓</option>
      </select>
    </div>
  </div>
);

export default Filters;
