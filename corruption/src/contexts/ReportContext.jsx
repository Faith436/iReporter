<<<<<<< Updated upstream
// ReportContext.jsx - REFACTORED & FIXED VERSION
import React, { createContext, useContext, useState, useEffect } from "react";
=======
// import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
// import apiService from '../services/api';
// import { useUsers } from './UserContext';

// const ReportContext = createContext();

// export const useReports = () => {
//   const context = useContext(ReportContext);
//   if (!context) {
//     throw new Error('useReports must be used within a ReportProvider');
//   }
//   return context;
// };

// export const ReportProvider = ({ children }) => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { currentUser } = useUsers();

//   // Use useCallback to prevent infinite re-renders
//   const fetchAllReports = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const allReports = await apiService.getAllReports();
//       setReports(allReports);
//     } catch (error) {
//       console.error('Error fetching all reports:', error);
//       setError('Failed to fetch reports');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchUserReports = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const userReports = await apiService.getUserReports();
//       setReports(userReports);
//     } catch (error) {
//       console.error('Error fetching user reports:', error);
//       setError('Failed to fetch your reports');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const createReport = async (formData) => {
//     try {
//       setLoading(true);
//       const newReport = await apiService.createReport(formData);
//       setReports(prev => [newReport.report, ...prev]);
//       return newReport;
//     } catch (error) {
//       console.error('Error creating report:', error);
//       setError('Failed to create report');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateReport = async (id, reportData) => {
//     try {
//       setLoading(true);
//       const updatedReport = await apiService.updateReport(id, reportData);
//       setReports(prev => 
//         prev.map(report => report.id === id ? updatedReport.report : report)
//       );
//       return updatedReport;
//     } catch (error) {
//       console.error('Error updating report:', error);
//       setError('Failed to update report');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteReport = async (id) => {
//     try {
//       setLoading(true);
//       await apiService.deleteReport(id);
//       setReports(prev => prev.filter(report => report.id !== id));
//     } catch (error) {
//       console.error('Error deleting report:', error);
//       setError('Failed to delete report');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStats = () => {
//     const userReports = currentUser?.role === 'admin' 
//       ? reports 
//       : reports.filter(report => report.user_id === currentUser?.id);
    
//     return {
//       total: userReports.length,
//       redFlags: userReports.filter(r => r.report_type === 'Red-Flag').length,
//       interventions: userReports.filter(r => r.report_type === 'Intervention').length,
//       pending: userReports.filter(r => r.status === 'pending').length,
//       resolved: userReports.filter(r => r.status === 'resolved').length,
//     };
//   };

//   const getUserReports = () => {
//     if (currentUser?.role === 'admin') {
//       return reports;
//     }
//     return reports.filter(report => report.user_id === currentUser?.id);
//   };

//   const clearError = () => setError(null);

//   // Fixed useEffect with proper dependencies
//   useEffect(() => {
//     if (currentUser) {
//       if (currentUser.role === 'admin') {
//         fetchAllReports();
//       } else {
//         fetchUserReports();
//       }
//     } else {
//       // Clear reports when user logs out
//       setReports([]);
//     }
//   }, [currentUser, fetchAllReports, fetchUserReports]);

//   const value = {
//     reports,
//     loading,
//     error,
//     fetchAllReports,
//     fetchUserReports,
//     createReport,
//     updateReport,
//     deleteReport,
//     getStats,
//     getUserReports,
//     clearError,
//   };

//   return (
//     <ReportContext.Provider value={value}>
//       {children}
//     </ReportContext.Provider>
//   );
// };

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useUsers } from '../contexts/UserContext';
>>>>>>> Stashed changes

const ReportContext = createContext();

