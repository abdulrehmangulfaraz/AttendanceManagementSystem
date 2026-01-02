import { useState } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

const TeacherProfile = () => {
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const { showToast } = useToast();

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/Auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      showToast("Password updated successfully", "success");
      setPasswords({ current: "", new: "" });
    } catch (err: any) {
      showToast(err.response?.data || "Failed to update password", "error");
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-2xl font-bold mb-6 text-stone-800 dark:text-white">
        My Profile
      </h2>
      <div className="bg-white dark:bg-midnight-900 p-8 rounded-xl border border-stone-200 dark:border-midnight-800 shadow-sm">
        <h3 className="text-lg font-bold mb-4 dark:text-white">
          Change Password
        </h3>
        <form onSubmit={handleChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-400">
              Current Password
            </label>
            <input
              type="password"
              required
              className="w-full p-2 rounded border dark:bg-midnight-950 dark:border-midnight-800 dark:text-white"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-slate-400">
              New Password
            </label>
            <input
              type="password"
              required
              className="w-full p-2 rounded border dark:bg-midnight-950 dark:border-midnight-800 dark:text-white"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherProfile;
