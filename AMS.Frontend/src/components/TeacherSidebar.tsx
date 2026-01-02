import { Link, useLocation } from "react-router-dom";

const TeacherSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: "/teacher",
      label: "My Classes",
      icon: /* Class Icon */ <span className="text-xl">📚</span>,
    },
    {
      path: "/teacher/timetable",
      label: "My Timetable",
      icon: /* Calendar Icon */ <span className="text-xl">📅</span>,
    },
    {
      path: "/teacher/reports",
      label: "Reports",
      icon: /* Chart Icon */ <span className="text-xl">📊</span>,
    },
    {
      path: "/teacher/profile",
      label: "Profile",
      icon: /* User Icon */ <span className="text-xl">👤</span>,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-stone-50 dark:bg-midnight-950 border-r border-stone-200 dark:border-midnight-800 transition-colors duration-500 z-30">
      <div className="flex items-center justify-center h-20 border-b border-stone-200 dark:border-midnight-800">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
          AMS Teacher
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
                            ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
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

export default TeacherSidebar;
