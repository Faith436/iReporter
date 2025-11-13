// src/pages/AdminReports.jsx
import React, { useEffect, useState } from "react";
import { useReports } from "../contexts/ReportContext";
import ListView from "../components/ListView";
import KanbanView from "../components/KanbanView";

const AdminReports = () => {
  const { reports, fetchReports, deleteReport } = useReports();
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("list");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchReports();
      setLoading(false);
    };
    load();
  }, [fetchReports, refreshKey]);

  const handleDelete = async (id) => {
    await deleteReport(id);
    setRefreshKey((prev) => prev + 1);
  };

  if (loading)
    return <div className="p-6 text-gray-500">Loading reports...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">All Reports (Admin)</h1>

        {/* View toggle buttons */}
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${
              activeView === "list"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveView("list")}
          >
            List View
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeView === "kanban"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveView("kanban")}
          >
            Kanban View
          </button>
        </div>
      </div>

      {activeView === "list" ? (
        <ListView role="admin" refreshKey={refreshKey} />
      ) : (
        <KanbanView
          role="admin"
          loggedInUserId={null} // Admin sees all reports
          onEdit={() => {}} // Optional: define edit if needed
          onDelete={handleDelete}
          refreshKey={refreshKey}
        />
      )}
    </div>
  );
};

export default AdminReports;
