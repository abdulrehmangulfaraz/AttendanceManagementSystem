import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/Modal";

const ManageTimetable = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [timetable, setTimetable] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  // Form
  const [isBreak, setIsBreak] = useState(false); // Toggle for Break
  const [formData, setFormData] = useState({
    day: "Monday",
    startTime: "",
    endTime: "",
    room: "",
    courseId: "",
  });

  useEffect(() => {
    api.get("/Admin/sections").then((res) => setSections(res.data));
    api.get("/Admin/courses").then((res) => setCourses(res.data));
  }, []);

  const fetchTimetable = async (sectionId: string) => {
    setSelectedSection(sectionId);
    if (!sectionId) {
      setTimetable([]);
      return;
    }
    const res = await api.get(`/Admin/timetable/${sectionId}`);
    setTimetable(res.data);
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If it is a Break, we don't send a courseId
      const payload = {
        ...formData,
        sectionId: parseInt(selectedSection),
        courseId: isBreak ? null : formData.courseId,
      };

      await api.post("/Admin/timetable", payload);
      setShowModal(false);
      fetchTimetable(selectedSection);
      showToast(isBreak ? "Break added!" : "Class added!", "success");
    } catch {
      showToast("Conflict detected or Error.", "error");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white">
          Timetable Management
        </h2>
        <select
          className="p-2 rounded border dark:bg-midnight-900 dark:text-white"
          onChange={(e) => fetchTimetable(e.target.value)}
        >
          <option value="">Select a Section to View</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSection && (
        <>
          <div className="mb-4">
            <button
              onClick={() => {
                setIsBreak(false);
                setShowModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded shadow"
            >
              + Add Time Slot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (day) => (
                <div
                  key={day}
                  className="bg-white dark:bg-midnight-900 p-4 rounded-xl border border-stone-200 dark:border-midnight-800"
                >
                  <h4 className="font-bold text-stone-500 dark:text-slate-400 mb-3 border-b pb-2">
                    {day}
                  </h4>
                  <div className="space-y-2">
                    {timetable
                      .filter((t) => t.day === day)
                      .map((t) => (
                        <div
                          key={t.id}
                          className={`p-3 rounded-lg border 
                                            ${
                                              t.isBreak
                                                ? "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800"
                                                : "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
                                            }`}
                        >
                          <p
                            className={`font-bold text-sm ${
                              t.isBreak
                                ? "text-green-700 dark:text-green-300"
                                : "text-blue-700 dark:text-blue-300"
                            }`}
                          >
                            {t.courseName}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-slate-400">
                            {t.startTime.slice(0, 5)} - {t.endTime.slice(0, 5)}
                          </p>
                          {!t.isBreak && (
                            <p className="text-xs font-mono mt-1 text-stone-400">
                              Rm: {t.room}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Time Slot"
      >
        <form onSubmit={handleAddClass} className="space-y-4">
          {/* Break Toggle */}
          <div className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-midnight-950 rounded-lg border border-stone-200 dark:border-midnight-800">
            <input
              type="checkbox"
              id="breakToggle"
              checked={isBreak}
              onChange={(e) => setIsBreak(e.target.checked)}
              className="w-5 h-5 accent-green-600"
            />
            <label
              htmlFor="breakToggle"
              className="text-sm font-bold text-stone-700 dark:text-white cursor-pointer"
            >
              Mark as Break / Free Time
            </label>
          </div>

          {/* Course Selection (Disabled if Break) */}
          {!isBreak && (
            <select
              className="w-full p-2 border rounded dark:bg-midnight-950 dark:text-white"
              value={formData.courseId}
              onChange={(e) =>
                setFormData({ ...formData, courseId: e.target.value })
              }
              required={!isBreak}
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <select
            className="w-full p-2 border rounded dark:bg-midnight-950 dark:text-white"
            value={formData.day}
            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
          >
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              )
            )}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="time"
              className="p-2 border rounded dark:bg-midnight-950 dark:text-white"
              required
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
            />
            <input
              type="time"
              className="p-2 border rounded dark:bg-midnight-950 dark:text-white"
              required
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
            />
          </div>

          {!isBreak && (
            <input
              type="text"
              placeholder="Room No"
              className="w-full p-2 border rounded dark:bg-midnight-950 dark:text-white"
              required={!isBreak}
              value={formData.room}
              onChange={(e) =>
                setFormData({ ...formData, room: e.target.value })
              }
            />
          )}

          <button
            className={`w-full py-3 text-white font-bold rounded shadow-lg ${
              isBreak
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isBreak ? "Add Break" : "Save Class"}
          </button>
        </form>
      </Modal>
    </div>
  );
};
export default ManageTimetable;
