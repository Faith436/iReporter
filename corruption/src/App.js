import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";

// Simple App without UserContext for debugging
function App() {
  // Debug: Check what's in localStorage
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    console.log("🔍 Debug - Current user in localStorage:", user);
    console.log("🔍 Debug - Current URL:", window.location.href);
  }, []);

  // Simple check for logged-in user
  const isLoggedIn = () => {
    const user = localStorage.getItem("loggedInUser");
    return user !== null && user !== "null" && user !== "undefined";
  };

  return (
    <Router>
      <Routes>
        {/* Public routes - always accessible */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes - only if logged in */}
        <Route path="/dashboard" element={
          isLoggedIn() ? <DashboardLayout /> : <Navigate to="/login" replace />
        }>
          <Route index element={<UserDashboard />} />
          <Route path="reports" element={<Reports/>} />
          <Route path="notifications" element={<div>Notifications Page</div>} />
        </Route>

        <Route path="/admin" element={
          isLoggedIn() ? <DashboardLayout /> : <Navigate to="/login" replace />
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="reports" element={<Reports/>} />
          <Route path="notifications" element={<div>Notifications Page</div>} />
        </Route>

        {/* Catch-all - redirect based on login status */}
        <Route path="*" element={
          isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
