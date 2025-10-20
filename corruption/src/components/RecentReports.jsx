import React from "react";
import ReportCard from "./ReportCard";

const RecentReports = ({ reports, onOpen }) => {
  return (
    <div className="card">
      <h3>📋 My Recent Reports</h3>
      <div className="reports-list">
        {reports.length === 0 ? (
          <p>No recent reports yet.</p>
        ) : (
          reports.map((r) => (
            <ReportCard key={r.id} report={r} onClick={onOpen} />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentReports;
