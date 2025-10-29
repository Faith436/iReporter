// import React, { useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import DashboardLayout from "./pages/DashboardLayout";
// import UserDashboard from "./pages/UserDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import Reports from "./pages/Reports";
// import Login from "./pages/Login";
// import LandingPage from "./pages/LandingPage";
// import Signup from "./pages/Signup";

// function App() {
//   // Debug: check localStorage
//   useEffect(() => {
//     const user = localStorage.getItem("loggedInUser");
//     console.log("🔍 Current user:", user);
//   }, []);

//   // Get logged-in user
//   const getLoggedInUser = () => {
//     const user = localStorage.getItem("loggedInUser");
//     return user ? JSON.parse(user) : null;
//   };

//   // Protect route by role
//   const ProtectedRoute = ({ children, allowedRoles }) => {
//     const user = getLoggedInUser();
//     if (!user) return <Navigate to="/login" replace />;
//     if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
//     return children;
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* User dashboard */}
//         <Route path="/dashboard" element={
//           <ProtectedRoute allowedRoles={["user"]}>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }>
//           <Route index element={<UserDashboard />} />
//           <Route path="reports" element={<Reports />} />
//           <Route path="notifications" element={<div>Notifications Page</div>} />
//         </Route>

//         {/* Admin dashboard */}
//         <Route path="/admin" element={
//           <ProtectedRoute allowedRoles={["admin"]}>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }>
//           <Route index element={<AdminDashboard />} />
//           <Route path="reports" element={<Reports />} />
//           <Route path="notifications" element={<div>Notifications Page</div>} />
//         </Route>

//         {/* Catch-all: redirect based on role */}
//         <Route path="*" element={
//           (() => {
//             const user = getLoggedInUser();
//             if (!user) return <Navigate to="/" replace />;
//             return user.role === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
//           })()
//         } />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./pages/DashboardLayout";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import apiService from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        // Verify token is still valid by making API call
        const response = await apiService.getCurrentUser();
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Get logged-in user
  const getLoggedInUser = () => {
    if (user) return user;
    
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  };

  // Protect route by role
  const ProtectedRoute = ({ children, allowedRoles }) => {
    const currentUser = getLoggedInUser();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      );
    }

    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      // Redirect to appropriate dashboard based on role
      return currentUser.role === "admin" ? 
        <Navigate to="/admin" replace /> : 
        <Navigate to="/dashboard" replace />;
    }

    return React.cloneElement(children, { user: currentUser, logout });
  };

  // Public route - redirect if already logged in
  const PublicRoute = ({ children }) => {
    const currentUser = getLoggedInUser();
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      );
    }

    if (currentUser) {
      return currentUser.role === "admin" ? 
        <Navigate to="/admin" replace /> : 
        <Navigate to="/dashboard" replace />;
    }

    return React.cloneElement(children, { login });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        } />
        
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

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
            const currentUser = getLoggedInUser();
            if (!currentUser) return <Navigate to="/" replace />;
            return currentUser.role === "admin" ? 
              <Navigate to="/admin" replace /> : 
              <Navigate to="/dashboard" replace />;
          })()
        } />
      </Routes>
    </Router>
  );
}

export default App;