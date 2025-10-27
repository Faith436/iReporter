import React, { createContext, useContext, useState, useEffect } from "react";

const ReportContext = createContext();

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    try {
      const storedReports = JSON.parse(localStorage.getItem("myReports")) || [];
      const storedNotifications = JSON.parse(localStorage.getItem("ireporter-notifications")) || [];
      setReports(storedReports);
      setNotifications(storedNotifications);
    } catch (error) {
      console.error("Error loading data:", error);
      setReports([]);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save reports to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("myReports", JSON.stringify(reports));
    }
  }, [reports, loading]);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem("ireporter-notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Get stats for QuickStats
  const getStats = (userId = null) => {
    let filteredReports = reports;
    
    // If userId provided, filter by user
    if (userId) {
      filteredReports = reports.filter(report => report.userId === userId);
    }

    return {
      total: filteredReports.length,
      redFlags: filteredReports.filter(r => r.reportType === "red-flag").length,
      interventions: filteredReports.filter(r => r.reportType === "intervention").length,
      pending: filteredReports.filter(r => r.status === "pending").length,
      underInvestigation: filteredReports.filter(r => r.status === "under-investigation").length,
      resolved: filteredReports.filter(r => r.status === "resolved").length,
    };
  };

  // Get unread count for notifications
  const getUnreadCount = (currentUser) => {
    if (!currentUser) return 0;
    
    const userNotifications = getUserNotifications(currentUser);
    return userNotifications.filter(n => !n.read).length;
  };

  // Get filtered notifications for current user
  const getUserNotifications = (currentUser) => {
    if (!currentUser) return [];
    
    return notifications.filter(notification => {
      if (currentUser.role === "admin") {
        return notification.targetUser === "admin";
      } else {
        return notification.targetUser === currentUser.id;
      }
    });
  };

  // Create notification function
  const createNotification = (notificationData) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notificationData
    };

    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  // CREATE REPORT
  const createReport = (reportData) => {
    const newReport = {
      id: Date.now(),
      ...reportData,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    setReports(prev => [newReport, ...prev]);

    // Notify admin
    createNotification({
      title: "New Report Submitted",
      message: `User ${reportData.userName || "A user"} submitted: "${reportData.title}"`,
      type: "new-report",
      targetUser: "admin",
      reportId: newReport.id,
    });

    // Notify user
    createNotification({
      title: "Report Submitted",
      message: `Your report "${reportData.title}" has been submitted.`,
      type: "submission",
      targetUser: reportData.userId,
      reportId: newReport.id,
    });

    return newReport;
  };

  // UPDATE REPORT
  const updateReport = (id, updates) => {
    setReports(prevReports =>
      prevReports.map(report => {
        if (report.id === id) {
          const oldStatus = report.status;
          const newStatus = updates.status;

          // Notify user of status change
          if (newStatus && newStatus !== oldStatus) {
            createNotification({
              title: "Status Updated",
              message: `Your report "${report.title}" is now ${newStatus.replace("-", " ")}`,
              type: "status-update",
              targetUser: report.userId,
              reportId: id,
            });
          }

          return { ...report, ...updates };
        }
        return report;
      })
    );
  };

  // DELETE REPORT
  const deleteReport = (id) => {
    const reportToDelete = reports.find(r => r.id === id);
    
    setReports(prev => prev.filter(r => r.id !== id));

    // Notify admin
    if (reportToDelete) {
      createNotification({
        title: "Report Deleted",
        message: `User ${reportToDelete.userName} deleted: "${reportToDelete.title}"`,
        type: "report-deleted",
        targetUser: "admin",
        reportId: id,
      });
    }
  };

  // Get user's reports
  const getUserReports = (userId) => {
    return reports.filter(report => report.userId === userId);
  };

  // Get all reports (for admin)
  const getAllReports = () => {
    return reports;
  };

  // Mark notification as read
  const markNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const value = {
    // Data
    reports,
    notifications,
    loading,
    
    // Report operations
    createReport,
    updateReport,
    deleteReport,
    getUserReports,
    getAllReports,
    
    // Stats
    getStats,
    
    // Notification operations
    markNotificationRead,
    removeNotification,
    getUserNotifications,
    getUnreadCount,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};