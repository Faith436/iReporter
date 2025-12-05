import React, { useState, useEffect, useRef } from "react";
import { Bell, X, Check, Trash2 } from "lucide-react";
// Corrected path with explicit extension, assuming the file is named UserContext.jsx
import { useUsers } from "../contexts/UserContext.jsx";
// Corrected path with explicit extension, assuming the file is named api.js
import apiService from "../services/api.js"; 

const NotificationDropdown = ({ showNotifications, setShowNotifications }) => {
  const { currentUser } = useUsers();
  const [userNotifications, setUserNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsRef = useRef(null);

  // --- Utility Functions ---

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Use a simple, readable format for both desktop and mobile
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // --- Data & State Logic ---

  // Load notifications safely
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      try {
        const data = await apiService.getNotifications();
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

  // Handle outside clicks (Only required for the desktop dropdown)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the current view is MD (desktop) and the click is outside the dropdown
      if (
        window.innerWidth >= 768 && // md: breakpoint
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowNotifications]);

  // Mark notification as read
  const handleNotificationClick = async (notificationId) => {
    const notification = userNotifications.find(n => n.id === notificationId);
    if (!notification || notification.read) {
        setShowNotifications(false);
        return; // Already read or not found
    }

    try {
      await apiService.markNotificationRead(notificationId);
      setUserNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      // Close dropdown after interacting with a notification item
      setShowNotifications(false); 
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Remove notification
  const handleRemoveNotification = async (notificationId) => {
    try {
      await apiService.deleteNotification(notificationId);
      setUserNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
      const wasUnread = userNotifications.find(n => n.id === notificationId)?.read === false;
      if (wasUnread) {
          setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Failed to remove notification:", err);
    }
  };
  
  // Mark all as read
  const handleMarkAllAsRead = async () => {
      // Find all unread IDs
      const unreadIds = userNotifications.filter(n => !n.read).map(n => n.id);
      if (unreadIds.length === 0) return;

      try {
          // You would need an API endpoint for marking all, assuming one exists
          // For now, we simulate success and update state
          // await apiService.markAllNotificationsRead(); 
          setUserNotifications(prev => prev.map(n => ({...n, read: true})));
          setUnreadCount(0);
      } catch (err) {
          console.error("Failed to mark all as read:", err);
      }
  };


  // --- Shared Notification Item JSX ---
  const NotificationItem = ({ notification }) => (
    <div
      key={notification.id}
      // Use onMouseDown to prevent the outside click listener from firing and closing the dropdown prematurely
      onMouseDown={() => handleNotificationClick(notification.id)}
      className={`p-4 hover:bg-gray-50 cursor-pointer transition flex items-start group relative ${
        !notification.read ? "bg-blue-50 hover:bg-blue-100" : ""
      }`}
    >
        <div className="flex-shrink-0 mt-1 mr-3 text-lg">
            {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">
              {notification.title || "Notification"}
            </p>
            <p className="text-sm text-gray-600 truncate mt-0.5">
              {notification.message}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(notification.created_at)}
            </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the read click
            handleRemoveNotification(notification.id);
          }}
          className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 rounded-full hover:bg-gray-200"
          title="Remove notification"
        >
          <Trash2 className="w-4 h-4" />
        </button>
    </div>
  );


  // --- 1. Mobile Full-Screen Modal (Centered) ---
  const MobileModal = () => {
    if (!showNotifications) return null;

    return (
      // Backdrop: Fixed position, full screen, dark overlay
      <div 
        className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 transition-opacity duration-300" 
        onClick={() => setShowNotifications(false)} // Close on backdrop click
      >
        {/* Modal Content Container (Centered, responsive width, dark theme) */}
        <div 
          className="w-full max-w-sm bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden transform scale-100 transition-transform duration-300"
          onClick={(e) => e.stopPropagation()} // Keep modal open when clicking inside
        >
          {/* Header Section */}
          <div className="flex justify-between items-center p-5 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
            {/* Close Button on Left */}
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-gray-300 hover:text-white p-1 rounded-full"
            >
              <X className="w-6 h-6" /> 
            </button>
            <h3 className="text-xl font-semibold text-white flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-400" />
              Notifications
            </h3>
            <div className="w-6"></div> {/* Spacer for centering the title */}
          </div>

          {/* Action Bar */}
          <div className="flex justify-between items-center px-5 py-3 text-sm border-b border-gray-700 bg-gray-800">
              <span className="text-gray-400 font-medium">
                  {unreadCount} Unread
              </span>
              <button 
                  onClick={handleMarkAllAsRead} 
                  className="text-blue-400 font-medium hover:text-blue-300 transition disabled:opacity-50"
                  disabled={unreadCount === 0}
              >
                  Mark All as Read
              </button>
          </div>

          {/* List of Notifications */}
          <div className="py-2 overflow-y-auto max-h-[calc(90vh-140px)]"> 
            {userNotifications.length === 0 ? (
              <p className="text-center text-gray-400 p-8">
                You're all caught up! No notifications.
              </p>
            ) : (
              userNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  // Styling the card background and shadow to match the centered dark theme
                  className={`mx-3 mb-2 p-4 rounded-lg cursor-pointer transition duration-150 shadow-md flex items-start group relative ${
                    !notification.read 
                      ? 'bg-gray-700 hover:bg-gray-600 border border-blue-500' // Unread: Highlighted border
                      : 'bg-gray-800 hover:bg-gray-700' // Read: Standard background
                  }`}
                >
                    <div className="flex-shrink-0 mt-1 mr-3 text-lg">
                        {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">
                          {notification.title || "Notification"}
                        </p>
                        <p className="text-sm text-gray-300 truncate mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notification.created_at)}
                        </p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveNotification(notification.id);
                        }}
                        className="absolute top-1 right-1 p-1 text-gray-500 hover:text-red-400 transition rounded-full hover:bg-gray-600"
                        title="Remove notification"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- 2. Desktop Dropdown (Floating under bell icon) ---
  const DesktopDropdown = () => {
      return (
          <div
            ref={notificationsRef}
            // Hide on screens smaller than md:
            className={`hidden md:block absolute right-0 mt-2 w-80 lg:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto transform origin-top-right transition-all duration-300 ease-in-out
              ${
                showNotifications
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }
            `}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50 sticky top-0">
                <h3 className="font-semibold text-gray-700 text-sm">
                    Notifications ({unreadCount})
                </h3>
                <button
                    onClick={handleMarkAllAsRead}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium disabled:opacity-50"
                    disabled={unreadCount === 0}
                >
                    Mark All as Read
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
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            )}
            
            {/* Footer */}
            <div className="p-2 border-t bg-gray-50 text-center sticky bottom-0">
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    View All
                </button>
            </div>
          </div>
      );
  };

  // --- Main Component Render ---
  return (
    <>
      <MobileModal />
      <DesktopDropdown />
    </>
  );
};

export default NotificationDropdown;