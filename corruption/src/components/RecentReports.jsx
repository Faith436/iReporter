import React from 'react';

const RecentReports = () => {
  // Get real reports from localStorage
  const reports = JSON.parse(localStorage.getItem('myReports')) || [];
  
  // Show only recent reports (last 5)
  const recentReports = reports.slice(0, 5);

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

  return (
    <div className="reports-list">
      {recentReports.length === 0 ? (
        <div className="no-reports-message">
          <p>No reports yet. Create your first report to see it here.</p>
        </div>
      ) : (
        recentReports.map(report => (
          <div key={report.id} className="report-card-detailed">
            <div className="report-header">
              <div className="report-title-section">
                <h3 className="report-title">{getTypeIcon(report.reportType)} {report.title}</h3>
                <div className="report-badges">
                  <span 
                    className="status-badge" 
                    style={{backgroundColor: getStatusColor(report.status)}}
                  >
                    {report.status ? report.status.replace('-', ' ') : 'Pending'}
                  </span>
                  <span className="type-badge">
                    {report.reportType === 'red-flag' ? 'Red Flag' : 'Intervention'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="report-content">
              <p className="report-description">{report.description}</p>
              
              <div className="report-details">
                <div className="detail-item">
                  <span className="detail-label">📍 Location:</span>
                  <span className="detail-value">{report.location || 'Not specified'}</span>
                </div>
                
                {report.coordinates && (
                  <div className="detail-item">
                    <span className="detail-label">🌐 Coordinates:</span>
                    <span className="detail-value">
                      {report.coordinates.lat}, {report.coordinates.lng}
                    </span>
                  </div>
                )}
                
                <div className="detail-item">
                  <span className="detail-label">📅 Date:</span>
                  <span className="detail-value">{report.date || 'Unknown'}</span>
                </div>
                
                {report.images && report.images > 0 && (
                  <div className="detail-item">
                    <span className="detail-label">🖼️ Evidence:</span>
                    <span className="detail-value">{report.images} image(s)</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="report-footer">
              <div className="report-actions">
                <button className="btn-view">View Details</button>
                <button className="btn-edit">Edit</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentReports;