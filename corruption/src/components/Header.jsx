// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Menu, Bell, X, ChevronDown, LogOut, User } from "lucide-react";
import { useUsers } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

const Header = () => {
  const { currentUser, logout } = useUsers();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userNotifications, setUserNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const user = currentUser || { email: "", role: "user", firstName: "User" };

  // --- Load notifications safely ---
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      try {
        const data = await apiService.getNotifications();

        // Ensure we have an array
        const notificationsArray = Array.isArray(data)
          ? data
          : data?.notifications || [];

        setUserNotifications(notificationsArray);
        setUnreadCount(notificationsArray.filter((n) => !n.read).length);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setUserNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  // --- Mark notification as read ---
  const handleNotificationClick = async (notificationId) => {
    try {
      await apiService.markNotificationRead(notificationId);
      setUserNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      setShowNotifications(false);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // --- Remove notification ---
  const handleRemoveNotification = async (notificationId) => {
    try {
      await apiService.deleteNotification(notificationId);
      setUserNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to remove notification:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new-report":
        return "📋";
      case "status-update":
        return "🔄";
      case "report-edited":
        return "✏️";
      case "report-deleted":
        return "🗑️";
      case "submission-confirmation":
        return "✅";
      default:
        return "🔔";
    }
  };

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-20 bg-gray-800 shadow-md flex items-center justify-between px-6 md:px-10 z-10 border-b border-gray-100">
      {/* Left: Menu */}
      <div className="flex items-center gap-4 flex-1">
        <Menu className="w-6 h-6 text-gray-600 md:hidden cursor-pointer" />
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-5 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 " />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-[0.55rem] sm:text-xs flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div
            className={`absolute left-1/2 mt-2 w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto transform -translate-x-1/2 transition-all duration-300 ease-in-out
              ${
                showNotifications
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }
            `}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-700 text-sm">
                Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Items */}
            {userNotifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 text-center">
                No notifications
              </p>
            ) : (
              <div className="divide-y">
                {userNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <p className="font-semibold text-gray-800 text-sm">
                            {notification.title || "Notification"}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-red-500 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-teal-700 flex items-center justify-center text-white font-semibold">
              {user.firstName ? user.firstName[0].toUpperCase() : "U"}
            </div>
            <div className="px-1 py-3 text-left">
              <p className="font-semibold text-white">{user.firstName}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-white" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-gray-800">{user.firstName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <ul className="py-2">
                <li
                  onClick={() => navigate("/UserProfile")}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <User className="w-4 h-4" /> Profile
                </li>
                <li
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
