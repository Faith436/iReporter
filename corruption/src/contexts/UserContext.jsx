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
  const { user } = useAuth(); 
  const token = user?.token;

  const checkFirstLogin = (user) => {
    setShowFirstLogin(!user.firstLoginShown);
  };

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiService.getCurrentUser();
        // Use Cloudinary avatar directly
        setCurrentUser({
          ...data.user,
          avatar: data.user.avatar || "",
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          phone: data.user.phone || "",
          role: data.user.role || "user",
        });
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
      setCurrentUser({
        ...data.user,
        avatar: data.user.avatar || "",
      });
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
    try {
      const response = await apiService.updateProfile(formData);

      // Backend returns full Cloudinary URL
      const updatedUser = response.data;

      setCurrentUser({
        ...updatedUser,
        avatar: updatedUser.avatar || "",
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        phone: updatedUser.phone || "",
        role: updatedUser.role || "user",
      });

      return updatedUser;
    } catch (err) {
      console.error("Profile update error:", err);
      throw err;
    }
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
