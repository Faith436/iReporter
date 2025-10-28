import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";

function App() {
  // Debug: check localStorage
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    console.log("🔍 Current user:", user);
  }, []);

  // Get logged-in user
  const getLoggedInUser = () => {
    const user = localStorage.getItem("loggedInUser");
    return user ? JSON.parse(user) : null;
  };

  // Protect route by role
  const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = getLoggedInUser();
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<UserDashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<div>Notifications Page</div>} />
        </Route>

        {/* Admin dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<div>Notifications Page</div>} />
        </Route>

        {/* Catch-all: redirect based on role */}
        <Route path="*" element={
          (() => {
            const user = getLoggedInUser();
            if (!user) return <Navigate to="/" replace />;
            return user.role === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
          })()
        } />
      </Routes>
    </Router>
  );
}

export default App;
