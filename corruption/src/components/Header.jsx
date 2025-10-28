import React, { useState, useEffect } from "react";
import { Menu, Bell, X, ChevronDown, LogOut, User, Search } from "lucide-react";
import { useReports } from "../contexts/ReportContext";
import { useNavigate } from "react-router-dom";

const COLOR_PRIMARY_TEAL = "#116E75";

const Header = () => {
  const { getUserNotifications, markNotificationRead, removeNotification, getUnreadCount } = useReports();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userNotifications, setUserNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Get user from localStorage
  const [user, setUser] = useState({ name: "User", email: "", role: "user" });
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Update notifications when user changes or notifications update
  useEffect(() => {
    if (user) {
      const notifications = getUserNotifications(user);
      setUserNotifications(notifications);
      setUnreadCount(getUnreadCount(user));
    }
  }, [user, getUserNotifications, getUnreadCount]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleNotificationClick = (notificationId) => {
    markNotificationRead(notificationId);
    setShowNotifications(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new-report": return "📋";
      case "status-update": return "🔄";
      case "report-edited": return "✏️";
      case "report-deleted": return "🗑️";
      case "submission-confirmation": return "✅";
      default: return "🔔";
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-white shadow-md flex items-center justify-between px-10 z-10 border-b border-gray-100">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-4 flex-1">
        <Menu className="w-6 h-6 text-gray-600 md:hidden cursor-pointer" />
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports..."
            className="w-1/3 p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700"
            style={{ borderColor: COLOR_PRIMARY_TEAL }}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </form>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-5 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Bell className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center p-3 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-700 text-sm">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {userNotifications.length === 0 ? (
                <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
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
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <p className="font-semibold text-gray-800 text-sm">{notification.title}</p>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
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
          )}
        </div>

        {/* User Menu (keep your existing user menu code) */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-semibold">
              {user.name ? user.name[0].toUpperCase() : user.role[0].toUpperCase()}
            </div>
            <div className="px-1 py-3 text-left">
              <p className="font-semibold text-gray-800">{user.name || "User"}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold text-gray-800">{user.name || "User"}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <ul className="py-2">
                <li
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <User className="w-4 h-4" /> Profile
                </li>
                <li
                  onClick={handleLogout}
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