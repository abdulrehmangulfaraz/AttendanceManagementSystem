import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext"; // <--- Import
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import ManageUsers from "./pages/admin/ManageUsers";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        {" "}
        {/* <--- Add Wrapper */}
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="users" element={<ManageUsers />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
