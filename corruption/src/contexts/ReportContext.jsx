import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiService from "../services/api";
import { useUsers } from "./UserContext";

const ReportContext = createContext();
export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const { currentUser } = useUsers();

  const [reports, setReports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [editingReport, setEditingReport] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [hasCreatedFirstReport, setHasCreatedFirstReport] = useState(false);

  /** Utility to normalize report type */
  const normalizeType = (type) => type?.toLowerCase().replace(/\s+/g, "-") || "";

  /** -----------------------------
   * Optimistic UI helpers
   * ----------------------------- */
  const addReportToDashboard = (tempReport) => {
    setReports((prev) => [tempReport, ...prev]);
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
    setReports((prev) => prev.map((r) => (r.id === tempId ? finalReport : r)));
    setLocations((prev) =>
      prev.map((loc) =>
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
    setReports((prev) => prev.filter((r) => r.id !== tempId));
    setLocations((prev) => prev.filter((loc) => loc.id !== tempId));
  };

  /** -----------------------------
   * Fetch reports & notifications instantly
   * ----------------------------- */
  const fetchDashboardData = useCallback(async () => {
    if (!currentUser) return;

    try {
      // Minimal reports + notifications in parallel
      const minimalReportsPromise =
        currentUser.role === "admin"
          ? apiService.getReports({ minimal: true })
          : apiService.getReports(currentUser.id, { minimal: true });

      const notificationsPromise = apiService.getNotifications();

      const [minimalReportsData, notificationsData] = await Promise.all([
        minimalReportsPromise,
        notificationsPromise,
      ]);

      // Map minimal reports
      const minimalReports = (minimalReportsData || []).map((r) => ({
        id: r.id,
        title: r.title || "",
        type: normalizeType(r.type),
        status: r.status || "Pending",
        lat: r.lat ? Number(r.lat) : null,
        lng: r.lng ? Number(r.lng) : null,
      }));

      setReports(minimalReports);
      setLocations(
        minimalReports
          .filter((r) => r.lat && r.lng)
          .map((r) => ({
            id: r.id,
            lat: r.lat,
            lng: r.lng,
            title: r.title,
            type: r.type,
            status: r.status,
          }))
      );

      setNotifications(notificationsData || []);

      if (minimalReports.length > 0) setHasCreatedFirstReport(true);

      // Fetch full reports in background
      const fullReportsData =
        currentUser.role === "admin"
          ? await apiService.getReports()
          : await apiService.getReports(currentUser.id);

      const fullReports = (fullReportsData || []).map((r) => ({
        ...r,
        type: normalizeType(r.type),
        lat: r.lat ? Number(r.lat) : null,
        lng: r.lng ? Number(r.lng) : null,
      }));

      setReports(fullReports);
      setLocations(
        fullReports
          .filter((r) => r.lat && r.lng)
          .map((r) => ({
            id: r.id,
            lat: r.lat,
            lng: r.lng,
            title: r.title,
            type: r.type,
            status: r.status,
          }))
      );
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setReports([]);
      setLocations([]);
      setNotifications([]);
    }
  }, [currentUser]);

  /** -----------------------------
   * Create report (Optimistic)
   * ----------------------------- */
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

    addReportToDashboard(tempReport);

    try {
      const form = new FormData();
      form.append("type", data.type);
      form.append("title", data.title);
      form.append("description", data.description);
      form.append("location", data.location);
      form.append("lat", data.lat);
      form.append("lng", data.lng);
      if (data.media) form.append("media", data.media);

      const res = await apiService.createReport(form);
      const savedReport = res?.report || res;
      savedReport.type = normalizeType(savedReport.type);

      replaceTempReport(tempId, savedReport);

      if (!hasCreatedFirstReport) setHasCreatedFirstReport(true);

      if (currentUser.role !== "admin") fetchDashboardData();

      return savedReport;
    } catch (err) {
      removeTempReport(tempId);
      throw err;
    }
  };

  /** -----------------------------
   * Update, delete, status helpers
   * ----------------------------- */
  const updateReport = async (reportId, reportData) => {
    try {
      const res = await apiService.updateReport(reportId, reportData);
      const updated = res?.report || res;
      updated.type = normalizeType(updated.type);

      setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === reportId
            ? { ...loc, lat: Number(updated.lat), lng: Number(updated.lng), title: updated.title, type: updated.type, status: updated.status }
            : loc
        )
      );

      return updated;
    } catch (err) {
      console.error("Update report error:", err);
      throw err;
    }
  };

  const updateReportStatus = async (reportId, status) => {
    try {
      await apiService.updateReportStatus(reportId, status);
      setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)));
      setLocations((prev) => prev.map((loc) => (loc.id === reportId ? { ...loc, status } : loc)));
      fetchDashboardData();
    } catch (err) {
      console.error("Update status error:", err);
      throw err;
    }
  };

  const deleteReport = async (reportId) => {
    try {
      await apiService.deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setLocations((prev) => prev.filter((loc) => loc.id !== reportId));
      fetchDashboardData();
    } catch (err) {
      console.error("Delete report error:", err);
      throw err;
    }
  };

  /** -----------------------------
   * Load dashboard data on login
   * ----------------------------- */
  useEffect(() => {
    if (currentUser) fetchDashboardData();
  }, [currentUser, fetchDashboardData]);

  return (
    <ReportContext.Provider
      value={{
        currentUser,
        reports,
        locations,
        notifications,
        hasCreatedFirstReport,
        editingReport,
        setEditingReport,
        fetchDashboardData,
        createReport,
        updateReport,
        updateReportStatus,
        deleteReport,
        addReportToDashboard,
        replaceTempReport,
        removeTempReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
