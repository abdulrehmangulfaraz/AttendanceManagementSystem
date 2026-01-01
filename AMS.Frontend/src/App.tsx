import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageSessions from "./pages/admin/ManageSessions"; // <--- New
import ManageCourses from "./pages/admin/ManageCourses"; // <--- New

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="sessions" element={<ManageSessions />} />{" "}
                {/* Route */}
                <Route path="courses" element={<ManageCourses />} />{" "}
                {/* Route */}
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
