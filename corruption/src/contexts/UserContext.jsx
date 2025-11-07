// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { User } from "lucide-react";

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
        setCurrentUser(data.user);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // --- LOGOUT FUNCTION ---
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setCurrentUser(null); // Clear context
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