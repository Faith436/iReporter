import React, { createContext, useContext, useState, useEffect } from "react";

const ReportContext = createContext();

// Define the correct global key
const ALL_REPORTS_KEY = "allReports"; 
// Note: This key matches the one seen in your browser's Local Storage inspector.

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) throw new Error("useReports must be used within a ReportProvider");
  return context;
};

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load reports and notifications from localStorage on mount
  useEffect(() => {
    // *** FIX 1: Load from the correct GLOBAL key ***
    const storedReports = JSON.parse(localStorage.getItem(ALL_REPORTS_KEY)) || [];
    const storedNotifications = JSON.parse(localStorage.getItem("ireporter-notifications")) || [];
    setReports(storedReports);
    setNotifications(storedNotifications);
  }, []); // Empty dependency array ensures it runs only once on mount

  // Save reports to localStorage whenever they change
  useEffect(() => {
    // *** FIX 2: Save to the correct GLOBAL key ***
    localStorage.setItem(ALL_REPORTS_KEY, JSON.stringify(reports));
  }, [reports]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ireporter-notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Create a new report
  const createReport = (reportData) => {
    const newReport = {
      id: Date.now(),
      ...reportData,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    setReports((prev) => [newReport, ...prev]);

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

  // Update a report
  const updateReport = (id, updates) => {
    setReports((prev) =>
      prev.map((report) => {
        if (report.id === id) {
          const oldStatus = report.status;
          const newStatus = updates.status;

          // Notify user if status changed
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

  // Delete a report
  const deleteReport = (id) => {
    const reportToDelete = reports.find((r) => r.id === id);
    setReports((prev) => prev.filter((r) => r.id !== id));

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

  // Get reports for a specific user
  const getUserReports = (userId) => reports.filter((r) => r.userId === userId);

  // Get all reports (admin)
  const getAllReports = () => reports;

  // Create a notification
  const createNotification = (notificationData) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notificationData,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    return newNotification;
  };

  // Get notifications for current user
  const getUserNotifications = (currentUser) => {
    if (!currentUser) return [];
    return notifications.filter((n) => currentUser.role === "admin" ? n.targetUser === "admin" : n.targetUser === currentUser.id);
  };

  // Get unread count for current user
  const getUnreadCount = (currentUser) => {
    const userNotifications = getUserNotifications(currentUser);
    return userNotifications.filter((n) => !n.read).length;
  };

  // Mark notification as read
  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Get quick stats
  const getStats = (userId = null) => {
    let filteredReports = reports;
    if (userId) filteredReports = reports.filter((r) => r.userId === userId);

    return {
      total: filteredReports.length,
      redFlags: filteredReports.filter((r) => r.reportType === "red-flag").length,
      interventions: filteredReports.filter((r) => r.reportType === "intervention").length,
      pending: filteredReports.filter((r) => r.status === "pending").length,
      underInvestigation: filteredReports.filter((r) => r.status === "under-investigation").length,
      resolved: filteredReports.filter((r) => r.status === "resolved").length,
    };
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        notifications,
        createReport,
        updateReport,
        deleteReport,
        getUserReports,
        getAllReports,
        getStats,
        getUserNotifications,
        getUnreadCount,
        markNotificationRead,
        removeNotification,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};