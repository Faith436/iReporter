// src/contexts/ReportContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import apiService from "../services/api";

const ReportContext = createContext();
export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [locations, setLocations] = useState([]); // <-- new for map
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [editingReport, setEditingReport] = useState(null);

  // --- Fetch logged-in user
  const fetchCurrentUser = useCallback(async () => {
    setUserLoading(true);
    try {
      const user = await apiService.getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      setCurrentUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);

  // --- Fetch reports
  const fetchReports = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      let data;

      const role = currentUser?.role || currentUser?.user?.role;

      if (role === "admin") {
        data = await apiService.getReports(); // all reports
      } else {
        const userId = currentUser.id || currentUser.user?.id;
        data = await apiService.getReports(userId);
      }

      const reportsWithUser = (data || []).map((report) => ({
        ...report,
        userName:
          report.userName ||
          `${report.first_name || ""} ${report.last_name || ""}`.trim(),
        userEmail: report.userEmail || report.email,
      }));

      setReports(reportsWithUser);

      // --- populate locations for the map
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

  // --- Create report
  const createReport = async (reportData) => {
    try {
      const { data } = await apiService.createReport(reportData);
      const report = data?.report || data;

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

      return report;
    } catch (err) {
      console.error("Create report error:", err);
      throw err;
    }
  };

  // --- Update report
  const updateReport = async (reportId, reportData) => {
    try {
      const { data } = await apiService.updateReport(reportId, reportData);
      const report = data?.report || data;

      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? report : r))
      );
      setLocations((prev) =>
        (prev || []).map((loc) =>
          loc.id === reportId
            ? { ...loc, lat: Number(report.lat), lng: Number(report.lng), title: report.title, type: report.type, status: report.status }
            : loc
        )
      );

      return report;
    } catch (err) {
      console.error("Update report error:", err);
      throw err;
    }
  };

  // --- Update report status
  const updateReportStatus = async (reportId, status) => {
    try {
      const { data } = await apiService.updateReportStatus(reportId, status);
      const report = data?.report || data;

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

      // Notify user
      const reportOwnerId = report.user_id;
      const message = `Your report "${report.title}" status has been updated to "${status.toUpperCase()}"`;
      await apiService.sendNotification(reportOwnerId, message);
    } catch (err) {
      console.error("Update report status error:", err);
      throw err;
    }
  };

  // --- Delete report
  const deleteReport = async (reportId) => {
    try {
      await apiService.deleteReport(reportId);
      setReports((prev) => (prev || []).filter((r) => r.id !== reportId));
      setLocations((prev) => (prev || []).filter((loc) => loc.id !== reportId));
    } catch (err) {
      console.error("Delete report error:", err);
      throw err;
    }
  };

  // --- Load current user on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // --- Fetch reports whenever currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    fetchReports();
  }, [currentUser, fetchReports]);

  return (
    <ReportContext.Provider
      value={{
        reports,
        locations, // <-- expose locations to the map
        loading,
        currentUser,
        userLoading,
        fetchReports,
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
