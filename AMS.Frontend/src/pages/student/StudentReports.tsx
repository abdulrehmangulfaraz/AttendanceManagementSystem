import { useEffect, useState } from "react";
import api from "../../api/axios";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StudentReports = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/Student/report?startDate=${startDate}&endDate=${endDate}`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Chart Data Preparation
  const chartData = {
    labels: data?.summary?.map((s: any) => s.courseName) || [],
    datasets: [
      {
        label: "Attendance %",
        data: data?.summary?.map((s: any) => s.percentage) || [],
        backgroundColor: data?.summary?.map((s: any) =>
          s.percentage >= 75
            ? "rgba(34, 197, 94, 0.6)"
            : "rgba(239, 68, 68, 0.6)"
        ),
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-stone-800 dark:text-white">
          Attendance Report
        </h2>
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 rounded border dark:bg-midnight-900 dark:text-white dark:border-midnight-800"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 rounded border dark:bg-midnight-900 dark:text-white dark:border-midnight-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Summary Chart */}
        <div className="bg-white dark:bg-midnight-900 p-6 rounded-xl border border-stone-200 dark:border-midnight-800 shadow-sm">
          <h3 className="font-bold mb-4 dark:text-white">
            Overall Performance
          </h3>
          <div className="h-64">
            {data?.summary && (
              <Bar
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  scales: { y: { max: 100 } },
                }}
              />
            )}
          </div>
        </div>

        {/* Course Summary Cards */}
        <div className="space-y-3 overflow-y-auto max-h-[340px]">
          {data?.summary?.map((course: any, idx: number) => (
            <div
              key={idx}
              className="bg-white dark:bg-midnight-900 p-4 rounded-xl border border-stone-200 dark:border-midnight-800 flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-stone-800 dark:text-white">
                  {course.courseName}
                </p>
                <p className="text-xs text-stone-500">
                  Present: {course.present} | Absent: {course.absent}
                </p>
              </div>
              <div
                className={`text-lg font-bold ${
                  course.percentage >= 75 ? "text-green-600" : "text-red-600"
                }`}
              >
                {course.percentage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white dark:bg-midnight-900 rounded-xl border border-stone-200 dark:border-midnight-800 overflow-hidden">
        <h3 className="p-4 font-bold border-b border-stone-200 dark:border-midnight-800 dark:text-white">
          Detailed History
        </h3>
        <table className="w-full text-left">
          <thead className="bg-stone-50 dark:bg-midnight-950">
            <tr>
              <th className="p-4 text-sm font-bold text-stone-500 dark:text-slate-400">
                Date
              </th>
              <th className="p-4 text-sm font-bold text-stone-500 dark:text-slate-400">
                Course
              </th>
              <th className="p-4 text-sm font-bold text-stone-500 dark:text-slate-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-midnight-800">
            {data?.records?.map((record: any, idx: number) => (
              <tr
                key={idx}
                className="hover:bg-stone-50 dark:hover:bg-midnight-800/50"
              >
                <td className="p-4 dark:text-slate-300">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="p-4 font-medium dark:text-white">
                  {record.courseName}
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
            {(!data?.records || data.records.length === 0) && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-stone-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentReports;
