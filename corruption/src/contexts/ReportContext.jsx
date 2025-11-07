<<<<<<< HEAD
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
=======
import React, { createContext, useContext, useState } from "react";
>>>>>>> 8ee82302ad8e629e3af058605fccfc362b7acbe9
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
<<<<<<< HEAD
      const data = await apiService.getReports(currentUser.id);
      setReports(Array.isArray(data) ? data : []);
=======
      const { data } = await axios.get(
        "http://localhost:5000/api/reports/user",
        { withCredentials: true }
      );
      // ✅ FIXED: Handle object response with reports property
      const reportsData = data.reports || data || [];
      setReports(reportsData);
>>>>>>> 8ee82302ad8e629e3af058605fccfc362b7acbe9
    } catch (err) {
      console.error("Fetch reports error:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

<<<<<<< HEAD
  // --- Create, update, delete, updateStatus remain the same
  const createReport = async (reportData) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/reports`,
        reportData,
        { withCredentials: true }
      );
      setReports((prev) => [data.report, ...(prev || [])]);
=======
  // --- Fetch all reports (admin only)
  const fetchAllReports = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/api/reports/all",
        { withCredentials: true }
      );
      // ✅ FIXED: Handle array response directly
      const reportsData = Array.isArray(data) ? data : data.reports || data || [];
      setReports(reportsData);
    } catch (err) {
      console.error("Fetch all reports error:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Create a new report
  const createReport = async (reportData) => {
    try {
      console.log("📤 Creating report with data:", reportData);
      
      // ✅ SIMPLIFIED: Always use JSON with proper headers
      const { data } = await axios.post(
        "http://localhost:5000/api/reports",
        reportData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ Report created successfully:", data);

      // ✅ FIXED: Handle response format
      const newReport = data.report || data;
      setReports((prev) => [newReport, ...(prev || [])]);
>>>>>>> 8ee82302ad8e629e3af058605fccfc362b7acbe9
      return data;
    } catch (err) {
      console.error("❌ Create report error:", err.response?.data || err);
      throw err;
    }
  };

  const updateReport = async (reportId, reportData) => {
    try {
<<<<<<< HEAD
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/reports/${reportId}`,
        reportData,
        { withCredentials: true }
      );
=======
      console.log("📤 Updating report:", reportId, reportData);
      
      const { data } = await axios.put(
        `http://localhost:5000/api/reports/${reportId}`,
        reportData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ Report updated successfully:", data);

      const updatedReport = data.report || data;
>>>>>>> 8ee82302ad8e629e3af058605fccfc362b7acbe9
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? updatedReport : r))
      );
      return data;
    } catch (err) {
      console.error("❌ Update report error:", err);
      throw err;
    }
  };

  const updateReportStatus = async (reportId, status) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/reports/${reportId}/status`,
        { status },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? { ...r, status } : r))
      );

<<<<<<< HEAD
      const reportOwnerId = data.report.user_id;
      const message = `Your report "${
        data.report.title
      }" status has been updated to "${status.toUpperCase()}"`;

      await axios.post(
        `${process.env.REACT_APP_API_URL}/notifications`,
        { user_id: reportOwnerId, message },
        { withCredentials: true }
      );
=======
      // Create notification
      const report = reports.find(r => r.id === reportId);
      if (report) {
        const reportOwnerId = report.user_id || report.userId;
        const message = `Your report "${report.title}" status has been updated to "${status}"`;

        await axios.post(
          "http://localhost:5000/api/notifications",
          { userId: reportOwnerId, message },
          { withCredentials: true }
        );
      }

      return data;
>>>>>>> 8ee82302ad8e629e3af058605fccfc362b7acbe9
    } catch (err) {
      console.error("❌ Update report status error:", err);
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
      console.error("❌ Delete report error:", err);
      throw err;
    }
  };

<<<<<<< HEAD
  // --- Load current user on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // --- Fetch reports whenever currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    fetchReports();
  }, [currentUser, fetchReports]);
=======
  // ✅ ADDED: Helper function to get user's reports
  const getUserReports = (userId) => {
    return reports.filter(report => report.user_id === userId || report.userId === userId);
  };
>>>>>>> 8ee82302ad8e629e3af058605fccfc362b7acbe9

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
        getUserReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};