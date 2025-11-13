import React from "react";

const RecentReports = ({ reports = [], onEditReport }) => {
  // Make sure reports is always an array and remove any invalid entries
  const safeReports = Array.isArray(reports) ? reports.filter(r => r && typeof r === "object") : [];
  const recent = safeReports.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="text-gray-500 text-center p-6 bg-gray-50 rounded border border-gray-200">
        No recent reports.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recent.map((report, idx) => (
        <div
          key={report?.id || idx}
          className="p-4 bg-white rounded shadow flex justify-between items-center border border-gray-200"
        >
          <div>
            <h4 className="font-semibold">{report?.title ?? "Untitled Report"}</h4>
            <p className="text-sm text-gray-600">{report?.description ?? "No description"}</p>
            <p className="text-xs text-gray-400">
              Status: {report?.status ?? "Pending"}
            </p>
          </div>
          {report?.status === "pending" && (
            <button
              onClick={() => report && onEditReport?.(report)}
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
