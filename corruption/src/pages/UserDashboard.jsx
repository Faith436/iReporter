import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useReports } from "../contexts/ReportContext";
import ListView from "../components/ListView";
import KanbanView from "../components/KanbanView";
import ReportModal from "../components/ReportModal";

const statuses = ["pending", "under investigation", "resolved", "rejected"];
const COLOR_PRIMARY_PURPLE = "#4D2C5E";

const Dashboard = () => {
  const {
    reports,
    createReport,
    updateReport,
    deleteReport,
    loading,
    fetchAllReports,
    fetchUserReports,
  } = useReports();

  const [activeView, setActiveView] = useState("list");
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    specificTitle: "",
    description: "",
    location: "",
    lat: "",
    lng: "",
    status: "pending",
    media: [],
  });

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const role = loggedInUser.role || "user";
  const userEmail = loggedInUser.email || "";

  useEffect(() => {
    role === "admin" ? fetchAllReports() : fetchUserReports();
  }, [role]);

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
      [
        "title",
        "specificTitle",
        "description",
        "location",
        "lat",
        "lng",
        "status",
      ].forEach((f) => submitData.append(f, formData[f] || ""));
      formData.media?.forEach((file) => submitData.append("media", file));
      editingReport
        ? await updateReport(editingReport.id, submitData)
        : await createReport(submitData);
      setFormData({
        title: "",
        specificTitle: "",
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

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: COLOR_PRIMARY_PURPLE }}
        >
          {role === "admin" ? "Admin Dashboard" : "My Reports"}
        </h1>

        <div className="flex items-center gap-3">
          {role === "user" && (
            <button
              onClick={() => {
                setEditingReport(null);
                setFormData({
                  title: "",
                  specificTitle: "",
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
              className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 shadow text-sm"
            >
              <Plus className="w-4 h-4" /> Add Report
            </button>
          )}
          <div className="flex gap-2 bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setActiveView("list")}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
                activeView === "list"
                  ? "bg-white shadow text-teal-600"
                  : "text-gray-600 hover:text-teal-600"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setActiveView("kanban")}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
                activeView === "kanban"
                  ? "bg-white shadow text-teal-600"
                  : "text-gray-600 hover:text-teal-600"
              }`}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>

      {activeView === "list" && (
        <ListView
          reports={reports}
          role={role}
          userEmail={userEmail}
          loading={loading}
          onEdit={handleEdit}
          onDelete={deleteReport}
        />
      )}
      {activeView === "kanban" && (
        <KanbanView
          reports={reports}
          statuses={statuses}
          role={role}
          userEmail={userEmail}
          onEdit={handleEdit}
          onDelete={deleteReport}
        />
      )}

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

export default Dashboard;
