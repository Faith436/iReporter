import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiService from "../services/api";
import { useAuth } from "./AuthContext";

const UserContext = createContext();
export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFirstLogin, setShowFirstLogin] = useState(false);
  const { user } = useAuth(); // ✅ get current token from AuthContext
  const token = user?.token;

  // Check if first login popup should show
  const checkFirstLogin = (user) => {
    setShowFirstLogin(!user.firstLoginShown);
  };

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiService.getCurrentUser();
        setCurrentUser(data.user);
        checkFirstLogin(data.user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const data = await apiService.getCurrentUser();
      setCurrentUser(data.user);
      checkFirstLogin(data.user);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  }, []);

  // Mark first login as seen
  const markFirstLoginSeen = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      await apiService.markFirstLoginShown();
      setCurrentUser((prev) => ({ ...prev, firstLoginShown: true }));
      setShowFirstLogin(false);
    } catch (err) {
      console.error("Failed to mark first login as seen:", err);
    }
  }, [currentUser]);

  // Logout
  const logout = async () => {
    try {
      await apiService.logout();
      setCurrentUser(null);
      setShowFirstLogin(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // --- New Profile Methods ---

  // Get full profile
  const getProfile = async () => {
    try {
      const response = await apiService.get("/users/profile");
      return response.data;
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      throw err;
    }
  };

  // Update profile (name, bio, phone, avatar)
  const updateUserProfile = async (formData) => {
    if (!token) throw new Error("User is not authenticated");

    console.log("Sending FormData to backend:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await fetch("/api/users/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ token from AuthContext
      },
      body: formData, // FormData handles Content-Type
    });

    if (!res.ok) {
      console.error("Backend returned error:", res.status, res.statusText);
      const text = await res.text();
      console.error("Response body:", text);
      throw new Error("Failed to update profile");
    }

    const data = await res.json();
    console.log("Backend returned:", data);
    return data;
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await apiService.put("/users/password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (err) {
      console.error("Failed to change password:", err);
      throw err;
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
        markFirstLoginSeen,
        getProfile,
        updateUserProfile,
        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
