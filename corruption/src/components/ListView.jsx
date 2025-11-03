import React from "react";
import { Trash2, Pencil } from "lucide-react";

const ListView = ({ reports, role, userEmail, loading, onEdit, onDelete }) => {
  const visibleReports = role === "admin" ? reports : reports.filter(r => r.createdBy === userEmail);

  return (
    <div className="bg-white shadow rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Description</th>
            <th className="p-3">Location</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                Loading reports...
              </td>
            </tr>
          ) : visibleReports.length ? (
            visibleReports.map(report => (
              <tr key={report.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{report.title}</td>
                <td className="p-3">{report.description}</td>
                <td className="p-3">{report.location}</td>
                <td className="p-3">{new Date(report.created_at).toLocaleDateString()}</td>
                <td className="p-3 capitalize">{report.status}</td>
                <td className="p-3 flex gap-2">
                  {role === "admin" ? (
                    <button
                      onClick={() => onDelete(report.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  ) : report.status === "pending" ? (
                    <button
                      onClick={() => onEdit(report)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                  ) : null}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
