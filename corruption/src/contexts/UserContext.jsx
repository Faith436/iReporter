import React, { createContext, useContext, useState, useEffect, useCallback  } from "react";
import apiService from "../services/api"; // ✅ use apiService
import axios from "axios";

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiService.getCurrentUser(); // ✅ use apiService
        setCurrentUser(data.user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // In UserContext.jsx
  const refreshUser = useCallback(async () => {
    try {
      const data = await apiService.getCurrentUser();
      setCurrentUser(data.user);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  }, []);

  const markFirstLoginSeen = async () => {
    try {
      await axios.put("/api/auth/first-login-seen");

      setCurrentUser((prev) => ({
        ...prev,
        firstLoginShown: true,
      }));
    } catch (err) {
      console.error("Failed to update first login status:", err);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout(); // ✅ use apiService
      setCurrentUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        refreshUser,
        logout,
        loading,
        markFirstLoginSeen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
