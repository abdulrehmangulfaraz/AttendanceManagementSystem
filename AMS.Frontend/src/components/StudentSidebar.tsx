import { Link, useLocation } from "react-router-dom";

const StudentSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: "/student",
      label: "My Courses",
      icon: /* Book Icon */ <span className="text-xl">📚</span>,
    },
    {
      path: "/student/reports",
      label: "Attendance Report",
      icon: /* Chart Icon */ <span className="text-xl">📊</span>,
    },
    {
      path: "/student/profile",
      label: "My Profile",
      icon: /* User Icon */ <span className="text-xl">👤</span>,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-stone-50 dark:bg-midnight-950 border-r border-stone-200 dark:border-midnight-800 transition-colors duration-500 z-30">
      <div className="flex items-center justify-center h-20 border-b border-stone-200 dark:border-midnight-800">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          AMS Student
        </h1>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                        ${
                          isActive(item.path)
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                            : "text-stone-600 dark:text-slate-400 hover:bg-white dark:hover:bg-midnight-900 hover:shadow-md"
                        }`}
          >
            {item.icon}
            <span className="ml-3 font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default StudentSidebar;
