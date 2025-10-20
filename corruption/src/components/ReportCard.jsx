import React from 'react';

const statusColor = (status) => {
  if (!status) return '#999';
  const s = status.toLowerCase();
  if (s.includes('pending')) return '#ff4d4f';
  if (s.includes('invest')) return '#ffb020';
  if (s.includes('resolved')) return '#28a745';
  return '#6c757d';
};

const ReportCard = ({ report, onClick }) => {
  return (
    <div
      className="report-card"
      style={{ borderLeft: `5px solid ${statusColor(report.status)}` }}
      onClick={() => onClick && onClick(report.id)}
    >
      <div className="report-row">
        <div>
          <h4 className="report-title">{report.title}</h4>
          <p className="report-meta">📍 {report.location} • 🕐 {report.date}</p>
        </div>
        <div className="report-status" style={{ color: statusColor(report.status), fontWeight: 700 }}>
          {report.status}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
