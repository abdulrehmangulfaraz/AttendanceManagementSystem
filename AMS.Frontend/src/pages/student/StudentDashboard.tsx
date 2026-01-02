import { useEffect, useState } from "react";
import api from "../../api/axios";

const StudentDashboard = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/Student/my-courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="p-6 text-stone-500">Loading courses...</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-stone-800 dark:text-white">
        My Registered Courses
      </h2>

      {courses.length === 0 ? (
        <div className="p-8 bg-white dark:bg-midnight-900 rounded-xl border border-stone-200 dark:border-midnight-800 text-center text-stone-500">
          You are not enrolled in any courses yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white dark:bg-midnight-900 p-6 rounded-2xl border border-stone-200 dark:border-midnight-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <span className="text-2xl">📖</span>
                </div>
                <span className="px-3 py-1 text-xs font-semibold bg-stone-100 dark:bg-midnight-800 rounded-full text-stone-500 dark:text-slate-400">
                  {course.courseCode}
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-white mb-1">
                {course.courseName}
              </h3>
              <p className="text-sm text-stone-500 dark:text-slate-500 mb-4">
                Section:{" "}
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  {course.sectionName}
                </span>
              </p>

              <div className="pt-4 border-t border-stone-100 dark:border-midnight-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-midnight-800 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-400">
                  {course.teacherName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-stone-400 uppercase font-bold">
                    Instructor
                  </p>
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    {course.teacherName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
