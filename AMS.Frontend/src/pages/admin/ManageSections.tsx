import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/Modal";

const ManageSections = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]); // For dropdown
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: "", academicSessionId: "" });

  useEffect(() => {
    fetchSections();
    fetchSessions();
  }, []);

  const fetchSections = async () => {
    const res = await api.get("/Admin/sections");
    setSections(res.data);
  };

  const fetchSessions = async () => {
    const res = await api.get("/Admin/sessions");
    setSessions(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/Admin/sections", {
        ...formData,
        academicSessionId: parseInt(formData.academicSessionId),
      });
      setShowModal(false);
      setFormData({ name: "", academicSessionId: "" });
      fetchSections();
      showToast("Section created!", "success");
    } catch (e) {
      showToast("Failed to create section.", "error");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white">
          Sections Management
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          + Add Section
        </button>
      </div>

      <div className="bg-white dark:bg-midnight-900 rounded-2xl border border-stone-200 dark:border-midnight-800 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 dark:bg-midnight-950 text-xs text-stone-500 font-bold uppercase">
              <th className="p-4">Name</th>
              <th className="p-4">Session</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr
                key={s.id}
                className="border-t border-stone-100 dark:border-midnight-800"
              >
                <td className="p-4 font-bold dark:text-white">{s.name}</td>
                <td className="p-4 text-stone-500">{s.sessionName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Section"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold dark:text-slate-400">
              Section Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg dark:bg-midnight-950 dark:text-white"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="e.g. BSCS-5A"
            />
          </div>
          <div>
            <label className="text-xs font-bold dark:text-slate-400">
              Academic Session
            </label>
            <select
              className="w-full p-2 border rounded-lg dark:bg-midnight-950 dark:text-white"
              value={formData.academicSessionId}
              onChange={(e) =>
                setFormData({ ...formData, academicSessionId: e.target.value })
              }
              required
            >
              <option value="">Select Session</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg">
            Create
          </button>
        </form>
      </Modal>
    </div>
  );
};
export default ManageSections;
