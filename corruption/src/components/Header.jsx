import React, { useState, useEffect, useRef } from "react";
import { Menu, Bell, X, ChevronDown, LogOut, User } from "lucide-react";
// Corrected path with explicit extension, assuming the file is UserContext.jsx
import { useUsers } from "../contexts/UserContext.jsx"; 
import { useNavigate } from "react-router-dom";
// Note: apiService is no longer needed here, but kept if used elsewhere.
// import apiService from "../services/api"; 
// Corrected path with explicit extension, assuming the file is NotificationDropdown.jsx
import NotificationDropdown from "./NotificationDropdown.jsx"; // <-- NEW IMPORT

const Header = ({ isSidebarCollapsed, toggleMobileSidebar }) => {
  const { currentUser, logout } = useUsers();
  const [showNotifications, setShowNotifications] = useState(false); // Only state for visibility remains
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // NOTE: userNotifications and unreadCount were moved to NotificationDropdown

  const navigate = useNavigate();

  const user = currentUser || { email: "", role: "user", firstName: "User" };

  const userMenuRef = useRef(null);
  
  // The notificationsRef is now inside NotificationDropdown

  // --- Dynamic Positioning Logic ---
  const sidebarWidthClass = isSidebarCollapsed ? 'md:left-20' : 'md:left-64';

  // --- Handle outside clicks for User Menu ONLY ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only check for user menu, since notificationsRef is now in the child component
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      // Note: No more notification outside click logic here
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Note: All API handlers (handleNotificationClick, handleRemoveNotification) 
  // and utility (getNotificationIcon) have been MOVED.

  // Placeholder for the unread count badge display (you will need to pass this count from the dropdown component via prop drilling or context if you want it here)
  const tempUnreadCount = 3; // Use a temporary value or pass the real count

  return (
    <header className={`fixed top-0 left-0 ${sidebarWidthClass} right-0 h-20 bg-white shadow-md flex items-center justify-between px-6 md:px-10 z-10 border-b border-gray-100 transition-[left] duration-300`}>
      
      {/* Left: Menu */}
      <div className="flex items-center gap-4 flex-1">
        <Menu 
          className="w-6 h-6 text-gray-600 md:hidden cursor-pointer" 
          onClick={toggleMobileSidebar}
        />
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-5 relative">
        
        {/* Notifications Button (Wrapper for the Bell Icon and its state) */}
        <div className="relative">
          <button
            onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowUserMenu(false); // Close user menu if notifications open
            }}
            // NOTE: We no longer need notificationsRef here
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            {tempUnreadCount > 0 && ( // Use tempUnreadCount or pass the real one from the child
              <span className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-[0.55rem] sm:text-xs flex items-center justify-center rounded-full">
                {/* In a real app, you would pass the actual unread count here */}
                {tempUnreadCount} 
              </span>
            )}
          </button>
          
          {/* 🌟 Notification Dropdown Component - Handles Mobile and Desktop views 🌟 */}
          <NotificationDropdown
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
          />

        </div>

        {/* User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => {
                setShowUserMenu((prev) => !prev);
                setShowNotifications(false); // Close notifications if user menu opens
            }}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/505050/FFFFFF?text=U'; }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-500 to-teal-700 flex items-center justify-center">
                  {user.firstName ? user.firstName[0].toUpperCase() : "U"}
                </div>
              )}
            </div>

            <div className="px-1 py-3 text-left hidden sm:block">
              <p className="font-semibold text-gray-800">
                {user.firstName || "User"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-800" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-gray-800">{user.firstName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <ul className="py-2">
                <li
                  onClick={() => {
                    if (user.role === "admin") {
                      navigate("/admin/profile");
                    } else {
                      navigate("/dashboard/profile");
                    }
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <User className="w-4 h-4" /> Profile
                </li>

                <li
                  onClick={() => {
                      logout();
                      setShowUserMenu(false);
                  }}
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