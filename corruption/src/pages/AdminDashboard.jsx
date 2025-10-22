import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    adminNotes: '',
    notifyUser: true
  });
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: ''
  });

  // Load reports from localStorage
  useEffect(() => {
    const loadReports = () => {
      try {
        const storedReports = JSON.parse(localStorage.getItem('myReports')) || [];
        console.log('Loaded reports for admin:', storedReports);
        setReports(storedReports);
        setFilteredReports(storedReports);
      } catch (error) {
        console.error('Error loading reports:', error);
        setReports([]);
        setFilteredReports([]);
      }
    };

    loadReports();
  }, []);

  // Filter reports based on criteria
  useEffect(() => {
    let filtered = [...reports];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(report => report.reportType === filters.type);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(report => report.status === filters.status);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(report => 
        report.title.toLowerCase().includes(searchLower) ||
        report.description.toLowerCase().includes(searchLower) ||
        report.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredReports(filtered);
  }, [filters, reports]);

  // Get statistics
  const getStats = () => {
    const total = reports.length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const underInvestigation = reports.filter(r => r.status === 'under-investigation').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const rejected = reports.filter(r => r.status === 'rejected').length;
    
    return { total, pending, underInvestigation, resolved, rejected };
  };

  const stats = getStats();

  // Open status update modal
  const openStatusModal = (report) => {
    setSelectedReport(report);
    setStatusUpdate({
      status: report.status || 'pending',
      adminNotes: '',
      notifyUser: true
    });
    setShowStatusModal(true);
  };

  // Update report status
  const updateReportStatus = () => {
    if (!selectedReport) return;

    const updatedReports = reports.map(report =>
      report.id === selectedReport.id 
        ? { 
            ...report, 
            status: statusUpdate.status,
            adminNotes: statusUpdate.adminNotes,
            statusUpdatedAt: new Date().toISOString(),
            statusUpdatedBy: 'Admin'
          }
        : report
    );

    setReports(updatedReports);
    localStorage.setItem('myReports', JSON.stringify(updatedReports));

    // Create notification for user
    if (statusUpdate.notifyUser) {
      const existingNotifications = JSON.parse(localStorage.getItem('ireporter-notifications')) || [];
      const statusMessages = {
        'under-investigation': 'is now under investigation',
        'resolved': 'has been resolved',
        'rejected': 'has been rejected'
      };

      const newNotification = {
        id: Date.now(),
        title: `Report Status Updated - ${statusUpdate.status.replace('-', ' ')}`,
        message: `Your report "${selectedReport.title}" ${statusMessages[statusUpdate.status] || 'status has been updated'}. ${statusUpdate.adminNotes ? `Admin notes: ${statusUpdate.adminNotes}` : ''}`,
        type: 'status-update',
        timestamp: new Date().toISOString(),
        read: false,
        reportId: selectedReport.id
      };

      localStorage.setItem('ireporter-notifications', JSON.stringify([newNotification, ...existingNotifications]));
    }

    setShowStatusModal(false);
    setSelectedReport(null);
    alert('Report status updated successfully!');
  };

  // Delete report (admin only)
  const deleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      const updatedReports = reports.filter(report => report.id !== reportId);
      setReports(updatedReports);
      localStorage.setItem('myReports', JSON.stringify(updatedReports));
      alert('Report deleted successfully!');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffb020';
      case 'under-investigation': return '#d69e2e';
      case 'resolved': return '#38a169';
      case 'rejected': return '#e53e3e';
      default: return '#718096';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'under-investigation': return '🔍';
      case 'resolved': return '✅';
      case 'rejected': return '❌';
      default: return '📄';
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    return type === 'red-flag' ? '🚩' : '🛠️';
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage and monitor all reported incidents</p>
          </div>
          <div className="admin-actions">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Back to User View
            </button>
          </div>
        </header>

        {/* Statistics */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Reports</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔍</div>
            <div className="stat-content">
              <div className="stat-number">{stats.underInvestigation}</div>
              <div className="stat-label">Under Investigation</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <div className="stat-number">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <div className="filter-group">
            <label>Report Type:</label>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="all">All Types</option>
              <option value="red-flag">Red Flags</option>
              <option value="intervention">Interventions</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under-investigation">Under Investigation</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search reports..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          
          <button 
            onClick={() => setFilters({type: 'all', status: 'all', search: ''})}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>

        {/* Reports Table */}
        <div className="reports-table-container">
          <h3>All Reports ({filteredReports.length})</h3>
          
          {filteredReports.length === 0 ? (
            <div className="no-reports">
              <p>No reports found matching your criteria.</p>
            </div>
          ) : (
            <div className="reports-table">
              {filteredReports.map(report => (
                <div key={report.id} className="report-row">
                  <div className="report-info">
                    <div className="report-main">
                      <h4>{getTypeIcon(report.reportType)} {report.title}</h4>
                      <p className="report-description">{report.description}</p>
                      <div className="report-meta">
                        <span>📍 {report.location}</span>
                        <span>📅 {report.date}</span>
                        <span>👤 {report.userName || 'Anonymous'}</span>
                      </div>
                    </div>
                    
                    <div className="report-status">
                      <span 
                        className="status-badge"
                        style={{backgroundColor: getStatusColor(report.status)}}
                      >
                        {getStatusIcon(report.status)} {report.status ? report.status.replace('-', ' ') : 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="report-actions">
                    <button 
                      onClick={() => openStatusModal(report)}
                      className="btn btn-primary btn-sm"
                    >
                      Update Status
                    </button>
                    <button 
                      onClick={() => deleteReport(report.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedReport && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Update Report Status</h3>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="report-preview">
                <h4>{selectedReport.title}</h4>
                <p>{selectedReport.description}</p>
                <div className="report-details">
                  <span>📍 {selectedReport.location}</span>
                  <span>📅 {selectedReport.date}</span>
                  <span>Current Status: {selectedReport.status || 'Pending'}</span>
                </div>
              </div>
              
              <div className="status-form">
                <div className="form-group">
                  <label>New Status *</label>
                  <div className="status-options">
                    <label className="status-option">
                      <input
                        type="radio"
                        value="under-investigation"
                        checked={statusUpdate.status === 'under-investigation'}
                        onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
                      />
                      <span className="status-label under-investigation">
                        🔍 Under Investigation
                      </span>
                    </label>
                    
                    <label className="status-option">
                      <input
                        type="radio"
                        value="resolved"
                        checked={statusUpdate.status === 'resolved'}
                        onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
                      />
                      <span className="status-label resolved">
                        ✅ Resolved
                      </span>
                    </label>
                    
                    <label className="status-option">
                      <input
                        type="radio"
                        value="rejected"
                        checked={statusUpdate.status === 'rejected'}
                        onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
                      />
                      <span className="status-label rejected">
                        ❌ Rejected
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Admin Notes (Optional)</label>
                  <textarea
                    value={statusUpdate.adminNotes}
                    onChange={(e) => setStatusUpdate({...statusUpdate, adminNotes: e.target.value})}
                    placeholder="Add notes about the status update..."
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={statusUpdate.notifyUser}
                      onChange={(e) => setStatusUpdate({...statusUpdate, notifyUser: e.target.checked})}
                    />
                    Notify user about this status update
                  </label>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={updateReportStatus}
                disabled={!statusUpdate.status}
                className="btn btn-primary"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;