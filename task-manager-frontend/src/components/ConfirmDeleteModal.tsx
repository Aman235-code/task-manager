import { X, Trash2 } from "lucide-react";

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-gray-800 p-6 shadow-2xl text-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-red-400">Delete Task?</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-300">
          This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-600 px-4 py-2 text-sm hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-rose-500 to-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
