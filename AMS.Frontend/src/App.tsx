import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardHome />} />
              {/* Future routes: users, courses, etc. */}
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
