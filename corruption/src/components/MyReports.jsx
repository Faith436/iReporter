
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyReports.css";

const MyReports = () => {
  const navigate = useNavigate();
  
  // Get reports from localStorage
  const [reports, setReports] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('myReports')) || [];
    } catch (error) {
      console.error('Error loading reports:', error);
      return [];
    }
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    reportType: '',
    title: '',
    description: '',
    location: '',
    coordinates: null,
    evidence: ''
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      const updatedReports = reports.filter(report => report.id !== id);
      setReports(updatedReports);
      localStorage.setItem('myReports', JSON.stringify(updatedReports));
    }
  };

  const startEdit = (report) => {
    setEditingId(report.id);
    setEditData({
      reportType: report.reportType || 'red-flag',
      title: report.title || "",
      description: report.description || "",
      location: report.location || "",
      coordinates: report.coordinates || null,
      evidence: report.evidence || ""
    });
    setCurrentStep(1);
  };

  const saveEdit = (id) => {
    const updatedReports = reports.map(report =>
      report.id === id ? { ...report, ...editData } : report
    );
    setReports(updatedReports);
    localStorage.setItem('myReports', JSON.stringify(updatedReports));
    setEditingId(null);
    setCurrentStep(1);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      reportType: '',
      title: '',
      description: '',
      location: '',
      coordinates: null,
      evidence: ''
    });
    setCurrentStep(1);
  };

  const updateEditData = (newData) => {
    setEditData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffb020';
      case 'under-investigation': return '#d69e2e';
      case 'resolved': return '#38a169';
      default: return '#718096';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'red-flag' ? '🚩' : '🛠️';
  };

  // Edit Form Steps
  const renderEditStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="edit-step">
            <h3>Edit Basic Information</h3>
            
            <div className="form-group">
              <label className="form-label">Report Type</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="reportType"
                    value="red-flag"
                    checked={editData.reportType === 'red-flag'}
                    onChange={(e) => updateEditData({ reportType: e.target.value })}
                  />
                  <div className="radio-content">
                    <span className="radio-title">Red Flag</span>
                    <span className="radio-description">
                      Report corruption incidents, bribery, or misuse of public funds
                    </span>
                  </div>
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="reportType"
                    value="intervention"
                    checked={editData.reportType === 'intervention'}
                    onChange={(e) => updateEditData({ reportType: e.target.value })}
                  />
                  <div className="radio-content">
                    <span className="radio-title">Intervention</span>
                    <span className="radio-description">
                      Request government intervention for infrastructure issues
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => updateEditData({ title: e.target.value })}
                placeholder="Brief title describing the incident"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={editData.description}
                onChange={(e) => updateEditData({ description: e.target.value })}
                placeholder="Provide detailed description of the incident..."
                className="form-textarea"
                rows="6"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="edit-step">
            <h3>Edit Location Details</h3>
            
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                value={editData.location}
                onChange={(e) => updateEditData({ location: e.target.value })}
                placeholder="Enter the location"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location Coordinates</label>
              <div className="location-actions">
                <button
                  type="button"
                  onClick={() => updateEditData({ coordinates: { lat: "6.5244", lng: "3.3792" } })}
                  className="btn btn-secondary"
                >
                  📍 Use Current Location
                </button>
              </div>
              
              {editData.coordinates && (
                <div className="coordinates-display">
                  <strong>Current coordinates:</strong> 
                  {editData.coordinates.lat}, {editData.coordinates.lng}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="edit-step">
            <h3>Edit Evidence & Additional Information</h3>
            
            <div className="form-group">
              <label className="form-label">Additional Evidence Details</label>
              <textarea
                value={editData.evidence}
                onChange={(e) => updateEditData({ evidence: e.target.value })}
                placeholder="Provide any additional evidence details..."
                className="form-textarea"
                rows="4"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="my-reports-page">
      <div className="my-reports-container">
        <header className="my-reports-header">
          <div>
            <h1>My Reports</h1>
            <p>Manage and track your submitted reports</p>
          </div>
          <button 
            onClick={() => navigate('/create-report')} 
            className="btn btn-primary"
          >
            + Create New Report
          </button>
        </header>

        {reports.length === 0 ? (
          <div className="no-reports">
            <h3>No reports submitted yet</h3>
            <p>Create your first report to see it here</p>
            <button 
              onClick={() => navigate('/create-report')} 
              className="btn btn-primary"
            >
              Create First Report
            </button>
          </div>
        ) : (
          <div className="reports-grid">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="report-card" 
                style={{borderLeft: `4px solid ${getStatusColor(report.status)}`}}
              >
                {editingId === report.id ? (
                  <div className="edit-mode">
                    {/* Progress Steps */}
                    <div className="edit-progress">
                      <div className={`edit-step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
                        <span>1</span> Basic Info
                      </div>
                      <div className={`edit-step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
                        <span>2</span> Location
                      </div>
                      <div className={`edit-step-indicator ${currentStep >= 3 ? 'active' : ''}`}>
                        <span>3</span> Evidence
                      </div>
                    </div>

                    {/* Edit Form */}
                    {renderEditStep()}

                    {/* Navigation Buttons */}
                    <div className="edit-navigation">
                      <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="btn btn-secondary"
                      >
                        Previous
                      </button>

                      {currentStep < 3 ? (
                        <button
                          onClick={nextStep}
                          className="btn btn-primary"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={() => saveEdit(report.id)}
                          className="btn btn-primary"
                        >
                          Save Changes
                        </button>
                      )}

                      <button
                        onClick={cancelEdit}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode">
                    <div className="report-header">
                      <h3>{getTypeIcon(report.reportType)} {report.title}</h3>
                      <div className="report-meta">
                        <span className={`status-badge status-${report.status}`}>
                          {report.status ? report.status.replace('-', ' ') : 'Pending'}
                        </span>
                        <span className="type-badge">
                          {report.reportType === 'red-flag' ? 'Red Flag' : 'Intervention'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="report-description">{report.description}</p>
                    
                    <div className="report-details-grid">
                      <div className="detail-item">
                        <strong>📍 Location:</strong> {report.location || 'Not specified'}
                      </div>
                      {report.coordinates && (
                        <div className="detail-item">
                          <strong>🌐 Coordinates:</strong> {report.coordinates.lat}, {report.coordinates.lng}
                        </div>
                      )}
                      <div className="detail-item">
                        <strong>📅 Date:</strong> {report.date || 'Unknown'}
                      </div>
                      {report.evidence && (
                        <div className="detail-item">
                          <strong>📝 Additional Info:</strong> {report.evidence}
                        </div>
                      )}
                    </div>
                    
                    <div className="report-footer">
                      <div className="report-actions">
                        <button onClick={() => startEdit(report)} className="btn btn-primary">
                          Edit Report
                        </button>
                        <button onClick={() => handleDelete(report.id)} className="btn btn-danger">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
