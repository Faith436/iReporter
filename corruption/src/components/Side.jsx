import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Side = ({ 
  user = { name: "", email: "" },
  onThemeToggle 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  ;

  // Load notifications from localStorage
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('ireporter-notifications')) || [];
    setNotifications(storedNotifications);
    
    const unread = storedNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, []);

  
 

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleMyReports = () => {
    navigate('/my-reports');
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
    
    // Mark all as read when opening notifications
    if (!showNotifications && unreadCount > 0) {
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      localStorage.setItem('ireporter-notifications', JSON.stringify(updatedNotifications));
    }
  };

  const handleMapView = () => {
    navigate('/map');
  };

 

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev - 1);
    localStorage.setItem('ireporter-notifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.setItem('ireporter-notifications', JSON.stringify([]));
    setShowNotifications(false);
  };

  // Sample notifications (in real app, these would come from API)
  const sampleNotifications = [
    {
      id: 1,
      title: "Report Status Updated",
      message: "Your report 'Road Construction Corruption' is now Under Investigation",
      type: "status-update",
      timestamp: new Date().toISOString(),
      read: false,
      reportId: 1
    },
    {
      id: 2,
      title: "New Comment",
      message: "Admin added a comment to your report 'Missing Education Funds'",
      type: "comment",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      reportId: 2
    },
    {
      id: 3,
      title: "Report Resolved",
      message: "Your intervention request 'Water Supply Issues' has been resolved",
      type: "resolved",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
      reportId: 3
    }
  ];

  // Initialize notifications if empty
  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications(sampleNotifications);
      setUnreadCount(sampleNotifications.filter(n => !n.read).length);
      localStorage.setItem('ireporter-notifications', JSON.stringify(sampleNotifications));
    }
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'status-update': return '🔄';
      case 'comment': return '💬';
      case 'resolved': return '✅';
      default: return '🔔';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="avatar">
            <img
              src="https://via.placeholder.com/80/3182ce/ffffff?text=JD"
              alt="avatar"
            />
          </div>
          <h3 className="sidebar-name">{user.name}</h3>
          <p className="sidebar-email">{user.email}</p>
        </div>

        <ul className="sidebar-nav">
          {/* Home/Dashboard */}
          <li 
            className={location.pathname === '/dashboard' ? 'active' : ''}
            onClick={() => handleNavigation('/dashboard')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </li>

          {/* Create Report */}
          <li 
            className={location.pathname === '/create-report' ? 'active' : ''}
            onClick={() => handleNavigation('/create-report')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Create Report</span>
          </li>

          {/* My Reports */}
          <li 
            className={location.pathname === '/my-reports' ? 'active' : ''}
            onClick={handleMyReports}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">My Reports</span>
          </li>

          {/* Notifications */}
          <li 
            className={`notification-item ${showNotifications ? 'active' : ''}`}
            onClick={handleNotifications}
          >
            <span className="nav-icon">🔔</span>
            <span className="nav-text">Notifications</span>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </li>

          {/* Map View */}
          <li 
            className={location.pathname === '/map' ? 'active' : ''}
            onClick={handleMapView}
          >
            <span className="nav-icon">🗺️</span>
            <span className="nav-text">Map View</span>
          </li>

          {/* Settings */}
          
        </ul>

        <div className="sidebar-footer">
          <small>© {new Date().getFullYear()} iReporter</small>
          <div className="user-stats">
            <span>Reports: {user.reportCount || 0}</span>
            <span>Resolved: {user.resolvedCount || 0}</span>
          </div>
        </div>
      </aside>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notifications ({notifications.length})</h3>
            {notifications.length > 0 && (
              <button 
                className="clear-all-btn"
                onClick={clearAllNotifications}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications yet</p>
                <small>You'll see updates about your reports here</small>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <small>{formatTime(notification.timestamp)}</small>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Side;
