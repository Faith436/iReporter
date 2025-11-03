// src/contexts/ReportContext.jsx
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
      setReports(Array.isArray(data) ? data : []);
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
      setReports(Array.isArray(data) ? data : []);
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
      const formData = new FormData();

      Object.keys(reportData).forEach((key) => {
        if (key === "media" && Array.isArray(reportData.media)) {
          reportData.media.forEach((file) => formData.append("media", file));
        } else {
          formData.append(key, reportData[key]);
        }
      });

      const { data } = await axios.post(
        "http://localhost:5000/api/reports",
        formData,
        {
          withCredentials: true,
        }
      );

      setReports((prev) => [data.report, ...(prev || [])]);
      return data;
    } catch (err) {
      console.error("Create report error:", err);
      throw err;
    }
  };

  // --- Update an existing report
  const updateReport = async (reportId, reportData) => {
    try {
      const formData = new FormData();

      Object.keys(reportData).forEach((key) => {
        if (key === "media" && Array.isArray(reportData.media)) {
          reportData.media.forEach((file) => formData.append("media", file));
        } else {
          formData.append(key, reportData[key]);
        }
      });

      const { data } = await axios.put(
        `http://localhost:5000/api/reports/${reportId}`,
        formData,
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

  // --- Update report status (admin only)
  const updateReportStatus = async (reportId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/reports/${reportId}/status`,
        { status },
        { withCredentials: true }
      );

      setReports((prev) =>
        (prev || []).map((r) => (r.id === reportId ? { ...r, status } : r))
      );

      const reportOwnerId = data.report.user_id;
      const message = `Your report "${data.report.title}" status has been updated to "${status.toUpperCase()}"`;

      await axios.post(
        "http://localhost:5000/api/notifications",
        { userId: reportOwnerId, message },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Update report status error:", err);
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
      console.error("Delete report error:", err);
      throw err;
    }
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
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
