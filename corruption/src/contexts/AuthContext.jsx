import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("ireporter-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    const loggedInUser = {
      ...userData,
      id: userData.id || Date.now(),
      role: userData.role || "user",
    };
    setUser(loggedInUser);
    localStorage.setItem("ireporter-user", JSON.stringify(loggedInUser));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("ireporter-user");
  };

  // Check if current user is admin
  const isAdmin = () => user?.role === "admin";

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
