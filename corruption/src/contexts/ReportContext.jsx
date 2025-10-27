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
  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, { id: Date.now(), ...notification }]);
  };

  // ✅ Update report and trigger notification on status change
  const updateReport = (id, updates) => {
    setReports((prevReports) =>
      prevReports.map((r) => {
        if (r.id === id) {
          // Detect status change
          if (updates.status && updates.status !== r.status) {
            const statusMessage = `Your report "${r.title}" status was changed to "${updates.status}"`;

            const newNotification = {
              id: Date.now(),
              title: "Report Status Updated",
              message: statusMessage,
              type: "status-update",
              timestamp: new Date().toISOString(),
              read: false,
              reportId: id,
              userId: r.userId, // ✅ important: assign the userId
            };

            // ✅ Add notification safely and update localStorage immediately
            setNotifications((prevNotifs) => {
              const updated = [newNotification, ...prevNotifs];
              localStorage.setItem(
                "ireporter-notifications",
                JSON.stringify(updated)
              );
              return updated;
            });
          }

          return { ...r, ...updates };
        }
        return r;
      })
    );
  };

  // Remove notification by ID
  const removeNotification = (id) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem("ireporter-notifications", JSON.stringify(updated));
      return updated;
    });
  };

  // Load reports and notifications from localStorage
  useEffect(() => {
    try {
      const storedReports = JSON.parse(localStorage.getItem("myReports")) || [];
      const storedNotifications =
        JSON.parse(localStorage.getItem("ireporter-notifications")) || [];
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

  // Save reports whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("myReports", JSON.stringify(reports));
    }
  }, [reports, loading]);

  // Save notifications whenever they change
  useEffect(() => {
    localStorage.setItem(
      "ireporter-notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  // Create a new report
  const createReport = (reportData) => {
    const newReport = {
      id: Date.now(),
      ...reportData,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      read: false,
    };

    setReports((prev) => [newReport, ...prev]);

    // Create notification for the new report
    const newNotification = {
      id: Date.now(),
      title: "Report Submitted",
      message: `Your report "${reportData.title}" has been submitted successfully`,
      type: "submission",
      timestamp: new Date().toISOString(),
      read: false,
      reportId: newReport.id,
      userId: reportData.userId, // ✅ make sure userId is included
    };

    setNotifications((prev) => [newNotification, ...prev]);

    return newReport;
  };

  // Delete report
  const deleteReport = (id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  // Get statistics
  const getStats = () => {
    const redFlags = reports.filter((r) => r.reportType === "red-flag").length;
    const interventions = reports.filter(
      (r) => r.reportType === "intervention"
    ).length;
    const underInvestigation = reports.filter(
      (r) => r.status === "under-investigation"
    ).length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    return { redFlags, interventions, underInvestigation, resolved };
  };

  // Notification management
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const value = {
    reports,
    notifications,
    loading,
    createReport,
    updateReport,
    deleteReport,
    getStats,
    markNotificationRead,
    removeNotification,
  };

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
};
