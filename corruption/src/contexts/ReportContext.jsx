// src/contexts/ReportContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiService from "../services/api";
import { useUsers } from "./UserContext";

const ReportContext = createContext();
export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const { currentUser } = useUsers();

  const [reports, setReports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  const [hasCreatedFirstReport, setHasCreatedFirstReport] = useState(false);

  // Utility: normalize report type
  const normalizeType = (type) =>
    type?.toLowerCase().replace(/\s+/g, "-") || "";

  /** -----------------------------
   * Fetch reports
   * ----------------------------- */
  /** -----------------------------
   * Fetch reports progressively
   * ----------------------------- */
  const fetchReports = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      let data = [];
      const role = currentUser.role;
      const userId = currentUser.id;

      // Step 1: fetch minimal info for immediate dashboard display
      if (role === "admin") {
        data = await apiService.getReports({ minimal: true });
      } else {
        data = await apiService.getReports(userId, { minimal: true });
      }

      // Map minimal data for instant UI
      const minimalReports = (data || []).map((report) => ({
        id: report.id,
        title: report.title || "",
        type: normalizeType(report.type),
        status: report.status || "Pending",
        userName:
          report.userName ||
          `${report.first_name || ""} ${report.last_name || ""}`.trim(),
        userEmail: report.userEmail || report.email,
        lat: report.lat ? Number(report.lat) : null,
        lng: report.lng ? Number(report.lng) : null,
      }));

      setReports(minimalReports);
      setLocations(
        minimalReports
          .filter((r) => r.lat && r.lng)
          .map((r) => ({
            id: r.id,
            lat: Number(r.lat),
            lng: Number(r.lng),
            title: r.title,
            type: r.type,
            status: r.status,
          }))
      );

      if (minimalReports.length > 0) setHasCreatedFirstReport(true);

      // Step 2: fetch full details in the background
      const fullData =
        role === "admin"
          ? await apiService.getReports()
          : await apiService.getReports(userId);

      const fullReports = (fullData || []).map((report) => ({
        ...report,
        type: normalizeType(report.type),
        userName:
          report.userName ||
          `${report.first_name || ""} ${report.last_name || ""}`.trim(),
        userEmail: report.userEmail || report.email,
        lat: report.lat ? Number(report.lat) : null,
        lng: report.lng ? Number(report.lng) : null,
      }));

      // Replace minimal reports with full data
      setReports(fullReports);
      setLocations(
        fullReports
          .filter((r) => r.lat && r.lng)
          .map((r) => ({
            id: r.id,
            lat: Number(r.lat),
            lng: Number(r.lng),
            title: r.title,
            type: r.type,
            status: r.status,
          }))
      );
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
      setNotifications(data || []);
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

    // 1️⃣ Create a temporary report for instant display
    const tempId = `temp-${Date.now()}`;
    const tempReport = {
      id: tempId,
      type: normalizeType(
        reportData.type === "Red Flag" ? "red-flag" : "intervention"
      ),
      title: reportData.title,
      description: reportData.description,
      location: reportData.location,
      lat: reportData.lat,
      lng: reportData.lng,
      media: reportData.media || null,
      status: "Pending",
    };

    setReports((prev) => [tempReport, ...(prev || [])]);
    setLocations((prev) => [
      ...prev,
      {
        id: tempId,
        lat: Number(reportData.lat),
        lng: Number(reportData.lng),
        title: reportData.title,
        type: tempReport.type,
        status: "Pending",
      },
    ]);

    try {
      // 2️⃣ Send report to backend
      const res = await apiService.createReport(reportData);
      const savedReport = res?.report || res;

      savedReport.type = normalizeType(savedReport.type);

      // 3️⃣ Replace temporary report with backend-confirmed report
      setReports((prev) =>
        prev.map((r) => (r.id === tempId ? savedReport : r))
      );
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === tempId
            ? {
                ...loc,
                id: savedReport.id,
                lat: Number(savedReport.lat),
                lng: Number(savedReport.lng),
                title: savedReport.title,
                type: savedReport.type,
                status: savedReport.status,
              }
            : loc
        )
      );

      if (!hasCreatedFirstReport) setHasCreatedFirstReport(true);

      if (currentUser.role !== "admin") {
        fetchNotifications();
      }

      return savedReport;
    } catch (err) {
      console.error("Create report error:", err);

      // 4️⃣ Remove temporary report if backend fails
      setReports((prev) => prev.filter((r) => r.id !== tempId));
      setLocations((prev) => prev.filter((loc) => loc.id !== tempId));

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

      report.type = normalizeType(report.type);

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
      await apiService.updateReportStatus(reportId, status);

      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? { ...r, status } : r))
      );
      setLocations((prev) =>
        (prev || []).map((loc) =>
          loc.id === reportId ? { ...loc, status } : loc
        )
      );

      const updatedReport = await apiService.getReportById(reportId);
      const ownerId = updatedReport.user_id || updatedReport.user?.id;
      if (ownerId) {
        const message = `Your report "${
          updatedReport.title
        }" status is now "${status.toUpperCase()}"`;
        await apiService.sendNotification(ownerId, message);
      }

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
   * Load reports + notifications on user change
   * ----------------------------- */
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
        reports,
        locations,
        loading,
        notifications,
        notifLoading,
        hasCreatedFirstReport,
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
