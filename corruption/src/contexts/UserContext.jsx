import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiService from "../services/api";

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFirstLogin, setShowFirstLogin] = useState(false);

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
  const updateUserProfile = async (profileData) => {
    try {
      const formData = new FormData();
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("bio", profileData.bio || "");
      formData.append("phone", profileData.phone || "");
      if (profileData.avatar instanceof File) {
        formData.append("avatar", profileData.avatar);
      }

      const response = await apiService.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCurrentUser((prev) => ({ ...prev, ...response.data }));
      return response.data;
    } catch (err) {
      console.error("Failed to update profile:", err);
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
