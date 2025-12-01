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

  /** Utility to normalize report type */
  const normalizeType = (type) =>
    type?.toLowerCase().replace(/\s+/g, "-") || "";

  /** ---------------------------------------------------
   * Helpers for Optimistic UI
   * --------------------------------------------------- */

  const addReportToDashboard = (tempReport) => {
    setReports((prev) => [tempReport, ...(prev || [])]);
    setLocations((prev) => [
      ...prev,
      {
        id: tempReport.id,
        lat: Number(tempReport.lat),
        lng: Number(tempReport.lng),
        title: tempReport.title,
        type: tempReport.type,
        status: tempReport.status,
      },
    ]);
  };

  const replaceTempReport = (tempId, finalReport) => {
    setReports((prev) =>
      (prev || []).map((r) => (r.id === tempId ? finalReport : r))
    );

    setLocations((prev) =>
      (prev || []).map((loc) =>
        loc.id === tempId
          ? {
              ...loc,
              id: finalReport.id,
              lat: Number(finalReport.lat),
              lng: Number(finalReport.lng),
              title: finalReport.title,
              type: finalReport.type,
              status: finalReport.status,
            }
          : loc
      )
    );
  };

  const removeTempReport = (tempId) => {
    setReports((prev) => (prev || []).filter((r) => r.id !== tempId));
    setLocations((prev) => (prev || []).filter((loc) => loc.id !== tempId));
  };

  /** ---------------------------------------------------
   * Fetch reports progressively (Fast UI → Full data)
   * --------------------------------------------------- */
  const fetchReports = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const userId = currentUser.id;

      /** STEP 1: Fetch MINIMAL reports immediately */
      const minimalData =
        currentUser.role === "admin"
          ? await apiService.getReports({ minimal: true })
          : await apiService.getReports(userId, { minimal: true });

      const minimalReports = (minimalData || []).map((report) => ({
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

      /** STEP 2: Fetch FULL report data in background */
      const fullData =
        currentUser.role === "admin"
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

  /** ---------------------------------------------------
   * Fetch Notifications
   * --------------------------------------------------- */
  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;

    setNotifLoading(true);
    try {
      const data = await apiService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to get notifications:", err);
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  }, [currentUser]);

  /** ---------------------------------------------------
   * Create Report (Optimistic)
   * --------------------------------------------------- */
  const createReport = async (data) => {
  if (!currentUser) throw new Error("User not logged in");

  const tempId = `temp-${Date.now()}`;

  const tempReport = {
    id: tempId,
    type: normalizeType(data.type),
    title: data.title,
    description: data.description,
    location: data.location,
    lat: data.lat,
    lng: data.lng,
    media: data.media || null,
    status: "Pending",
  };

  // Optimistic: instant UI update
  addReportToDashboard(tempReport);

  try {
    // Convert raw data into FormData for backend
    const form = new FormData();
    form.append("type", data.type);
    form.append("title", data.title);
    form.append("description", data.description);
    form.append("location", data.location);
    form.append("lat", data.lat);
    form.append("lng", data.lng);
    if (data.media) form.append("media", data.media);

    // Send to backend
    const res = await apiService.createReport(form);
    const savedReport = res?.report || res;

    savedReport.type = normalizeType(savedReport.type);

    // Replace temporary report with real one
    replaceTempReport(tempId, savedReport);

    if (!hasCreatedFirstReport) setHasCreatedFirstReport(true);

    if (currentUser.role !== "admin") {
      fetchNotifications();
    }

    return savedReport;
  } catch (err) {
    removeTempReport(tempId);
    throw err;
  }
};


  /** ---------------------------------------------------
   * Update Report
   * --------------------------------------------------- */
  const updateReport = async (reportId, reportData) => {
    try {
      const res = await apiService.updateReport(reportId, reportData);
      const updated = res?.report || res;

      updated.type = normalizeType(updated.type);

      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? updated : r))
      );

      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === reportId
            ? {
                ...loc,
                lat: Number(updated.lat),
                lng: Number(updated.lng),
                title: updated.title,
                type: updated.type,
                status: updated.status,
              }
            : loc
        )
      );

      return updated;
    } catch (err) {
      console.error("Update report error:", err);
      throw err;
    }
  };

  /** ---------------------------------------------------
   * Update Report Status (Admin)
   * --------------------------------------------------- */
  const updateReportStatus = async (reportId, status) => {
    try {
      await apiService.updateReportStatus(reportId, status);

      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );

      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === reportId ? { ...loc, status } : loc
        )
      );

      fetchNotifications();
    } catch (err) {
      console.error("Update status error:", err);
      throw err;
    }
  };

  /** ---------------------------------------------------
   * Delete Report
   * --------------------------------------------------- */
  const deleteReport = async (reportId) => {
    try {
      await apiService.deleteReport(reportId);

      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setLocations((prev) => prev.filter((loc) => loc.id !== reportId));

      fetchNotifications();
    } catch (err) {
      console.error("Delete report error:", err);
      throw err;
    }
  };

  /** ---------------------------------------------------
   * When user logs in → Load data
   * --------------------------------------------------- */
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

        // Functions
        fetchReports,
        fetchNotifications,
        createReport,
        updateReport,
        updateReportStatus,
        deleteReport,

        editingReport,
        setEditingReport,

        // Optimistic helpers
        addReportToDashboard,
        replaceTempReport,
        removeTempReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
