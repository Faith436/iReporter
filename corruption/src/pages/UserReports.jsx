// src/pages/UserReports.jsx
import React, { useState } from "react";
import { useUsers } from "../contexts/UserContext";
import KanbanView from "../components/KanbanView";

const UserReports = () => {
  const { currentUser } = useUsers(); // Get logged-in user
  const [refreshKey, setRefreshKey] = useState(0); // To refresh Kanban after edits/deletes

  if (!currentUser) return <p className="p-4">Loading user info...</p>;

  // --- Handlers ---
  const handleEdit = (report) => {
    console.log("Edit report:", report);
    // Open modal/stepper for editing if needed
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      console.log("Deleting report with ID:", reportId);
      // Call your delete function from context here
      // await deleteReport(reportId);
      // Trigger refresh
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to delete report:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        My Reports (Kanban View)
      </h1>

      <KanbanView
        role={currentUser.role}
        loggedInUserId={currentUser.id}
        onEdit={handleEdit}
        onDelete={handleDelete}
        refreshKey={refreshKey}
      />
    </div>
  );
};

export default UserReports;
