import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/Modal";

interface Course {
  id: number;
  name: string;
  code: string;
  creditHours: number;
}

const ManageCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    creditHours: 3,
  });

  const fetchCourses = async () => {
    try {
      const res = await api.get("/Admin/courses");
      setCourses(res.data);
    } catch (error) {
      showToast("Failed to fetch courses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/Admin/courses", formData);
      setShowModal(false);
      setFormData({ name: "", code: "", creditHours: 3 });
      fetchCourses();
      showToast("Course added successfully!", "success");
    } catch (error) {
      showToast("Failed to add course.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    try {
      await api.delete(`/Admin/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
      showToast("Course deleted successfully.", "success");
    } catch (error) {
      showToast(
        "Failed to delete. It might be assigned to a teacher.",
        "error"
      );
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-white">
            Courses Management
          </h2>
          <p className="text-sm text-stone-500 dark:text-slate-400">
            Add and manage curriculum subjects.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          <span>+</span> Add Course
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-midnight-900 rounded-2xl border border-stone-200 dark:border-midnight-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 dark:bg-midnight-950 border-b border-stone-200 dark:border-midnight-800 text-xs uppercase text-stone-500 dark:text-slate-400 font-semibold">
              <th className="p-4">Course Name</th>
              <th className="p-4">Code</th>
              <th className="p-4">Credits</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-midnight-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-400">
                  Loading courses...
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-stone-50 dark:hover:bg-midnight-800/50 transition-colors"
                >
                  <td className="p-4 font-bold text-stone-800 dark:text-white">
                    {c.name}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-stone-100 dark:bg-midnight-800 text-stone-600 dark:text-slate-400 rounded-md text-xs font-mono">
                      {c.code}
                    </span>
                  </td>
                  <td className="p-4 text-stone-600 dark:text-slate-400">
                    {c.creditHours}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
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
        title="Add New Course"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">
              Course Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Data Structures"
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
                Course Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CSC201"
                className="w-full px-3 py-2.5 bg-stone-50 dark:bg-midnight-950 border border-stone-200 dark:border-midnight-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-stone-800 dark:text-white"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">
                Credit Hours
              </label>
              <input
                type="number"
                required
                min="1"
                max="6"
                className="w-full px-3 py-2.5 bg-stone-50 dark:bg-midnight-950 border border-stone-200 dark:border-midnight-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-stone-800 dark:text-white"
                value={formData.creditHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    creditHours: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg mt-2"
          >
            Add Course
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCourses;
