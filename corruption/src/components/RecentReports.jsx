// src/components/RecentReports.jsx
import React from "react";

const RecentReports = ({ reports, onEditReport }) => {
  const recent = reports.slice(0, 5); // last 5 reports

  if (recent.length === 0) {
    return (
      <div className="text-gray-500 text-center p-6 bg-gray-50 rounded border border-gray-200">
        No recent reports.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recent.map((report) => (
        <div
          key={report.id}
          className="p-4 bg-white rounded shadow flex justify-between items-center border border-gray-200"
        >
          <div>
            <h4 className="font-semibold">{report.title}</h4>
            <p className="text-sm text-gray-600">{report.description}</p>
            <p className="text-xs text-gray-400">
              Status: {report.status || "Pending"}
            </p>
          </div>
          {report.status === "pending" && (
            <button
              onClick={() => onEditReport(report)}
              className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700"
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecentReports;
