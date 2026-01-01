import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

const ManageAllocations = () => {
  const [allocations, setAllocations] = useState<{
    teachers: any[];
    students: any[];
  }>({ teachers: [], students: [] });
  const { showToast } = useToast();

  // Data for Dropdowns
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  // Form States
  const [teacherForm, setTeacherForm] = useState({
    teacherId: "",
    courseId: "",
    sectionId: "",
  });
  const [studentForm, setStudentForm] = useState({
    studentId: "",
    courseId: "",
    sectionId: "",
  });

  useEffect(() => {
    fetchData();
    fetchDropdowns();
  }, []);

  const fetchData = async () => {
    const res = await api.get("/Admin/assignments");
    setAllocations(res.data);
  };

  const fetchDropdowns = async () => {
    const [uRes, cRes, sRes] = await Promise.all([
      api.get("/Admin/users"),
      api.get("/Admin/courses"),
      api.get("/Admin/sections"),
    ]);

    setTeachers(uRes.data.filter((u: any) => u.role === "Teacher"));
    setStudents(uRes.data.filter((u: any) => u.role === "Student"));
    setCourses(cRes.data);
    setSections(sRes.data);
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. CHECK: Is a teacher already assigned to this Course + Section?
    const alreadyAssigned = allocations.teachers.find(
      (t) =>
        t.courseId === parseInt(teacherForm.courseId) &&
        t.sectionId === parseInt(teacherForm.sectionId)
    );

    if (alreadyAssigned) {
      showToast(
        `Error: ${alreadyAssigned.name} is already teaching this course for this section.`,
        "error"
      );
      return; // Stop execution
    }

    try {
      await api.post("/Admin/assign-teacher", teacherForm);
      showToast("Teacher Assigned Successfully!", "success");
      fetchData();
      // Optional: Reset form
    } catch {
      showToast("Failed to assign teacher.", "error");
    }
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/Admin/enroll-student", studentForm);
      showToast("Student Enrolled!", "success");
      fetchData();
    } catch {
      showToast("Failed to enroll student.", "error");
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <h2 className="text-xl font-bold dark:text-white">
        Allocations & Enrollments
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Teacher Assignment Card */}
        <div className="p-6 bg-white dark:bg-midnight-900 rounded-2xl border border-blue-100 dark:border-midnight-800 shadow-sm">
          <h3 className="font-bold text-blue-600 mb-4">
            Assign Teacher to Course
          </h3>
          <form onSubmit={handleAssignTeacher} className="space-y-3">
            <select
              className="w-full p-2 rounded border dark:bg-midnight-950 dark:text-white"
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, teacherId: e.target.value })
              }
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 rounded border dark:bg-midnight-950 dark:text-white"
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, courseId: e.target.value })
              }
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 rounded border dark:bg-midnight-950 dark:text-white"
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, sectionId: e.target.value })
              }
              required
            >
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">
              Assign Teacher
            </button>
          </form>
        </div>

        {/* Student Enrollment Card */}
        <div className="p-6 bg-white dark:bg-midnight-900 rounded-2xl border border-green-100 dark:border-midnight-800 shadow-sm">
          <h3 className="font-bold text-green-600 mb-4">
            Enroll Student in Course
          </h3>
          <form onSubmit={handleEnrollStudent} className="space-y-3">
            <select
              className="w-full p-2 rounded border dark:bg-midnight-950 dark:text-white"
              onChange={(e) =>
                setStudentForm({ ...studentForm, studentId: e.target.value })
              }
              required
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 rounded border dark:bg-midnight-950 dark:text-white"
              onChange={(e) =>
                setStudentForm({ ...studentForm, courseId: e.target.value })
              }
              required
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 rounded border dark:bg-midnight-950 dark:text-white"
              onChange={(e) =>
                setStudentForm({ ...studentForm, sectionId: e.target.value })
              }
              required
            >
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button className="w-full py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700">
              Enroll Student
            </button>
          </form>
        </div>
      </div>

      {/* List of Allocations */}
      <div className="bg-white dark:bg-midnight-900 rounded-2xl border border-stone-200 dark:border-midnight-800 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 dark:bg-midnight-950 text-xs font-bold uppercase dark:text-slate-400">
              <th className="p-4">Type</th>
              <th className="p-4">Name</th>
              <th className="p-4">Course</th>
              <th className="p-4">Section</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-midnight-800">
            {allocations.teachers.map((t: any) => (
              <tr key={"t" + t.id}>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    Teacher
                  </span>
                </td>
                <td className="p-4 dark:text-white">{t.name}</td>
                <td className="p-4 dark:text-white">{t.course}</td>
                <td className="p-4 dark:text-white">{t.section}</td>
              </tr>
            ))}
            {allocations.students.map((s: any) => (
              <tr key={"s" + s.id}>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    Student
                  </span>
                </td>
                <td className="p-4 dark:text-white">{s.name}</td>
                <td className="p-4 dark:text-white">{s.course}</td>
                <td className="p-4 dark:text-white">{s.section}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ManageAllocations;
