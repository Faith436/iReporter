// src/pages/Reports.jsx
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ReportStepper from "../components/ReportStepper";
import { useReports } from "../contexts/ReportContext";

const COLOR_PRIMARY_PURPLE = "#4D2C5E";

const initialFormData = {
  title: "",
  specificTitle: "",
  description: "",
  location: "",
  lat: "",
  lng: "",
  status: "pending",
  media: [],
};

const Reports = () => {
  const {
    reports,
    createReport,
    updateReport,
    deleteReport,
    fetchUserReports,
    loading,
  } = useReports();

  const [editingReport, setEditingReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  // Logged-in user info
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const role = loggedInUser?.role || "user";

  // Load user's reports on mount
  useEffect(() => {
    fetchUserReports();
  }, []);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData(report);
    setCurrentStep(1);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    await deleteReport(id);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      alert("Please fill in all required fields.");
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("specificTitle", formData.specificTitle);
    submitData.append("description", formData.description);
    submitData.append("location", formData.location);
    submitData.append("lat", formData.lat);
    submitData.append("lng", formData.lng);
    submitData.append("status", formData.status);

    if (formData.media && formData.media.length > 0) {
      formData.media.forEach((file) => submitData.append("media", file));
    }

    try {
      if (editingReport) {
        await updateReport(editingReport.id, submitData);
      } else {
        await createReport(submitData);
      }

      setFormData(initialFormData);
      setEditingReport(null);
      setShowModal(false);
      setCurrentStep(1);

      // Refresh user reports after creation/update
      fetchUserReports();
    } catch (err) {
      console.error(err);
      alert("Failed to submit report. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLOR_PRIMARY_PURPLE }}>
        {role === "admin" ? "All Reports" : "My Reports"}
      </h1>

      {/* Add Report Button */}
      {role === "user" && (
        <button
          onClick={() => {
            setEditingReport(null);
            setFormData(initialFormData);
            setCurrentStep(1);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
        >
          <Plus className="w-4 h-4" /> Add Report
        </button>
      )}

      {/* Reports List */}
      <div className="mt-6 bg-white shadow rounded-lg">
        <table className="min-w-full text-left text-sm">
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
            ) : reports.length ? (
              reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{report.title}</td>
                  <td className="p-3">{report.description}</td>
                  <td className="p-3">{report.location}</td>
                  <td className="p-3">{new Date(report.created_at).toLocaleDateString()}</td>
                  <td className="p-3 capitalize">{report.status}</td>
                  <td className="p-3 flex gap-2">
                    {role === "admin" ? (
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs flex items-center gap-1"
                      >
                        Delete
                      </button>
                    ) : (
                      report.status === "pending" && (
                        <button
                          onClick={() => handleEdit(report)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center gap-1"
                        >
                          Edit
                        </button>
                      )
                    )}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg relative w-[90%] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <ReportStepper
              currentStep={currentStep}
              nextStep={nextStep}
              prevStep={prevStep}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              isEditing={!!editingReport}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
