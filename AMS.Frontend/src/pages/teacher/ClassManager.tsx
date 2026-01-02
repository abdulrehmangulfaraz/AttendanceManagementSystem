import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

interface Student {
  studentId: number;
  studentName: string;
  studentEmail: string;
}

interface AttendanceHistory {
  studentName: string;
  date: string;
  status: string;
}

const ClassManager = () => {
  const { courseId, sectionId } = useParams();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"mark" | "history">("mark");
  const [students, setStudents] = useState<Student[]>([]);
  const [history, setHistory] = useState<AttendanceHistory[]>([]);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState<Record<number, boolean>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "mark") fetchStudents();
    else fetchHistory();
  }, [activeTab, courseId, sectionId]);

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/Teacher/students/${courseId}/${sectionId}`);
      setStudents(res.data);
      // Initialize all as present (true) by default
      const initialStatus: Record<number, boolean> = {};
      res.data.forEach((s: Student) => (initialStatus[s.studentId] = true));
      setAttendanceData(initialStatus);
    } catch (err) {
      console.error(err);
      showToast("Failed to load students", "error");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/Teacher/attendance/${courseId}/${sectionId}`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Send requests in parallel or sequence. Parallel is faster.
      const promises = students.map((student) => {
        return api.post("/Teacher/mark-attendance", {
          studentId: student.studentId,
          courseId: Number(courseId),
          sectionId: Number(sectionId),
          date: date,
          isPresent: attendanceData[student.studentId],
        });
      });

      await Promise.all(promises);
      showToast("Attendance marked successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to mark attendance", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (studentId: number) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-white">
          Class Management
        </h2>
        <div className="flex bg-white dark:bg-midnight-900 rounded-lg p-1 border border-stone-200 dark:border-midnight-800">
          <button
            onClick={() => setActiveTab("mark")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "mark"
                ? "bg-green-600 text-white shadow-md"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-white"
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "history"
                ? "bg-green-600 text-white shadow-md"
                : "text-stone-500 hover:text-stone-800 dark:hover:text-white"
            }`}
          >
            View History
          </button>
        </div>
      </div>

      {activeTab === "mark" ? (
        <div className="bg-white dark:bg-midnight-900 rounded-xl border border-stone-200 dark:border-midnight-800 p-6 shadow-sm animate-fade-in">
          <div className="mb-6">
            <label className="block text-sm font-bold text-stone-600 dark:text-slate-400 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 rounded-lg border border-stone-200 dark:border-midnight-800 bg-stone-50 dark:bg-midnight-950 text-stone-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.studentId}
                className="flex items-center justify-between p-4 bg-stone-50 dark:bg-midnight-950 rounded-lg border border-stone-100 dark:border-midnight-800"
              >
                <div>
                  <p className="font-bold text-stone-800 dark:text-white">
                    {student.studentName}
                  </p>
                  <p className="text-xs text-stone-500">
                    {student.studentEmail}
                  </p>
                </div>
                <button
                  onClick={() => toggleStatus(student.studentId)}
                  className={`w-24 py-2 rounded-lg font-bold text-sm transition-all ${
                    attendanceData[student.studentId]
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
                  }`}
                >
                  {attendanceData[student.studentId] ? "Present" : "Absent"}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-midnight-900 rounded-xl border border-stone-200 dark:border-midnight-800 overflow-hidden animate-fade-in">
          <table className="w-full text-left">
            <thead className="bg-stone-50 dark:bg-midnight-950 border-b border-stone-200 dark:border-midnight-800">
              <tr>
                <th className="p-4 text-sm font-bold text-stone-500 dark:text-slate-400">
                  Date
                </th>
                <th className="p-4 text-sm font-bold text-stone-500 dark:text-slate-400">
                  Student
                </th>
                <th className="p-4 text-sm font-bold text-stone-500 dark:text-slate-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-midnight-800">
              {history.map((record, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-stone-50 dark:hover:bg-midnight-800/50 transition"
                >
                  <td className="p-4 text-stone-800 dark:text-slate-300">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-stone-800 dark:text-white font-medium">
                    {record.studentName}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 && (
            <p className="p-8 text-center text-stone-500">
              No attendance records found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassManager;
