import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import apiService from "../services/api";

const ReportContext = createContext();
export const useReports = () => useContext(ReportContext);



export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // --- Fetch logged-in user from backend
  const fetchCurrentUser = useCallback(async () => {
    setUserLoading(true);
    try {
      const user = await apiService.getCurrentUser(); // /api/auth/me
      setCurrentUser(user);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      setCurrentUser(null);
    }finally {
    setUserLoading(false);
  }
  }, []);

  // --- Unified fetch reports for admin or user
  const fetchReports = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const data = await apiService.getReports(currentUser.id);
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch reports error:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // --- Create, update, delete, updateStatus remain the same
  const createReport = async (reportData) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/reports`,
        reportData,
        { withCredentials: true }
      );
      setReports((prev) => [data.report, ...(prev || [])]);
      return data;
    } catch (err) {
      console.error("Create report error:", err);
      throw err;
    }
  };

  const updateReport = async (reportId, reportData) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/reports/${reportId}`,
        reportData,
        { withCredentials: true }
      );
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? data.report : r))
      );
      return data;
    } catch (err) {
      console.error("Update report error:", err);
      throw err;
    }
  };

  const updateReportStatus = async (reportId, status) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/reports/${reportId}/status`,
        { status },
        { withCredentials: true }
      );
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? { ...r, status } : r))
      );

      const reportOwnerId = data.report.user_id;
      const message = `Your report "${
        data.report.title
      }" status has been updated to "${status.toUpperCase()}"`;

      await axios.post(
        `${process.env.REACT_APP_API_URL}/notifications`,
        { user_id: reportOwnerId, message },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Update report status error:", err);
      throw err;
    }
  };

  const deleteReport = async (reportId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/reports/${reportId}`,
        {
          withCredentials: true,
        }
      );
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
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
