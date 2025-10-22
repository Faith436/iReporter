// import React, { useState, useEffect } from "react";

// const MyReports = () => {
//   const [reports, setReports] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({ title: "", description: "" });

//   // Load reports from localStorage
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("myReports")) || [];
//     setReports(stored);
//   }, []);

//   // Save back to localStorage whenever reports change
//   useEffect(() => {
//     localStorage.setItem("myReports", JSON.stringify(reports));
//   }, [reports]);

//   const handleDelete = (id) => {
//     const filtered = reports.filter((r) => r.id !== id);
//     setReports(filtered);
//   };

//   const startEdit = (report) => {
//     setEditingId(report.id);
//     setEditData({ title: report.title, description: report.description });
//   };

//   const saveEdit = (id) => {
//     const updated = reports.map((r) =>
//       r.id === id ? { ...r, ...editData } : r
//     );
//     setReports(updated);
//     setEditingId(null);
//   };

//   return (
//     <div className="my-reports">
//       <h2>📋 My Reports</h2>
//       {reports.length === 0 && <p>No reports submitted yet.</p>}

//       {reports.map((report) => (
//         <div key={report.id} className="report-card">
//           {editingId === report.id ? (
//             <>
//               <input
//                 type="text"
//                 value={editData.title}
//                 onChange={(e) =>
//                   setEditData({ ...editData, title: e.target.value })
//                 }
//               />
//               <textarea
//                 value={editData.description}
//                 onChange={(e) =>
//                   setEditData({ ...editData, description: e.target.value })
//                 }
//               />
//               <button onClick={() => saveEdit(report.id)}>Save</button>
//               <button onClick={() => setEditingId(null)}>Cancel</button>
//             </>
//           ) : (
//             <>
//               <h3>{report.title}</h3>
//               <p>{report.description}</p>
//               <p>📍 Lat: {report.location.lat}, Lng: {report.location.lng}</p>
//               <p>🖼️ Images: {report.images.join(", ")}</p>
//               <p>🎥 Videos: {report.videos.join(", ")}</p>

//               <button onClick={() => startEdit(report)}>Edit</button>
//               <button onClick={() => handleDelete(report.id)}>Delete</button>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MyReports;

import React, { useState } from "react";
import { useReports } from "../contexts/ReportContext";
import "../styles/MyReports.css";

const MyReports = () => {
  const { reports, updateReport, deleteReport } = useReports();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "" });

  console.log('MyReports component - current reports:', reports);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      console.log('Deleting report with id:', id);
      deleteReport(id);
    }
  };

  const startEdit = (report) => {
    setEditingId(report.id);
    setEditData({ title: report.title, description: report.description });
  };

  const saveEdit = (id) => {
    console.log('Saving edit for report:', id, editData);
    updateReport(id, editData);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ title: "", description: "" });
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

  return (
    <div className="my-reports-page">
      <div className="my-reports-container">
        <header className="my-reports-header">
          <h1>My Reports</h1>
          <p>Manage and track your submitted reports</p>
        </header>

        {reports.length === 0 ? (
          <div className="no-reports">
            <h3>No reports submitted yet</h3>
            <p>Create your first report to see it here</p>
            <a href="/create-report" className="btn btn-primary">
              Create First Report
            </a>
          </div>
        ) : (
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report.id} className="report-card" style={{borderLeft: `4px solid ${getStatusColor(report.status)}`}}>
                {editingId === report.id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="edit-input"
                      placeholder="Report title"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="edit-textarea"
                      placeholder="Report description"
                      rows="4"
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveEdit(report.id)} className="btn btn-primary">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary">
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
                          {report.status.replace('-', ' ')}
                        </span>
                        <span className="type-badge">
                          {report.reportType === 'red-flag' ? 'Red Flag' : 'Intervention'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="report-description">{report.description}</p>
                    
                    <div className="report-footer">
                      <div className="report-info">
                        <span className="location">📍 {report.location}</span>
                        <span className="date">📅 {report.date}</span>
                      </div>
                      
                      <div className="report-actions">
                        <button onClick={() => startEdit(report)} className="btn btn-secondary btn-sm">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(report.id)} className="btn btn-danger btn-sm">
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
