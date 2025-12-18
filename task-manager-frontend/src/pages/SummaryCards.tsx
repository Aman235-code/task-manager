/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserCheck, ClipboardList, AlertTriangle } from "lucide-react";

const SummaryCard = ({
  title,
  count,
  icon: Icon,
  danger,
}: {
  title: string;
  count: number;
  icon: any;
  danger?: boolean;
}) => (
  <div
    className={`rounded-xl p-6 shadow text-white flex items-center gap-4 ${
      danger ? "bg-red-500" : "bg-linear-to-r from-indigo-500 to-purple-500"
    }`}
  >
    <Icon size={36} />
    <div>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  </div>
);

const SummaryCards = ({ assignedToMe, createdByMe, overdueTasks }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <SummaryCard
      title="Assigned to you"
      count={assignedToMe.length}
      icon={UserCheck}
    />
    <SummaryCard
      title="Created by you"
      count={createdByMe.length}
      icon={ClipboardList}
    />
    <SummaryCard
      title="Overdue"
      count={overdueTasks.length}
      icon={AlertTriangle}
      danger
    />
  </div>
);

export default SummaryCards;
