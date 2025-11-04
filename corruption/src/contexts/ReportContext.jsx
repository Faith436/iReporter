import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useUsers } from "./UserContext";

const ReportContext = createContext();
export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
  const { currentUser } = useUsers();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Fetch user's own reports
  const fetchUserReports = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5000/api/reports/user",
        { withCredentials: true }
      );
      // ✅ FIXED: Handle object response with reports property
      const reportsData = data.reports || data || [];
      setReports(reportsData);
    } catch (err) {
      console.error("Fetch user reports error:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

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
      return data;
    } catch (err) {
      console.error("❌ Create report error:", err.response?.data || err);
      throw err;
    }
  };

  // --- Update an existing report
  const updateReport = async (reportId, reportData) => {
    try {
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
      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? updatedReport : r))
      );

      return data;
    } catch (err) {
      console.error("❌ Update report error:", err);
      throw err;
    }
  };

  // --- Update report status (admin only)
  const updateReportStatus = async (reportId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/reports/${reportId}/status`,
        { status },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? { ...r, status } : r))
      );

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
    } catch (err) {
      console.error("❌ Update report status error:", err);
      throw err;
    }
  };

  // --- Delete a report
  const deleteReport = async (reportId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reports/${reportId}`, {
        withCredentials: true,
      });
      setReports((prev) => (prev || []).filter((r) => r.id !== reportId));
    } catch (err) {
      console.error("❌ Delete report error:", err);
      throw err;
    }
  };

  // ✅ ADDED: Helper function to get user's reports
  const getUserReports = (userId) => {
    return reports.filter(report => report.user_id === userId || report.userId === userId);
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        loading,
        fetchUserReports,
        fetchAllReports,
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