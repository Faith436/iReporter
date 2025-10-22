// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LandingPage from './pages/LandingPage';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import CreateReport from './pages/CreateReport';
// import MyReports from './components/MyReports';
// import MapPreview from './components/MapPreview';
// import AdminDashboard from './pages/AdminDashboard';
// import './App.css';

// // Simple auth context
// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const savedUser = localStorage.getItem('ireporter-user');
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (error) {
//         console.error('Error parsing saved user:', error);
//         localStorage.removeItem('ireporter-user');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = (userData) => {
//     const userWithRole = { 
//       ...userData, 
//       role: userData.role || 'user',
//       id: userData.id || Date.now()
//     };
//     setUser(userWithRole);
//     localStorage.setItem('ireporter-user', JSON.stringify(userWithRole));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('ireporter-user');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Protected Route
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }
  
//   return user ? children : <Navigate to="/login" />;
// };

// // Public Route (redirect if already logged in)
// const PublicRoute = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }
  
//   return user ? <Navigate to="/dashboard" /> : children;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="App">
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
//             <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
//             <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            
//             {/* Protected Routes */}
//             <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//             <Route path="/create-report" element={<ProtectedRoute><CreateReport /></ProtectedRoute>} />
//             <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
//             <Route path="/map" element={<ProtectedRoute><MapPreview /></ProtectedRoute>} />
//             // In your App.js routes
// <Route 
//   path="/admin" 
//   element={
//     <ProtectedRoute requireAdmin={true}>
//       <AdminDashboard />
//     </ProtectedRoute>
//   } 
// />
//             {/* Fallback */}
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateReport from './pages/CreateReport';
import MyReports from './components/MyReports';
import MapPreview from './components/MapPreview';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Simple auth context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('ireporter-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ireporter-user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userWithRole = { 
      ...userData, 
      role: userData.role || 'user',
      id: userData.id || Date.now()
    };
    setUser(userWithRole);
    localStorage.setItem('ireporter-user', JSON.stringify(userWithRole));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ireporter-user');
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route (for regular users)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Admin Protected Route
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Public Route (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (user) {
    // Redirect admins to admin dashboard, regular users to regular dashboard
    return isAdmin() ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return isAdmin() ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            
            {/* Protected Routes - Regular Users */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create-report" element={<ProtectedRoute><CreateReport /></ProtectedRoute>} />
            <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapPreview /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            
            {/* Role-based redirect for root auth paths */}
            <Route path="/auth-redirect" element={<RoleBasedRedirect />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;