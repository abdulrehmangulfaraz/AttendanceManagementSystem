import { useEffect, useState } from "react";
import api from "../../api/axios";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    totalCourses: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Stat Card 1 */}
        <div className="p-6 rounded-2xl bg-white dark:bg-midnight-900 border border-stone-200 dark:border-midnight-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-stone-500 dark:text-slate-400 font-medium">
              Total Users
            </h3>
            <span className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
              👥
            </span>
          </div>
          <p className="text-3xl font-bold text-stone-800 dark:text-white">
            {stats.totalUsers}
          </p>
          <p className="text-xs text-green-500 mt-2">Active in system</p>
        </div>

        {/* Stat Card 2 */}
        <div className="p-6 rounded-2xl bg-white dark:bg-midnight-900 border border-stone-200 dark:border-midnight-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-stone-500 dark:text-slate-400 font-medium">
              Active Sessions
            </h3>
            <span className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
              📅
            </span>
          </div>
          <p className="text-3xl font-bold text-stone-800 dark:text-white">
            {stats.activeSessions}
          </p>
          <p className="text-xs text-stone-400 mt-2">Current Semester</p>
        </div>

        {/* Stat Card 3 */}
        <div className="p-6 rounded-2xl bg-white dark:bg-midnight-900 border border-stone-200 dark:border-midnight-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-stone-500 dark:text-slate-400 font-medium">
              Courses
            </h3>
            <span className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
              📚
            </span>
          </div>
          <p className="text-3xl font-bold text-stone-800 dark:text-white">
            {stats.totalCourses}
          </p>
          <p className="text-xs text-green-500 mt-2">Total subjects</p>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="p-8 rounded-2xl bg-white dark:bg-midnight-900 border border-stone-200 dark:border-midnight-800 shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-stone-800 dark:text-white">
          System Status
        </h3>
        <p className="text-stone-500 dark:text-slate-400">
          System is running smoothly. Select an option from the sidebar to
          manage data.
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
