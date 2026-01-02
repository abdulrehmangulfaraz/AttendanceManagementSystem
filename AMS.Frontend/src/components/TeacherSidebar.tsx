import { Link, useLocation } from "react-router-dom";

const TeacherSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: "/teacher",
      label: "My Classes",
      icon: (
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    // Add Profile or other teacher links here if needed
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-stone-50 dark:bg-midnight-950 border-r border-stone-200 dark:border-midnight-800 transition-colors duration-500 z-30">
      <div className="flex items-center justify-center h-20 border-b border-stone-200 dark:border-midnight-800">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
          AMS Teacher
        </h1>
      </div>
      <nav className="p-4 space-y-1">
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
