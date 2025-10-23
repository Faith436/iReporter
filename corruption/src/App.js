import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateReport from "./pages/CreateReport";
import MyReports from "./components/MyReports";
import MapPreview from "./components/MapPreview";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

/* ===================== AUTH CONTEXT ===================== */
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("ireporter-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Error parsing saved user:", err);
        localStorage.removeItem("ireporter-user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userWithRole = {
      ...userData,
      role: userData.role || "user",
      id: userData.id || Date.now(),
    };
    setUser(userWithRole);
    localStorage.setItem("ireporter-user", JSON.stringify(userWithRole));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ireporter-user");
  };

  const isAdmin = () => user && user.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ===================== REPORTS CONTEXT ===================== */
const ReportsContext = createContext(null);

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) throw new Error("useReports must be used within ReportsProvider");
  return context;
};

const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load saved data
  useEffect(() => {
    try {
      const savedReports = localStorage.getItem("ireporter-reports");
      const savedNotifications = localStorage.getItem("ireporter-notifications");
      if (savedReports) setReports(JSON.parse(savedReports));
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    } catch (err) {
      console.error("Error loading local data:", err);
    }
  }, []);

  // Save updates
  useEffect(() => {
    localStorage.setItem("ireporter-reports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem("ireporter-notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Create report
  const createReport = (reportData) => {
    const newReport = {
      id: Date.now().toString(),
      ...reportData,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminNotes: "",
    };
    setReports((prev) => [newReport, ...prev]);

    // Create admin notification
    const adminNotification = {
      id: Date.now().toString(),
      type: "new_report",
      message: `New redflag submitted by ${reportData.userName}`,
      reportId: newReport.id,
      userId: reportData.userId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [adminNotification, ...prev]);

    return newReport;
  };

  const updateReportStatus = (reportId, newStatus, adminNotes = "", adminName = "Admin") => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: newStatus, adminNotes, updatedAt: new Date().toISOString() } : r
      )
    );

    const report = reports.find((r) => r.id === reportId);
    if (report) {
      const userNotification = {
        id: Date.now().toString(),
        type: "status_update",
        message: `Your redflag status has been updated to "${newStatus}" by ${adminName}`,
        reportId,
        userId: report.userId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [userNotification, ...prev]);
    }
  };

  const getUserReports = (userId) => reports.filter((r) => r.userId === userId);
  const getUserNotifications = (userId) => notifications.filter((n) => n.userId === userId);
  const markNotificationAsRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  const markAllNotificationsAsRead = (userId) =>
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId && !n.isRead ? { ...n, isRead: true } : n))
    );

  return (
    <ReportsContext.Provider
      value={{
        reports,
        notifications,
        createReport,
        updateReportStatus,
        getUserReports,
        getUserNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

/* ===================== ROUTE PROTECTORS ===================== */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin()) return <Navigate to="/dashboard" />;
  return children;
};

const AuthPublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  // 🚫 FIXED: only redirect if logged in and not clicking from LandingPage
  if (user) return <Navigate to="/dashboard" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return children;
};

/* ===================== MAIN APP ===================== */
function App() {
  return (
    <AuthProvider>
      <ReportsProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            
            {/* Auth */}
            <Route path="/login" element={<AuthPublicRoute><Login /></AuthPublicRoute>} />
            <Route path="/signup" element={<AuthPublicRoute><Signup /></AuthPublicRoute>} />
            
            {/* User Protected */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create-report" element={<ProtectedRoute><CreateReport /></ProtectedRoute>} />
            <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapPreview /></ProtectedRoute>} />
            
            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ReportsProvider>
    </AuthProvider>
  );
}

export default App;
