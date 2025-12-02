import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiService from "../services/api";
import { useUsers } from "./UserContext";
import toast from "react-hot-toast";

const ReportContext = createContext();
export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const { currentUser } = useUsers();

  const [reports, setReports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) fetchDashboardData();
  }, [currentUser, fetchDashboardData]);

  // ─── CREATE REPORT ───
  const createReport = async (data) => {
    try {
      const tempId = `temp-${Date.now()}`;
      const tempReport = { ...data, id: tempId, status: "Pending" };

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

      const savedReport = await apiService.post("/reports", data);

      const formattedReport = {
        ...savedReport,
        type: normalizeType(savedReport.type),
        lat: savedReport.lat ? Number(savedReport.lat) : null,
        lng: savedReport.lng ? Number(savedReport.lng) : null,
        status: savedReport.status || "Pending",
      };

      setReports((prev) =>
        (prev || []).map((r) => (r.id === tempId ? formattedReport : r))
      );
      if (formattedReport.lat && formattedReport.lng) {
        setLocations((prev) =>
          (prev || []).map((l) =>
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
      setReports((prev) =>
        (prev || []).filter((r) => !r.id.toString().startsWith("temp-"))
      );
      toast.error("Failed to submit report");
      throw err;
    }
  };

  // ─── UPDATE REPORT ───
  const updateReport = async (reportId, reportData) => {
    const oldReport = reports.find((r) => r.id === reportId); // ✅ defined here
    try {
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

      const savedReport = await apiService.put(`/reports/${reportId}`, reportData);

      const formattedReport = {
        ...savedReport,
        type: normalizeType(savedReport.type),
        lat: savedReport.lat ? Number(savedReport.lat) : null,
        lng: savedReport.lng ? Number(savedReport.lng) : null,
        status: savedReport.status || "Pending",
      };

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
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? oldReport : r))
      );
      return null;
    }
  };

  // ─── DELETE REPORT ───
  const deleteReport = async (reportId) => {
    const oldReports = [...reports]; // ✅ defined here
    const oldLocations = [...locations]; // ✅ defined here
    try {
      setReports((prev) => (prev || []).filter((r) => r.id !== reportId));
      setLocations((prev) => (prev || []).filter((l) => l.id !== reportId));

      await apiService.delete(`/reports/${reportId}`);
      toast.success("Report deleted successfully");
    } catch (err) {
      console.error("Delete report error:", err);
      toast.error("Failed to delete report");

      setReports(oldReports);
      setLocations(oldLocations);
    }
  };

  // ─── UPDATE STATUS ───
  const updateReportStatus = async (reportId, status) => {
    const oldReport = reports.find((r) => r.id === reportId); // ✅ defined here
    try {
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? { ...r, status } : r))
      );
      setLocations((prev) =>
        (prev || []).map((l) => (l.id === reportId ? { ...l, status } : l))
      );

      const savedReport = await apiService.patch(`/reports/${reportId}/status`, { status });

      const formattedReport = {
        ...savedReport,
        type: normalizeType(savedReport.type),
        lat: savedReport.lat ? Number(savedReport.lat) : null,
        lng: savedReport.lng ? Number(savedReport.lng) : null,
        status: savedReport.status || "Pending",
      };

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
        loading,
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
