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
      await apiService.markFirstLoginShown(currentUser.id); // ✅ use current user internally
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

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        refreshUser,
        logout,
        loading,
        showFirstLogin,
        markFirstLoginSeen, // ✅ now fully safe
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
