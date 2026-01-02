import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

interface Allocation {
  courseId: number;
  courseName: string;
  courseCode: string;
  sectionId: number;
  sectionName: string;
}

const TeacherDashboard = () => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const res = await api.get("/Teacher/my-allocations");
      setAllocations(res.data);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading classes...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-stone-800 dark:text-white">
        My Classes
      </h2>

      {allocations.length === 0 ? (
        <div className="p-6 bg-white dark:bg-midnight-900 rounded-xl border border-stone-200 dark:border-midnight-800 text-center text-stone-500">
          You have not been assigned any courses yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allocations.map((alloc, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(`/teacher/class/${alloc.courseId}/${alloc.sectionId}`)
              }
              className="group cursor-pointer bg-white dark:bg-midnight-900 p-6 rounded-2xl border border-stone-200 dark:border-midnight-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span className="px-3 py-1 text-xs font-semibold bg-stone-100 dark:bg-midnight-800 rounded-full text-stone-500 dark:text-slate-400">
                  {alloc.courseCode}
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-white mb-1">
                {alloc.courseName}
              </h3>
              <p className="text-stone-500 dark:text-slate-500 text-sm">
                Section:{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {alloc.sectionName}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
