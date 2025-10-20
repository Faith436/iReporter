import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';
function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock report data
  const report = {
    id,
    title: 'Road Repair Needed',
    description: 'Several potholes causing traffic hazards and vehicle damage on Main Street between 5th and 7th Avenue.',
    status: 'Under Investigation',
    location: 'Main Street, NYC',
    date: '2 days ago',
    evidence: ['img1.jpg', 'img2.jpg', 'vid1.mp4'],
    history: [
      { status: 'Pending', note: 'System: Auto', date: 'Nov 15, 9:14 AM' },
      { status: 'Under Investigation', note: 'Admin: Assigned to DPW', date: 'Today, 10:30 AM' }
    ]
  };

  return (
    <div className="report-details-container">
      <h2>🛠️ {report.title}</h2>
      <p><strong>Status:</strong> {report.status}</p>
      <p><strong>Location:</strong> {report.location}</p>
      <p><strong>Date Reported:</strong> {report.date}</p>
      <h3>📝 Description</h3>
      <p>{report.description}</p>

      <h3>🖼️ Evidence</h3>
      <div className="evidence-container">
        {report.evidence.map((file, index) => (
          <div key={index} className="evidence-card">
            {file.endsWith('.mp4') ? <video src={file} width="150" controls /> : <img src={file} alt="evidence" width="150" />}
          </div>
        ))}
      </div>

      <h3>📋 Status History</h3>
      {report.history.map((h, i) => (
        <div key={i} className="status-history-card">
          <p><strong>{h.status}</strong> - {h.note}</p>
          <p>{h.date}</p>
        </div>
      ))}

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default ReportDetails;
