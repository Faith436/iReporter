// src/components/UserReportsView.jsx
import React, { useState } from "react";
import ListView from "../components/ListView"; // or your RecentReports component
import ReportMap from "../components/ReportMap";

const UserReportsView = ({ reports, role, setEditingReport, setShowModal, onDelete, loading }) => {
  const [viewMode, setViewMode] = useState("table"); // "table" or "map"

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Toggle Buttons */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          className={`px-4 py-2 rounded ${viewMode === "table" ? "bg-red-600 text-white" : "bg-gray-200"}`}
          onClick={() => setViewMode("table")}
        >
          Table View
        </button>
        <button
          className={`px-4 py-2 rounded ${viewMode === "map" ? "bg-red-600 text-white" : "bg-gray-200"}`}
          onClick={() => setViewMode("map")}
        >
          Map View
        </button>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <ListView
          reports={reports}
          role={role}
          setEditingReport={setEditingReport}
          setShowModal={setShowModal}
          onDelete={onDelete}
          loading={loading}
        />
      ) : (
        <ReportMap reports={reports} />
      )}
    </div>
  );
};

export default UserReportsView;
