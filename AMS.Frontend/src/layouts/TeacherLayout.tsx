import { Outlet, useNavigate } from "react-router-dom";
import TeacherSidebar from "../components/TeacherSidebar";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const TeacherLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-stone-50 dark:bg-black text-stone-800 dark:text-slate-200 transition-colors duration-500 font-sans">
      <TeacherSidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-stone-200 dark:border-midnight-800 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">
              Hello, {user?.name}
            </h2>
            <p className="text-sm text-stone-500 dark:text-slate-500">
              Manage your classes and attendance.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-midnight-800 transition"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/20 transition"
            >
              Logout
            </button>
          </div>
        </header>
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
