import { useEffect, useState } from "react";
import api from "../../api/axios";

interface TimetableEntry {
  day: string;
  startTime: string;
  endTime: string;
  courseName: string;
  sectionName: string;
  room: string;
}

const TeacherTimetable = () => {
  const [schedule, setSchedule] = useState<TimetableEntry[]>([]);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    api.get("/Teacher/my-timetable").then((res) => setSchedule(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-stone-800 dark:text-white">
        Weekly Schedule
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((day) => (
          <div
            key={day}
            className="bg-white dark:bg-midnight-900 border border-stone-200 dark:border-midnight-800 rounded-xl p-4"
          >
            <h3 className="font-bold text-center mb-4 text-green-600">{day}</h3>
            <div className="space-y-3">
              {schedule
                .filter((s) => s.day === day)
                .map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 dark:bg-midnight-950 rounded-lg text-sm border-l-4 border-green-500"
                  >
                    <p className="font-bold text-stone-800 dark:text-white">
                      {entry.courseName}
                    </p>
                    <p className="text-xs text-stone-500">
                      {entry.sectionName}
                    </p>
                    <p className="text-xs font-mono mt-1">
                      {entry.startTime} - {entry.endTime}
                    </p>
                    <span className="text-[10px] bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-400">
                      Room {entry.room}
                    </span>
                  </div>
                ))}
              {schedule.filter((s) => s.day === day).length === 0 && (
                <p className="text-center text-xs text-stone-400 italic">
                  No classes
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherTimetable;
