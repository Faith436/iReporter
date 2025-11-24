// src/components/ListView.jsx
import React, { useState, useEffect } from "react";
import { Trash2, SquarePen } from "lucide-react";
import moment from "moment";
import { useReports } from "../contexts/ReportContext";

const StatusTag = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || "pending";
  let displayStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Pending";

  let classes = "";
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

const ListView = ({
  role,
  reports, // optional prop
  setEditingReport,
  setShowModal,
  onDelete,
  refreshKey,
  loading = false,
  currentUser,
}) => {
  const { reports: contextReports } = useReports(); // fallback to context reports
  const displayReports = reports || contextReports || [];

  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      setInternalLoading(true);
      setInternalLoading(false);
    };
    if (currentUser) loadReports();
  }, [currentUser, refreshKey]);

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
        return report.title || "N/A";
      case "user":
        return (
          report.userName ||
          report.userEmail ||
          report.user?.name ||
          report.user?.email ||
          "Unknown User"
        );
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
            {role === "user" && report.status === "pending" && (
              <button
                onClick={() => {
                  setEditingReport(report);
                  setShowModal(true);
                }}
              >
                <SquarePen className="w-5 h-5" />
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

  const isLoading = internalLoading || loading;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[50vh]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Reports</h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
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
            {isLoading ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="text-center py-12 text-gray-500"
                >
                  Loading reports...
                </td>
              </tr>
            ) : displayReports.length ? (
              displayReports.map((report) => (
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <p className="text-center py-6 text-gray-500">Loading reports...</p>
        ) : displayReports.length ? (
          displayReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-4 rounded-xl shadow border space-y-2"
            >
              <div className="flex justify-between">
                <span className="font-medium">Title:</span>
                <span>{report.title || "N/A"}</span>
              </div>
              {role === "admin" && (
                <div className="flex justify-between">
                  <span className="font-medium">User:</span>
                  <span>
                    {report.userName || report.user?.name || "Unknown User"}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span>{report.location || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>{report.type || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <StatusTag status={report.status} />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Created:</span>
                <span>
                  {moment(report.created_at || Date.now()).format(
                    "MMM D, YYYY"
                  )}
                </span>
              </div>
              {role !== "admin" && (
                <div className="flex justify-end space-x-2 pt-2">
                  {role === "user" && report.status === "pending" && (
                    <button
                      onClick={() => {
                        setEditingReport(report);
                        setShowModal(true);
                      }}
                    >
                      <SquarePen className="w-5 h-5" />
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
              )}
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-gray-500">No reports found.</p>
        )}
      </div>
    </div>
  );
};

export default ListView;
