// import React, { createContext, useContext, useState, useEffect } from "react";

// // Create context
// const AuthContext = createContext();

// // Hook to use AuthContext
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// // Provider component
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const savedUser = localStorage.getItem("ireporter-user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);
//   }, []);

//   // Login function
//   const login = (userData) => {
//     const loggedInUser = {
//       ...userData,
//       id: userData.id || Date.now(),
//       role: userData.role || "user",
//     };
//     setUser(loggedInUser);
//     localStorage.setItem("ireporter-user", JSON.stringify(loggedInUser));
//   };

//   // Logout function
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("ireporter-user");
//   };

//   // Check if current user is admin
//   const isAdmin = () => user?.role === "admin";

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isAdmin,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        // Verify token is still valid
        const response = await apiService.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
