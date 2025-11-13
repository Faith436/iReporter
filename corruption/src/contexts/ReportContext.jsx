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
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [editingReport, setEditingReport] = useState(null); // currently editing report

  // --- Fetch logged-in user
  const fetchCurrentUser = useCallback(async () => {
    setUserLoading(true);
    try {
      const user = await apiService.getCurrentUser(); // /api/auth/me
      setCurrentUser(user);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      setCurrentUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);


  console.log("Current user:", currentUser);


  // --- Fetch reports (admin: all, user: own only)
const fetchReports = useCallback(async () => {
  if (!currentUser) return;

  try {
    setLoading(true);
    let data;

    const role = currentUser?.role || currentUser?.user?.role;

    if (role === "admin") {
      // Admin: get all reports
      data = await apiService.getReports(); // call without userId
    } else {
      // User: get own reports
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
  } catch (err) {
    console.error("Fetch reports error:", err);
    setReports([]);
  } finally {
    setLoading(false);
  }
}, [currentUser]);


  // --- Create report
  const createReport = async (reportData) => {
    try {
      const { data } = await apiService.createReport(reportData);
      const report = data?.report || data; // safe fallback
      setReports((prev) => [report, ...(prev || [])]);
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
        (prev || []).map((r) => (r.id === reportId ? { ...r, status } : r))
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
        loading,
        currentUser,
        userLoading,
        fetchReports,
        createReport,
        updateReport,
        updateReportStatus,
        deleteReport,
        editingReport,
        setEditingReport, // allow stepper or admin view to set the report
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
