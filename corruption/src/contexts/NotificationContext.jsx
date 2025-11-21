import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiService from "../services/api";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Fetch notifications error:",
        err.response?.status,
        err.response?.data || err.message
      );
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markAsRead = async (id) => {
    try {
      await apiService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
    } catch (err) {
      console.error("Mark notification read error:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  // ✅ Delete all notifications (frontend loop)
  const deleteAllNotifications = async () => {
    try {
      // Delete each notification individually
      await Promise.all(notifications.map((n) => deleteNotification(n.id)));
      // Clear local state
      setNotifications([]);
    } catch (err) {
      console.error("Delete all notifications error:", err);
      throw err; // rethrow so component can handle toast/error
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        fetchNotifications,
        markAsRead,
        deleteNotification,
        deleteAllNotifications, // ✅ add here
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
