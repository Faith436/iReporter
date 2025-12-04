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

  /** Fetch notifications immediately for fast UI */
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await apiService.getNotifications(); // now returns array
      setNotifications(data || []);
    } catch (err) {
      console.error("Fetch notifications error:", err);
      setNotifications([]);
    }
  }, []);

  /** Add a new notification at the top */
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
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
        deleteNotification,
        deleteAllNotifications,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
