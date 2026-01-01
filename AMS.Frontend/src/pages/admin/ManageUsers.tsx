import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/Modal"; // <--- Import the new Modal

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/Admin/users");
      setUsers(res.data);
    } catch (error) {
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/Auth/register", formData);
      setShowModal(false);
      setFormData({ name: "", email: "", password: "", role: "Student" });
      fetchUsers();
      showToast("User created successfully!", "success");
    } catch (error) {
      showToast("Failed to create user. Email might be taken.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/Admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      showToast("User deleted successfully.", "success");
    } catch (error) {
      showToast("Failed to delete user.", "error");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      case "Teacher":
        return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-white">
            User Management
          </h2>
          <p className="text-sm text-stone-500 dark:text-slate-400">
            Create, view, and manage system accounts.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span>+</span> Add User
        </button>
      </div>

      <div className="bg-white dark:bg-midnight-900 rounded-2xl border border-stone-200 dark:border-midnight-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-midnight-950 border-b border-stone-200 dark:border-midnight-800 text-xs uppercase text-stone-500 dark:text-slate-400 font-semibold tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-midnight-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    Loading users...
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-stone-50 dark:hover:bg-midnight-800/50 transition-colors"
                  >
                    <td className="p-4 text-stone-600 dark:text-slate-400 text-sm">
                      #{user.id}
                    </td>
                    <td className="p-4 font-bold text-stone-800 dark:text-white">
                      {user.name}
                    </td>
                    <td className="p-4 text-stone-600 dark:text-slate-400 text-sm">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
      </div>

      {/* NEW MODAL IMPLEMENTATION */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New User"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2.5 bg-stone-50 dark:bg-midnight-950 border border-stone-200 dark:border-midnight-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-stone-800 dark:text-white"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2.5 bg-stone-50 dark:bg-midnight-950 border border-stone-200 dark:border-midnight-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-stone-800 dark:text-white"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2.5 bg-stone-50 dark:bg-midnight-950 border border-stone-200 dark:border-midnight-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-stone-800 dark:text-white"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-slate-400 uppercase mb-1">
              Role
            </label>
            <select
              className="w-full px-3 py-2.5 bg-stone-50 dark:bg-midnight-950 border border-stone-200 dark:border-midnight-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-stone-800 dark:text-white"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all mt-2"
          >
            Create Account
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageUsers;
