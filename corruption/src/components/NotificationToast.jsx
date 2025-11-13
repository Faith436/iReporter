import React from 'react';
import { useReports } from '../contexts/ReportContext';

const NotificationToast = () => {
  const { notifications } = useReports();
  
  // Get the 3 most recent notifications
  const recentNotifications = notifications?.slice(0, 3) || [];

  if (recentNotifications.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No new notifications
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentNotifications.map((notification) => (
        <div
          key={notification.id}
          className="p-3 bg-white rounded-lg shadow border border-gray-200"
        >
          <p className="text-sm text-gray-700">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;