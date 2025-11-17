import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/api"; // ✅ use apiService

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

  const logout = async () => {
    try {
      await apiService.logout(); // ✅ use apiService
      setCurrentUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
