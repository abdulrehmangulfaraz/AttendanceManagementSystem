import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import Login from "./pages/Login";
import TeacherTimetable from "./pages/teacher/TeacherTimetable";
import TeacherReports from "./pages/teacher/TeacherReports";
import TeacherProfile from "./pages/teacher/TeacherProfile";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import TeacherLayout from "./layouts/TeacherLayout"; // <--- Import

// Admin Pages
import DashboardHome from "./pages/admin/DashboardHome";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageSessions from "./pages/admin/ManageSessions";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageAllocations from "./pages/admin/ManageAllocations";
import ManageTimetable from "./pages/admin/ManageTimetable";
import ManageSections from "./pages/admin/ManageSections";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard"; // <--- Import
import ClassManager from "./pages/teacher/ClassManager"; // <--- Import

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="sessions" element={<ManageSessions />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="sections" element={<ManageSections />} />
                <Route path="allocations" element={<ManageAllocations />} />
                <Route path="timetable" element={<ManageTimetable />} />
              </Route>

              {/* Teacher Routes */}
              <Route path="/teacher" element={<TeacherLayout />}>
                <Route index element={<TeacherDashboard />} />
                <Route
                  path="class/:courseId/:sectionId"
                  element={<ClassManager />}
                />
                <Route path="timetable" element={<TeacherTimetable />} />
                <Route path="reports" element={<TeacherReports />} />
                <Route path="profile" element={<TeacherProfile />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
