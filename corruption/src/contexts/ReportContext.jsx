// src/contexts/ReportContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiService from "../services/api";

const ReportContext = createContext();
export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  // --- User state
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // --- Reports & map locations
  const [reports, setReports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  // --- Notifications
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  /** -----------------------------
   * Fetch current user and normalize
   * ----------------------------- */
  const fetchCurrentUser = useCallback(async () => {
    setUserLoading(true);
    try {
      const res = await apiService.getCurrentUser();
      const user = res.user || res; // normalize
      setCurrentUser(user);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      setCurrentUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);

  /** -----------------------------
   * Fetch reports (all for admin, user-specific for normal users)
   * ----------------------------- */
  const fetchReports = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      let data = [];
      const role = currentUser.role;
      const userId = currentUser.id;

      if (role === "admin") {
        data = await apiService.getReports(); // all reports
      } else {
        data = await apiService.getReports(userId); // user's reports
      }

      const reportsWithUser = (data || []).map((report) => ({
        ...report,
        userName:
          report.userName ||
          `${report.first_name || ""} ${report.last_name || ""}`.trim(),
        userEmail: report.userEmail || report.email,
      }));

      setReports(reportsWithUser);

      const locs = reportsWithUser
        .filter((r) => r.lat && r.lng)
        .map((r) => ({
          id: r.id,
          lat: Number(r.lat),
          lng: Number(r.lng),
          title: r.title,
          type: r.type,
          status: r.status,
        }));
      setLocations(locs);
    } catch (err) {
      console.error("Fetch reports error:", err);
      setReports([]);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  /** -----------------------------
   * Fetch notifications
   * ----------------------------- */
  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;

    setNotifLoading(true);
    try {
      const data = await apiService.getNotifications();
      setNotifications(data || []); // ensure array
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  }, [currentUser]);

  /** -----------------------------
   * Create a report
   * ----------------------------- */
  const createReport = async (reportData) => {
    if (!currentUser) throw new Error("User not logged in");

    try {
      const res = await apiService.createReport(reportData);
      const report = res?.report || res;

      // Add to state
      setReports((prev) => [report, ...(prev || [])]);
      setLocations((prev) => [
        ...prev,
        {
          id: report.id,
          lat: Number(report.lat),
          lng: Number(report.lng),
          title: report.title,
          type: report.type,
          status: report.status,
        },
      ]);

      // Admin receives notification if user is not admin
      if (currentUser.role !== "admin") {
        fetchNotifications();
      }

      return report;
    } catch (err) {
      console.error("Create report error:", err);
      throw err;
    }
  };

  /** -----------------------------
   * Update report
   * ----------------------------- */
  const updateReport = async (reportId, reportData) => {
    try {
      const res = await apiService.updateReport(reportId, reportData);
      const report = res?.report || res;

      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? report : r))
      );
      setLocations((prev) =>
        (prev || []).map((loc) =>
          loc.id === reportId
            ? {
                ...loc,
                lat: Number(report.lat),
                lng: Number(report.lng),
                title: report.title,
                type: report.type,
                status: report.status,
              }
            : loc
        )
      );

      return report;
    } catch (err) {
      console.error("Update report error:", err);
      throw err;
    }
  };

  /** -----------------------------
   * Update report status (admin)
   * ----------------------------- */
  const updateReportStatus = async (reportId, status) => {
    try {
      // Update status via API
      await apiService.updateReportStatus(reportId, status);

      // Fetch updated report (contains owner info)
      const updatedReport = await apiService.getReportById(reportId);

      setReports((prev) =>
        (prev || []).map((r) =>
          r.id === reportId ? { ...r, status } : r
        )
      );
      setLocations((prev) =>
        (prev || []).map((loc) =>
          loc.id === reportId ? { ...loc, status } : loc
        )
      );

      // Send notification to report owner
      const ownerId = updatedReport.user_id || updatedReport.user?.id;
      if (ownerId) {
        const message = `Your report "${updatedReport.title}" status is now "${status.toUpperCase()}"`;
        await apiService.sendNotification(ownerId, message);
      }

      // Refresh notifications
      fetchNotifications();
    } catch (err) {
      console.error("Update report status error:", err);
      throw err;
    }
  };

  /** -----------------------------
   * Delete report
   * ----------------------------- */
  const deleteReport = async (reportId) => {
    try {
      await apiService.deleteReport(reportId);

      setReports((prev) => (prev || []).filter((r) => r.id !== reportId));
      setLocations((prev) => (prev || []).filter((loc) => loc.id !== reportId));

      fetchNotifications();
    } catch (err) {
      console.error("Delete report error:", err);
      throw err;
    }
  };

  /** -----------------------------
   * Load user + reports + notifications on mount
   * ----------------------------- */
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchReports();
      fetchNotifications();
    }
  }, [currentUser, fetchReports, fetchNotifications]);

  return (
    <ReportContext.Provider
      value={{
        currentUser,
        userLoading,
        reports,
        locations,
        loading,
        notifications,
        notifLoading,
        fetchReports,
        fetchNotifications,
        createReport,
        updateReport,
        updateReportStatus,
        deleteReport,
        editingReport,
        setEditingReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
