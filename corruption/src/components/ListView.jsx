// src/components/ListView.jsx - Admin/User Dynamic Columns
import React, { useState, useEffect } from "react";
import { Trash2, SquarePen } from "lucide-react";
import moment from "moment";
import { useReports } from "../contexts/ReportContext";

const StatusTag = ({ status }) => {
  let classes = "";
  const normalizedStatus = status ? status.toLowerCase() : "pending";
  let displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  switch (normalizedStatus) {
    case "resolved":
      classes = "bg-green-100 text-green-800";
      break;
    case "under investigation":
      classes = "bg-yellow-100 text-yellow-800";
      displayStatus = "Under Investigation";
      break;
    case "rejected":
      classes = "bg-red-100 text-red-800";
      break;
    case "pending":
    default:
      classes = "bg-blue-100 text-blue-800";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${classes}`}
    >
      {displayStatus}
    </span>
  );
};

const ListView = ({ role, onEdit, onDelete, refreshKey }) => {
  const { reports, loading, fetchReports, currentUser } = useReports();
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      setInternalLoading(true);
      await fetchReports(); // fetch all for admin, own for user
      setInternalLoading(false);
    };
    if (currentUser) loadReports();
  }, [currentUser, fetchReports, refreshKey]);

  const tableHeaders =
    role === "admin"
      ? [
          { key: "title", label: "Title" },
          { key: "user", label: "User" },
          { key: "location", label: "Location" },
          { key: "type", label: "Type" },
          { key: "status", label: "Status" },
          { key: "date", label: "Date" },
        ]
      : [
          { key: "title", label: "Title" },
          { key: "location", label: "Location" },
          { key: "type", label: "Type" },
          { key: "status", label: "Status" },
          { key: "date", label: "Date" },
          { key: "actions", label: "Actions", align: "right" },
        ];

  const renderCell = (report, key) => {
    switch (key) {
      case "title":
        return report.title;
      case "user":
        return report.userName || report.userEmail || "Unknown User";
      case "location":
        return report.location || "N/A";
      case "type":
        return report.type || "N/A";
      case "status":
        return <StatusTag status={report.status} />;
      case "date":
        return moment(report.created_at || Date.now()).format("MMM D, YYYY");
      case "actions":
        return (
          <div className="text-right space-x-2">
            {report.status === "pending" && (
              <button
                onClick={() => onEdit(report)}
                className="text-gray-400 hover:text-gray-600 transition"
                title="Edit Report"
              >
                <SquarePen className="w-5 h-5 inline-block" />
              </button>
            )}
            <button
              onClick={() => onDelete(report.id)}
              className="text-red-400 hover:text-red-600 transition"
              title="Delete Report"
            >
              <Trash2 className="w-5 h-5 inline-block" />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Reports</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    header.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {internalLoading || loading ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="text-center py-12 text-gray-500"
                >
                  Loading reports...
                </td>
              </tr>
            ) : reports.length ? (
              reports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  {tableHeaders.map((header) => (
                    <td
                      key={header.key}
                      className={`px-3 py-4 text-sm ${
                        header.align === "right" ? "text-right" : ""
                      }`}
                    >
                      {renderCell(report, header.key)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="text-center py-12 text-gray-500"
                >
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;
