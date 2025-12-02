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
  const [loading, setLoading] = useState(true); // ✅ added
  const [notifications, setNotifications] = useState([]);
  const [hasCreatedFirstReport, setHasCreatedFirstReport] = useState(false);

  const normalizeType = (type) =>
    type?.toLowerCase().replace(/\s+/g, "-") || "";

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
  const createReport = async (data) => {
    try {
      // Generate temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempReport = { ...data, id: tempId, status: "Pending" };

      // Optimistically add to state
      setReports((prev) => [tempReport, ...(prev || [])]);
      if (tempReport.lat && tempReport.lng) {
        setLocations((prev) => [
          ...prev,
          {
            id: tempReport.id,
            lat: tempReport.lat,
            lng: tempReport.lng,
            title: tempReport.title,
            type: tempReport.type,
            status: tempReport.status,
          },
        ]);
      }

      // POST to backend
      const savedReport = await apiService.post("/reports", data);

      // Normalize
      const formattedReport = {
        ...savedReport,
        type: normalizeType(savedReport.type),
        lat: savedReport.lat ? Number(savedReport.lat) : null,
        lng: savedReport.lng ? Number(savedReport.lng) : null,
        status: savedReport.status || "Pending",
      };

      // Replace temp report with saved report
      setReports((prev) =>
        (prev || []).map((r) => (r.id === tempId ? formattedReport : r))
      );
      if (formattedReport.lat && formattedReport.lng) {
        setLocations((prev) =>
          prev.map((l) =>
            l.id === tempId
              ? {
                  ...l,
                  id: formattedReport.id,
                  lat: formattedReport.lat,
                  lng: formattedReport.lng,
                  title: formattedReport.title,
                  type: formattedReport.type,
                  status: formattedReport.status,
                }
              : l
          )
        );
      }

      setHasCreatedFirstReport(true);
      return formattedReport;
    } catch (err) {
      console.error("Error creating report:", err);
      // Remove temp report if backend fails
      setReports((prev) =>
        (prev || []).filter((r) => !r.id.toString().startsWith("temp-"))
      );
      toast.error("Failed to submit report");
      throw err;
    }
  };

  const updateReport = async (reportId, reportData) => {
    try {
      // Keep a copy of the old report for rollback
      const oldReport = reports.find((r) => r.id === reportId);

      // Optimistically update report in state
      const updatedTemp = { ...oldReport, ...reportData };
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? updatedTemp : r))
      );

      if (updatedTemp.lat && updatedTemp.lng) {
        setLocations((prev) =>
          (prev || []).map((l) =>
            l.id === reportId
              ? {
                  ...l,
                  lat: updatedTemp.lat,
                  lng: updatedTemp.lng,
                  title: updatedTemp.title,
                  type: updatedTemp.type,
                  status: updatedTemp.status,
                }
              : l
          )
        );
      }

      // Send update to backend
      const savedReport = await apiService.put(
        `/reports/${reportId}`,
        reportData
      );

      // Normalize
      const formattedReport = {
        ...savedReport,
        type: normalizeType(savedReport.type),
        lat: savedReport.lat ? Number(savedReport.lat) : null,
        lng: savedReport.lng ? Number(savedReport.lng) : null,
        status: savedReport.status || "Pending",
      };

      // Replace temp with backend result
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? formattedReport : r))
      );
      if (formattedReport.lat && formattedReport.lng) {
        setLocations((prev) =>
          (prev || []).map((l) =>
            l.id === reportId
              ? {
                  ...l,
                  lat: formattedReport.lat,
                  lng: formattedReport.lng,
                  title: formattedReport.title,
                  type: formattedReport.type,
                  status: formattedReport.status,
                }
              : l
          )
        );
      }

      return formattedReport;
    } catch (err) {
      console.error("Update report error:", err);
      toast.error("Failed to update report");
      // Rollback on failure
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? oldReport : r))
      );
      return null;
    }
  };

  const deleteReport = async (reportId) => {
    try {
      // Keep a copy for rollback
      const oldReports = [...reports];
      const oldLocations = [...locations];

      // Optimistically remove report
      setReports((prev) => (prev || []).filter((r) => r.id !== reportId));
      setLocations((prev) => (prev || []).filter((l) => l.id !== reportId));

      // Send delete to backend
      await apiService.delete(`/reports/${reportId}`);
      toast.success("Report deleted successfully");
    } catch (err) {
      console.error("Delete report error:", err);
      toast.error("Failed to delete report");

      // Rollback on failure
      setReports(oldReports);
      setLocations(oldLocations);
    }
  };

  const updateReportStatus = async (reportId, status) => {
    try {
      // Keep a copy for rollback
      const oldReport = reports.find((r) => r.id === reportId);

      // Optimistically update status
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? { ...r, status } : r))
      );
      setLocations((prev) =>
        (prev || []).map((l) => (l.id === reportId ? { ...l, status } : l))
      );

      // Send status update to backend
      const savedReport = await apiService.patch(
        `/reports/${reportId}/status`,
        { status }
      );

      // Normalize
      const formattedReport = {
        ...savedReport,
        type: normalizeType(savedReport.type),
        lat: savedReport.lat ? Number(savedReport.lat) : null,
        lng: savedReport.lng ? Number(savedReport.lng) : null,
        status: savedReport.status || "Pending",
      };

      // Replace with backend response
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? formattedReport : r))
      );
      setLocations((prev) =>
        (prev || []).map((l) =>
          l.id === reportId ? { ...l, status: formattedReport.status } : l
        )
      );

      return formattedReport;
    } catch (err) {
      console.error("Update status error:", err);
      toast.error("Failed to update status");
      // Rollback
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? oldReport : r))
      );
      return null;
    }
  };

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
