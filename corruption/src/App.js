import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import AdminReports from "./pages/AdminReports";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Registration from "./pages/Registration";
import Notifications from "./pages/Notifications";
import { useUsers } from "./contexts/UserContext";
import { Toaster } from "react-hot-toast";
import API_BASE_URL from './config/api';
import FirstLoginModal from "./components/FirstLoginPopup";

function App() {
  const { currentUser, loading, showFirstLogin, markFirstLoginSeen } = useUsers();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  console.log("API Base URL:", API_BASE_URL);

  // --- Protected route ---
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      return currentUser.role === "admin" ? (
        <Navigate to="/admin" replace />
      ) : (
        <Navigate to="/dashboard" replace />
      );
    }
    return children;
  };

  // --- Public route ---
  const PublicRoute = ({ children }) => {
    if (currentUser) {
      return currentUser.role === "admin" ? (
        <Navigate to="/admin" replace />
      ) : (
        <Navigate to="/dashboard" replace />
      );
    }
    return children;
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* First-login modal */}
      {showFirstLogin && (
        <FirstLoginModal onClose={markFirstLoginSeen} />
      )}

      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/registration" element={<PublicRoute><Registration /></PublicRoute>} />

          {/* User dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<UserDashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Admin dashboard */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={
            !currentUser ? <Navigate to="/" replace /> :
            currentUser.role === "admin" ? <Navigate to="/admin" replace /> :
            <Navigate to="/dashboard" replace />
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
