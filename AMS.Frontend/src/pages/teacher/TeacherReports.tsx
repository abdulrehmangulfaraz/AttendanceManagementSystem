import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TeacherReports = () => {
  const { showToast } = useToast();

  // State
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  // Default: Last 30 days
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [reportData, setReportData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load courses
    api.get("/Teacher/my-allocations").then((res) => {
      setCourses(res.data);
      if (res.data.length > 0) setSelectedCourse(res.data[0].courseId);
    });
  }, []);

  useEffect(() => {
    if (selectedCourse) fetchReport();
  }, [selectedCourse, startDate, endDate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/Teacher/reports?courseId=${selectedCourse}&startDate=${startDate}&endDate=${endDate}`
      );
      setReportData(res.data);

      // Prepare Chart Data
      const cData = res.data.Chart || [];
      setChartData({
        labels: cData.map((d: any) => d.date),
        datasets: [
          {
            label: "Present",
            data: cData.map((d: any) => d.present),
            backgroundColor: "rgba(34, 197, 94, 0.6)",
          },
          {
            label: "Absent",
            data: cData.map((d: any) => d.absent),
            backgroundColor: "rgba(239, 68, 68, 0.6)",
          },
        ],
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch report", "error");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const courseName =
      courses.find((c) => c.courseId === selectedCourse)?.courseName ||
      "Course";

    // 1. Title
    doc.setFontSize(18);
    doc.text(`Attendance Report: ${courseName}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`From: ${startDate} To: ${endDate}`, 14, 30);

    // 2. Add Chart (Convert Canvas to Image)
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const chartImg = canvas.toDataURL("image/png");
      doc.addImage(chartImg, "PNG", 14, 40, 180, 80);
    }

    // 3. Add Table
    autoTable(doc, {
      startY: 130,
      head: [["Student Name", "Present", "Absent", "Percentage"]],
      body: (reportData.Table || []).map((row: any) => [
        row.studentName,
        row.totalPresent,
        row.totalAbsent,
        `${row.percentage.toFixed(1)}%`,
      ]),
    });

    doc.save(`Attendance_Report_${courseName}.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-white">
          Attendance Reports
        </h2>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1">
              Course
            </label>
            <select
              className="p-2 rounded border dark:bg-midnight-900 dark:text-white dark:border-midnight-800"
              value={selectedCourse || ""}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
            >
              {courses.map((c) => (
                <option key={c.courseId} value={c.courseId}>
                  {c.courseName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1">
              From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 rounded border dark:bg-midnight-900 dark:text-white dark:border-midnight-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1">
              To
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 rounded border dark:bg-midnight-900 dark:text-white dark:border-midnight-800"
            />
          </div>

          <button
            onClick={downloadPDF}
            disabled={!reportData}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 h-[42px] disabled:opacity-50"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-midnight-900 p-6 rounded-xl border border-stone-200 dark:border-midnight-800 shadow-sm mb-6 h-[400px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-stone-400">
            Loading Chart...
          </div>
        ) : chartData ? (
          <Bar
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-stone-400">
            No data available
          </div>
        )}
      </div>

      {/* Summary Table */}
      <div className="bg-white dark:bg-midnight-900 rounded-xl border border-stone-200 dark:border-midnight-800 overflow-hidden">
        <h3 className="p-4 font-bold border-b border-stone-200 dark:border-midnight-800 dark:text-white">
          Student Summary
        </h3>
        <table className="w-full text-left">
          <thead className="bg-stone-50 dark:bg-midnight-950">
            <tr>
              <th className="p-4 text-sm font-bold text-stone-500 dark:text-slate-400">
                Student Name
              </th>
              <th className="p-4 text-sm font-bold text-stone-500 dark:text-slate-400">
                Total Present
              </th>
              <th className="p-4 text-sm font-bold text-stone-500 dark:text-slate-400">
                Total Absent
              </th>
              <th className="p-4 text-sm font-bold text-stone-500 dark:text-slate-400">
                Attendance %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-midnight-800">
            {/* SAFE GUARD: Added '?.' and '|| []' to prevent crash if data is null */}
            {reportData?.Table?.map((row: any, idx: number) => (
              <tr
                key={idx}
                className="hover:bg-stone-50 dark:hover:bg-midnight-800/50"
              >
                <td className="p-4 dark:text-white">{row.studentName}</td>
                <td className="p-4 text-green-600 font-bold">
                  {row.totalPresent}
                </td>
                <td className="p-4 text-red-600 font-bold">
                  {row.totalAbsent}
                </td>
                <td className="p-4 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">
                      {row.percentage.toFixed(1)}%
                    </span>
                    <div className="w-20 h-2 bg-stone-200 dark:bg-midnight-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          row.percentage >= 75 ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${row.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {!loading &&
              (!reportData?.Table || reportData.Table.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-stone-500">
                    No student records found for this period.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherReports;
