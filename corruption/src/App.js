import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import { useUsers } from "./contexts/UserContext";

function App() {
  const { currentUser } = useUsers();

  // Redirect helper
  const RedirectByRole = () => {
    if (!currentUser) return <Navigate to="/" replace />;
    return currentUser.role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Role-based redirect if path is /home */}
        <Route path="/home" element={<RedirectByRole />} />

        {/* User Dashboard layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="reports" element={<Reports/>} />
          <Route path="notifications" element={<div>Notifications Page</div>} />
        </Route>

        {/* Admin Dashboard layout */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="reports" element={<Reports/>} />
          <Route path="notifications" element={<div>Notifications Page</div>} />
        </Route>

        {/* Catch-all redirects */}
        <Route path="*" element={<RedirectByRole />} />
      </Routes>
    </Router>
  );
}

export default App;
