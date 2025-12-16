import { Plus } from "lucide-react";

const Header = ({ onCreate }: { onCreate: () => void }) => (
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
    <button
      onClick={onCreate}
      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
    >
      <Plus size={18} /> Create Task
    </button>
  </div>
);

export default Header;
