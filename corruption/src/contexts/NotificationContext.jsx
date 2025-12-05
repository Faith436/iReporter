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

  /** Fetch notifications for the logged-in user/admin */
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await apiService.getNotifications(); // returns array
      const sorted = (data || []).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setNotifications(sorted);
    } catch (err) {
      console.error("Fetch notifications error:", err);
      setNotifications([]);
    }
  }, []);

  /** Add a new notification and fetch latest from backend */
  const addNotification = async (notification) => {
    try {
      // Send to backend
      const res = await apiService.createNotification(notification);
      // Fetch latest notifications to sync admin/user dashboards
      await fetchNotifications();
      return res;
    } catch (err) {
      console.error("Add notification error:", err);
    }
  };

  /** Mark a notification as read */
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

  /** Mark all notifications as read */
  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsRead(); // single PUT request
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error("Mark all notifications read error:", err);
    }
  };

  /** Delete a notification */
  const deleteNotification = async (id) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  /** Delete all notifications in frontend */
  const deleteAllNotifications = async () => {
    try {
      await Promise.all(notifications.map((n) => deleteNotification(n.id)));
      setNotifications([]);
    } catch (err) {
      console.error("Delete all notifications error:", err);
      throw err;
    }
  };

  /** Load notifications on mount instantly */
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        addNotification, // now automatically syncs dashboards
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
