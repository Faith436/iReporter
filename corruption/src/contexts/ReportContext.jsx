import React, { createContext, useContext, useState, useEffect } from 'react';

const ReportContext = createContext();

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load reports from localStorage on component mount
  useEffect(() => {
    const loadReports = () => {
      try {
        const storedReports = JSON.parse(localStorage.getItem('myReports')) || [];
        console.log('Loaded reports from storage:', storedReports);
        setReports(storedReports);
      } catch (error) {
        console.error('Error loading reports:', error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  // Save to localStorage whenever reports change
  useEffect(() => {
    if (!loading) {
      console.log('Saving reports to storage:', reports);
      localStorage.setItem('myReports', JSON.stringify(reports));
    }
  }, [reports, loading]);

  // Create a new report
  const createReport = (reportData) => {
    const newReport = {
      id: Date.now(), // Simple ID generation
      ...reportData,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      read: false
    };
    
    console.log('Creating new report:', newReport);
    
    setReports(prev => {
      const updatedReports = [newReport, ...prev];
      console.log('Updated reports array:', updatedReports);
      return updatedReports;
    });

    // Create notification for the new report
    createNotification({
      id: Date.now(),
      title: "Report Submitted",
      message: `Your report "${reportData.title}" has been submitted successfully`,
      type: "submission",
      timestamp: new Date().toISOString(),
      read: false,
      reportId: newReport.id
    });

    return newReport;
  };

  // Update an existing report
  const updateReport = (id, updates) => {
    setReports(prev => 
      prev.map(report => 
        report.id === id ? { ...report, ...updates } : report
      )
    );
  };

  // Delete a report
  const deleteReport = (id) => {
    setReports(prev => {
      const filteredReports = prev.filter(report => report.id !== id);
      console.log('After deletion, reports:', filteredReports);
      return filteredReports;
    });
  };

  // Get statistics
  const getStats = () => {
    const redFlags = reports.filter(r => r.reportType === 'red-flag').length;
    const interventions = reports.filter(r => r.reportType === 'intervention').length;
    const underInvestigation = reports.filter(r => r.status === 'under-investigation').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    
    console.log('Current stats:', { redFlags, interventions, underInvestigation, resolved });
    
    return { redFlags, interventions, underInvestigation, resolved };
  };

  // Notification management
  const createNotification = (notification) => {
    const existingNotifications = JSON.parse(localStorage.getItem('ireporter-notifications')) || [];
    const updatedNotifications = [notification, ...existingNotifications];
    localStorage.setItem('ireporter-notifications', JSON.stringify(updatedNotifications));
  };

  const value = {
    reports,
    loading,
    createReport,
    updateReport,
    deleteReport,
    getStats
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};