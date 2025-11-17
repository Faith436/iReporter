import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiService from "../services/api"; // ✅ already using apiService

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getNotifications(); // ✅ already uses apiService
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
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
