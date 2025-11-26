import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiService from "../services/api";

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFirstLogin, setShowFirstLogin] = useState(false); // for first-login modal

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiService.getCurrentUser();
        setCurrentUser(data.user);

        // Show first-login modal if not seen
        if (!data.user.firstLoginShown) {
          setShowFirstLogin(true);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Refresh user (e.g., after profile update)
  const refreshUser = useCallback(async () => {
    try {
      const data = await apiService.getCurrentUser();
      setCurrentUser(data.user);

      // Re-check first-login status
      if (!data.user.firstLoginShown) setShowFirstLogin(true);
      else setShowFirstLogin(false);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  }, []);

  // Mark first-login as seen
  const markFirstLoginSeen = async () => {
    try {
      await apiService.markFirstLogin();
      setCurrentUser((prev) => ({
        ...prev,
        firstLoginShown: true,
      }));
      setShowFirstLogin(false);
    } catch (err) {
      console.error("Failed to mark first login as seen:", err);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await apiService.logout();
      setCurrentUser(null);
      setShowFirstLogin(false);
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
        showFirstLogin,
        setShowFirstLogin,
        markFirstLoginSeen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
