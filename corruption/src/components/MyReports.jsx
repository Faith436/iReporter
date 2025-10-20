import React, { useState, useEffect } from "react";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "" });

  // Load reports from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myReports")) || [];
    setReports(stored);
  }, []);

  // Save back to localStorage whenever reports change
  useEffect(() => {
    localStorage.setItem("myReports", JSON.stringify(reports));
  }, [reports]);

  const handleDelete = (id) => {
    const filtered = reports.filter((r) => r.id !== id);
    setReports(filtered);
  };

  const startEdit = (report) => {
    setEditingId(report.id);
    setEditData({ title: report.title, description: report.description });
  };

  const saveEdit = (id) => {
    const updated = reports.map((r) =>
      r.id === id ? { ...r, ...editData } : r
    );
    setReports(updated);
    setEditingId(null);
  };

  return (
    <div className="my-reports">
      <h2>📋 My Reports</h2>
      {reports.length === 0 && <p>No reports submitted yet.</p>}

      {reports.map((report) => (
        <div key={report.id} className="report-card">
          {editingId === report.id ? (
            <>
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
              <button onClick={() => saveEdit(report.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>{report.title}</h3>
              <p>{report.description}</p>
              <p>📍 Lat: {report.location.lat}, Lng: {report.location.lng}</p>
              <p>🖼️ Images: {report.images.join(", ")}</p>
              <p>🎥 Videos: {report.videos.join(", ")}</p>

              <button onClick={() => startEdit(report)}>Edit</button>
              <button onClick={() => handleDelete(report.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyReports;
