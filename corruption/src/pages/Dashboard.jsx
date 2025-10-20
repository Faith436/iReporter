import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Dashboard() {
  const navigate = useNavigate();
  const recentReports = [
    { id: 1, title: 'Road Repair Needed', status: 'Pending', location: 'Main Street', date: '2 days ago' },
    { id: 2, title: 'Corruption Case', status: 'Under Investigation', location: 'Licensing Office', date: '1 week ago' }
  ];

  return (
    <div className="dashboard-container">
      <h2>👋 Welcome back!</h2>
      <div className="quick-stats">
        <div>Total: 5</div>
        <div>Active: 2</div>
        <div>Resolved: 3</div>
      </div>

      <div className="report-issues">
        <h3>🚨 Report Issues</h3>
        <button onClick={() => navigate('/create-report')}>📌 Report Red Flag</button>
        {/* <button onClick={() => navigate('/create-report')}>🛠️ Request Intervention</button> */}
      </div>

      <div className="recent-reports">
        <h3>📋 My Recent Reports</h3>
        {recentReports.map(report => (
          <div key={report.id} className="report-card" onClick={() => navigate(`/report/${report.id}`)}>
            <h4>{report.title}</h4>
            <p>📍 {report.location} • 🕐 {report.date}</p>
            <p>Status: {report.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
