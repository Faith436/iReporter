import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function AdminDashboard() {
  const navigate = useNavigate();

  const reports = [
    { id: 1, title: 'Bribery Case', user: 'John Doe', type: 'Red Flag', status: 'Under Investigation' },
    { id: 2, title: 'Road Repair', user: 'Jane Smith', type: 'Intervention', status: 'Pending' }
  ];

  return (
    <div className="admin-dashboard-container">
      <h2>👑 Admin Dashboard</h2>
      <h3>📈 Overview</h3>
      <div className="quick-stats">
        <div>Pending: 12</div>
        <div>In Investigation: 8</div>
        <div>Resolved: 15</div>
      </div>

      <h3>📋 Recent Reports</h3>
      {reports.map(report => (
        <div key={report.id} className="report-card">
          <p><strong>{report.title}</strong></p>
          <p>User: {report.user}</p>
          <p>Type: {report.type}</p>
          <p>Status: {report.status}</p>
          <button onClick={() => navigate(`/update-status/${report.id}`)}>Change Status</button>
          <button onClick={() => navigate(`/report/${report.id}`)}>View Details</button>
        </div>
      ))}

      <h3>🔧 Admin Actions</h3>
      <button>Manage Users</button>
      <button>Analytics</button>
      <button>Export Data</button>
      <button>System Settings</button>
    </div>
  );
}

export default AdminDashboard;
