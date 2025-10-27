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

  // ✅ CREATE REPORT - Notify Admin
  const createReport = (reportData) => {
    const newReport = {
      id: Date.now(),
      ...reportData,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    };

    setReports(prev => [newReport, ...prev]);

    // 🔔 NOTIFY ADMIN: New report submitted
    createNotification({
      title: "New Report Submitted",
      message: `User ${reportData.userName || "A user"} submitted a new report: "${reportData.title}"`,
      type: "new-report",
      targetUser: "admin", // Only admins see this
      reportId: newReport.id,
      reportTitle: reportData.title,
    });

    // 🔔 NOTIFY USER: Report submitted successfully
    createNotification({
      title: "Report Submitted Successfully",
      message: `Your report "${reportData.title}" has been submitted and is under review.`,
      type: "submission-confirmation",
      targetUser: reportData.userId, // Only the submitting user sees this
      reportId: newReport.id,
    });

    return newReport;
  };

  // ✅ UPDATE REPORT - Notify User when admin changes status
  const updateReport = (id, updates) => {
    setReports(prevReports =>
      prevReports.map(report => {
        if (report.id === id) {
          const oldStatus = report.status;
          const newStatus = updates.status;

          // 🔔 NOTIFY USER: Status changed by admin
          if (newStatus && newStatus !== oldStatus) {
            createNotification({
              title: "Report Status Updated",
              message: `Your report "${report.title}" status changed from "${oldStatus}" to "${newStatus}"`,
              type: "status-update",
              targetUser: report.userId, // Only the report owner sees this
              reportId: id,
              oldStatus,
              newStatus,
            });
          }

          // 🔔 NOTIFY ADMIN: User edited their report (only if status is pending)
          if (report.status === "pending" && !updates.status) {
            createNotification({
              title: "Report Edited",
              message: `User ${report.userName || "A user"} edited their report: "${report.title}"`,
              type: "report-edited",
              targetUser: "admin", // Only admins see this
              reportId: id,
            });
          }

          return { ...report, ...updates };
        }
        return report;
      })
    );
  };

  // ✅ DELETE REPORT - Notify Admin
  const deleteReport = (id) => {
    const reportToDelete = reports.find(r => r.id === id);
    
    setReports(prev => prev.filter(r => r.id !== id));

    // 🔔 NOTIFY ADMIN: Report deleted by user
    if (reportToDelete) {
      createNotification({
        title: "Report Deleted",
        message: `User ${reportToDelete.userName || "A user"} deleted their report: "${reportToDelete.title}"`,
        type: "report-deleted",
        targetUser: "admin", // Only admins see this
        reportId: id,
        reportTitle: reportToDelete.title,
      });
    }
  };

  // ✅ MARK NOTIFICATION AS READ
  const markNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // ✅ REMOVE NOTIFICATION
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // ✅ GET FILTERED NOTIFICATIONS FOR CURRENT USER
  const getUserNotifications = (currentUser) => {
    if (!currentUser) return [];
    
    return notifications.filter(notification => {
      // Admin sees all admin-targeted notifications
      if (currentUser.role === "admin") {
        return notification.targetUser === "admin";
      }
      // Users see only their own notifications
      else {
        return notification.targetUser === currentUser.id || 
               (notification.targetUser === currentUser.role); // Fallback for user role
      }
    });
  };

  // ✅ GET UNREAD COUNT FOR CURRENT USER
  const getUnreadCount = (currentUser) => {
    const userNotifications = getUserNotifications(currentUser);
    return userNotifications.filter(n => !n.read).length;
  };

  // ✅ CLEAR ALL NOTIFICATIONS FOR CURRENT USER
  const clearAllNotifications = (currentUser) => {
    if (currentUser.role === "admin") {
      // Admin: clear only admin notifications
      setNotifications(prev => prev.filter(n => n.targetUser !== "admin"));
    } else {
      // User: clear only their notifications
      setNotifications(prev => prev.filter(n => n.targetUser !== currentUser.id));
    }
  };

  const value = {
    reports,
    notifications,
    loading,
    createReport,
    updateReport,
    deleteReport,
    markNotificationRead,
    removeNotification,
    getUserNotifications,
    getUnreadCount,
    clearAllNotifications,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};