// src/pages/Reports.jsx
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useReports } from "../contexts/ReportContext";
import ListView from "../components/ListView";
import KanbanView from "../components/KanbanView";
import ReportModal from "../components/ReportModal";

const statuses = ["pending", "under investigation", "resolved", "rejected"];
const COLOR_PRIMARY_PURPLE = "#4D2C5E";

const Reports = () => {
  const {
    currentUser,
    userLoading,
    createReport,
    updateReport,
    deleteReport,
     reports,
    fetchReports,
  } = useReports();
 // Fetch reports from context
  const [activeView, setActiveView] = useState("list");
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    lat: "",
    lng: "",
    status: "pending",
    media: [],
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const role = (
    currentUser?.role ||
    currentUser?.user?.role ||
    ""
  ).toLowerCase();

  console.log("Resolved role:", role);

  useEffect(() => {
    if (currentUser) fetchReports();
  }, [currentUser, fetchReports]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({ ...report, media: report.media || [] });
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.location)
      return alert("Please fill in all required fields.");

    try {
      const submitData = new FormData();
      ["title", "description", "location", "lat", "lng", "status"].forEach(
        (f) => submitData.append(f, formData[f] || "")
      );
      formData.media?.forEach((file) => submitData.append("media", file));

      if (editingReport) await updateReport(editingReport.id, submitData);
      else await createReport(submitData);

      await fetchReports();
      setRefreshKey((prev) => prev + 1);

      setFormData({
        title: "",
        description: "",
        location: "",
        lat: "",
        lng: "",
        status: "pending",
        media: [],
      });
      setEditingReport(null);
      setCurrentStep(1);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit report. See console for details.");
    }
  };

  if (userLoading || !currentUser)
    return <div className="p-6 text-gray-600">Loading your dashboard...</div>;

  if (!currentUser)
    return (
      <div className="p-6 text-gray-600">
        Please log in to access your dashboard.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: COLOR_PRIMARY_PURPLE }}
        >
          My Reports
        </h1>

        <div className="flex items-center gap-3">
          {/* Add Report button – visible only to non-admins */}
          <button
            onClick={() => {
              setEditingReport(null);
              setFormData({
                title: "",
                description: "",
                location: "",
                lat: "",
                lng: "",
                status: "pending",
                media: [],
              });
              setCurrentStep(1);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 shadow text-sm transition-all duration-200"
          >
            <Plus className="w-4 h-4" /> Add Report
          </button>

          {/* View Toggle Buttons */}
          <div className="flex gap-2 bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setActiveView("list")}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
                activeView === "list"
                  ? "bg-white shadow text-red-600"
                  : "text-gray-600 hover:text-teal-600"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setActiveView("kanban")}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
                activeView === "kanban"
                  ? "bg-white shadow text-red-600"
                  : "text-gray-600 hover:text-teal-600"
              }`}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>

      {/* ListView */}
      {activeView === "list" && (
        <ListView
          role={role}
          reports={reports}
          setEditingReport={setEditingReport}
          onDelete={deleteReport}
          refreshKey={refreshKey}
          setShowModal={setShowModal}
        />
      )}

      {/* KanbanView */}
      {activeView === "kanban" && (
        <KanbanView
          reports={null}
          statuses={statuses}
          role={role}
          onEdit={handleEdit}
          onDelete={deleteReport}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        editingReport={editingReport}
        formData={formData}
        setFormData={setFormData}
        currentStep={currentStep}
        nextStep={nextStep}
        prevStep={prevStep}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Reports;
