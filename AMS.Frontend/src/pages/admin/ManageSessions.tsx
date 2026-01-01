import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/Modal";

interface Session {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

const ManageSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const fetchSessions = async () => {
    try {
      const res = await api.get("/Admin/sessions");
      setSessions(res.data);
    } catch (error) {
      showToast("Failed to fetch sessions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/Admin/sessions", formData);
      setShowModal(false);
      setFormData({ name: "", startDate: "", endDate: "" });
      fetchSessions();
      showToast("Session created successfully!", "success");
    } catch (error) {
      showToast("Failed to create session.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this session?")) return;
    try {
      await api.delete(`/Admin/sessions/${id}`);
      setSessions(sessions.filter((s) => s.id !== id));
      showToast("Session deleted successfully.", "success");
    } catch (error) {
      showToast("Failed to delete. It might contain active classes.", "error");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-white">
            Academic Sessions
          </h2>
          <p className="text-sm text-stone-500 dark:text-slate-400">
            Manage semesters and academic terms.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          <span>+</span> Create Session
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-midnight-900 rounded-2xl border border-stone-200 dark:border-midnight-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 dark:bg-midnight-950 border-b border-stone-200 dark:border-midnight-800 text-xs uppercase text-stone-500 dark:text-slate-400 font-semibold">
              <th className="p-4">Session Name</th>
              <th className="p-4">Start Date</th>
              <th className="p-4">End Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-midnight-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-400">
                  Loading data...
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-stone-50 dark:hover:bg-midnight-800/50 transition-colors"
                >
                  <td className="p-4 font-bold text-stone-800 dark:text-white">
                    {s.name}
                  </td>
                  <td className="p-4 text-stone-600 dark:text-slate-400">
                    {new Date(s.startDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-stone-600 dark:text-slate-400">
                    {new Date(s.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="New Academic Session"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">
              Session Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Fall 2026"
              className="w-full px-3 py-2.5 bg-stone-50 dark:bg-midnight-950 border border-stone-200 dark:border-midnight-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-stone-800 dark:text-white"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2.5 bg-stone-50 dark:bg-midnight-950 border border-stone-200 dark:border-midnight-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-stone-800 dark:text-white"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2.5 bg-stone-50 dark:bg-midnight-950 border border-stone-200 dark:border-midnight-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-stone-800 dark:text-white"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg mt-2"
          >
            Create Session
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageSessions;