// Key for localStorage
const REPORTS_KEY = "ireporter-reports";
const NOTIFICATIONS_KEY = "ireporter-notifications";

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) throw new Error("useReports must be used within a ReportProvider");
  return context;
};

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
<<<<<<< Updated upstream
  const [notifications, setNotifications] = useState([]);

  // Load reports and notifications from localStorage
  useEffect(() => {
    try {
      const storedReports = JSON.parse(localStorage.getItem(REPORTS_KEY)) || [];
      const storedNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
      setReports(storedReports);
      setNotifications(storedNotifications);
    } catch (error) {
      console.error("Error loading data:", error);
      setReports([]);
      setNotifications([]);
    }
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }, [reports]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Create a new report
  const createReport = (reportData) => {
    const newReport = {
      id: Date.now(),
      ...reportData,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    setReports((prev) => [newReport, ...prev]);

    // Notify admin
    createNotification({
      title: "New Report Submitted",
      message: `User ${reportData.userName || "A user"} submitted: "${reportData.title}"`,
      type: "new-report",
      targetUser: "admin",
      reportId: newReport.id,
    });

    // Notify user
    createNotification({
      title: "Report Submitted",
      message: `Your report "${reportData.title}" has been submitted.`,
      type: "submission",
      targetUser: reportData.userId,
      reportId: newReport.id,
    });

    return newReport;
  };

  // Update a report
  const updateReport = (id, updates) => {
    setReports((prevReports) =>
      prevReports.map((report) => {
        if (report.id === id) {
          const oldStatus = report.status;
          const newStatus = updates.status;

          // Notify user if status changed
          if (newStatus && newStatus !== oldStatus) {
            createNotification({
              title: "Status Updated",
              message: `Your report "${report.title}" is now ${newStatus.replace("-", " ")}`,
              type: "status-update",
              targetUser: report.userId,
              reportId: id,
            });
          }

          return { ...report, ...updates };
        }
        return report;
      })
    );
  };

  // Delete a report
  const deleteReport = (id) => {
    const reportToDelete = reports.find((r) => r.id === id);
    setReports((prev) => prev.filter((r) => r.id !== id));

    if (reportToDelete) {
      createNotification({
        title: "Report Deleted",
        message: `User ${reportToDelete.userName} deleted: "${reportToDelete.title}"`,
        type: "report-deleted",
        targetUser: "admin",
        reportId: id,
      });
    }
  };

  // Create a notification
  const createNotification = (notificationData) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notificationData,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    return newNotification;
  };

  // Get reports for a specific user
  const getUserReports = (userId) => reports.filter((r) => r.userId === userId);

  // Get all reports (admin)
  const getAllReports = () => reports;

  // Get notifications for current user
  const getUserNotifications = (currentUser) => {
    if (!currentUser) return [];
    return notifications.filter((n) =>
      currentUser.role === "admin" ? n.targetUser === "admin" : n.targetUser === currentUser.id
    );
  };

  // Get unread notifications count for user
  const getUnreadCount = (currentUser) =>
    getUserNotifications(currentUser).filter((n) => !n.read).length;

  // Mark a notification as read
  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Remove a notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Get quick stats
  const getStats = (userId = null) => {
    let filteredReports = reports;
    if (userId) filteredReports = reports.filter((r) => r.userId === userId);

    return {
      total: filteredReports.length,
      redFlags: filteredReports.filter((r) => r.reportType === "red-flag").length,
      interventions: filteredReports.filter((r) => r.reportType === "intervention").length,
      pending: filteredReports.filter((r) => r.status === "pending").length,
      underInvestigation: filteredReports.filter((r) => r.status === "under-investigation").length,
      resolved: filteredReports.filter((r) => r.status === "resolved").length,
    };
  };

=======
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useUsers();

  // ✅ FIXED: API helper function using fetch instead of broken apiService
  const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    // Remove Content-Type for FormData (file uploads)
    if (options.body instanceof FormData) {
      delete defaultOptions.headers['Content-Type'];
    }

    try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`, defaultOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      throw error;
    }
  };

  // ✅ FIXED: Handle different response formats
  const extractReportsArray = (data) => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.data)) {
        return data.data;
      } else if (Array.isArray(data.reports)) {
        return data.reports;
      } else if (data.success && Array.isArray(data.data)) {
        return data.data;
      }
    }
    return [];
  };

  // ✅ FIXED: Updated getStats function
  const getStats = (reportsData) => {
    const reportsArray = extractReportsArray(reportsData);
    
    return {
      total: reportsArray.length,
      pending: reportsArray.filter(report => report.status === 'pending').length,
      resolved: reportsArray.filter(report => report.status === 'resolved').length,
      rejected: reportsArray.filter(report => report.status === 'rejected').length,
      underInvestigation: reportsArray.filter(report => report.status === 'under investigation').length
    };
  };

  // ✅ FIXED: Fetch user's reports using fetch
  const fetchUserReports = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('📊 Fetching user reports...');
      
      const response = await apiRequest('/reports/user');
      console.log('📦 User reports response:', response);
      
      const reportsArray = extractReportsArray(response);
      setReports(reportsArray);
      
      console.log(`✅ Loaded ${reportsArray.length} user reports`);
    } catch (err) {
      console.error('❌ Error fetching user reports:', err);
      setError(err.message || 'Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // ✅ FIXED: Fetch all reports (admin only) using fetch
  const fetchAllReports = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('📊 Fetching all reports (admin)...');
      
      const response = await apiRequest('/reports/all');
      console.log('📦 All reports response:', response);
      
      const reportsArray = extractReportsArray(response);
      setAllReports(reportsArray);
      
      console.log(`✅ Loaded ${reportsArray.length} total reports`);
    } catch (err) {
      console.error('❌ Error fetching all reports:', err);
      setError(err.message || 'Failed to load all reports');
      setAllReports([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // ✅ FIXED: Create new report using fetch
  const createReport = async (reportData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📝 Creating new report...', reportData);
      
      const response = await apiRequest('/reports', {
        method: 'POST',
        body: reportData instanceof FormData ? reportData : JSON.stringify(reportData),
      });
      console.log('✅ Report created:', response);
      
      // Refresh the reports list
      await fetchUserReports();
      
      return response;
    } catch (err) {
      console.error('❌ Error creating report:', err);
      setError(err.message || 'Failed to create report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Update report status using fetch
  const updateReportStatus = async (reportId, status) => {
    try {
      setError(null);
      console.log(`🔄 Updating report ${reportId} status to:`, status);
      
      const response = await apiRequest(`/reports/${reportId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      console.log('✅ Report status updated:', response);
      
      // Refresh reports
      if (currentUser?.role === 'admin') {
        await fetchAllReports();
      } else {
        await fetchUserReports();
      }
      
      return response;
    } catch (err) {
      console.error('❌ Error updating report status:', err);
      setError(err.message || 'Failed to update report status');
      throw err;
    }
  };

  // ✅ FIXED: Update report using fetch
  const updateReport = async (reportId, reportData) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`📝 Updating report ${reportId}:`, reportData);
      
      const response = await apiRequest(`/reports/${reportId}`, {
        method: 'PUT',
        body: reportData instanceof FormData ? reportData : JSON.stringify(reportData),
      });
      console.log('✅ Report updated:', response);
      
      // Refresh reports
      await fetchUserReports();
      
      return response;
    } catch (err) {
      console.error('❌ Error updating report:', err);
      setError(err.message || 'Failed to update report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Delete report using fetch
  const deleteReport = async (reportId) => {
    try {
      setError(null);
      console.log(`🗑️ Deleting report ${reportId}`);
      
      const response = await apiRequest(`/reports/${reportId}`, {
        method: 'DELETE',
      });
      console.log('✅ Report deleted:', response);
      
      // Refresh reports
      await fetchUserReports();
      
      return response;
    } catch (err) {
      console.error('❌ Error deleting report:', err);
      setError(err.message || 'Failed to delete report');
      throw err;
    }
  };

  // ✅ FIXED: Get single report using fetch
  const getReport = async (reportId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest(`/reports/${reportId}`);
      console.log('📄 Single report:', response);
      
      return response;
    } catch (err) {
      console.error('❌ Error fetching report:', err);
      setError(err.message || 'Failed to fetch report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Get report statistics using fetch
  const getReportStats = async () => {
    try {
      setError(null);
      
      const response = await apiRequest('/reports/stats');
      console.log('📈 Report stats:', response);
      
      return response;
    } catch (err) {
      console.error('❌ Error fetching report stats:', err);
      setError(err.message || 'Failed to fetch report statistics');
      throw err;
    }
  };

  // Refresh reports
  const refreshReports = () => {
    if (currentUser?.role === 'admin') {
      fetchAllReports();
    } else {
      fetchUserReports();
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // ✅ FIXED: Effects with proper dependencies
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        fetchAllReports();
      } else {
        fetchUserReports();
      }
    } else {
      setReports([]);
      setAllReports([]);
    }
  }, [currentUser, fetchAllReports, fetchUserReports]);

  const value = {
    // State
    reports: currentUser?.role === 'admin' ? allReports : reports,
    allReports,
    loading,
    error,
    
    // Stats
    stats: getStats(currentUser?.role === 'admin' ? allReports : reports),
    allStats: getStats(allReports),
    userStats: getStats(reports),
    
    // Actions
    fetchUserReports,
    fetchAllReports,
    createReport,
    updateReport,
    updateReportStatus,
    deleteReport,
    getReport,
    getReportStats,
    refreshReports,
    clearError,
    
    // Helper functions
    getStats,
    extractReportsArray
  };

>>>>>>> Stashed changes
  return (
    <ReportContext.Provider
      value={{
        reports,
        notifications,
        createReport,
        updateReport,
        deleteReport,
        getUserReports,
        getAllReports,
        getStats,
        getUserNotifications,
        getUnreadCount,
        markNotificationRead,
        removeNotification,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};
<<<<<<< Updated upstream
=======

export default ReportContext;
>>>>>>> Stashed changes
