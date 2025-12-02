import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiService from "../services/api";
import { useUsers } from "./UserContext";

const ReportContext = createContext();
export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const { currentUser } = useUsers();

  const [reports, setReports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ added
  const [notifications, setNotifications] = useState([]);
  const [hasCreatedFirstReport, setHasCreatedFirstReport] = useState(false);

  const normalizeType = (type) => type?.toLowerCase().replace(/\s+/g, "-") || "";

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const minimalReportsPromise =
        currentUser.role === "admin"
          ? apiService.getReports({ minimal: true })
          : apiService.getReports(currentUser.id, { minimal: true });

      const notificationsPromise = apiService.getNotifications();

      const [minimalReportsData, notificationsData] = await Promise.all([
        minimalReportsPromise,
        notificationsPromise,
      ]);

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

      // Fetch full reports
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
    } finally {
      setLoading(false); // ✅ stop loading
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) fetchDashboardData();
  }, [currentUser, fetchDashboardData]);

  // Optimistic create/update/delete functions remain the same
  const createReport = async (data) => { /* same as before */ };
  const updateReport = async (reportId, reportData) => { /* same */ };
  const deleteReport = async (reportId) => { /* same */ };
  const updateReportStatus = async (reportId, status) => { /* same */ };

  return (
    <ReportContext.Provider
      value={{
        currentUser,
        reports,
        locations,
        notifications,
        loading, // ✅ added
        hasCreatedFirstReport,
        fetchDashboardData,
        createReport,
        updateReport,
        deleteReport,
        updateReportStatus,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
