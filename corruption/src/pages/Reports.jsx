import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutGrid,
  List,
  Trash2,
  ChevronDown,
  Pencil,
  Plus,
  MapPin,
} from "lucide-react";

const COLOR_PRIMARY_PURPLE = "#4D2C5E";
const statuses = ["pending", "under investigation", "resolved", "rejected"];
const LOCAL_STORAGE_KEY = "__REPORTS_DASHBOARD_DATA__";

const initialFormData = {
  title: "",
  specificTitle: "",
  description: "",
  location: "",
  lat: 0,
  lng: 0,
  status: "pending",
  media: null,
};

// --- Stepper Component ---
const ReportStepper = ({ currentStep, nextStep, prevStep, formData, setFormData, handleSubmit, isEditing }) => {
  const steps = [
    { name: "Details", fields: ["title", "specificTitle", "description"] },
    { name: "Location", fields: ["location", "lat", "lng"] },
    { name: "Review", fields: ["media", "status"] },
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const currentStepFields = steps[currentStep - 1]?.fields || [];

  return (
    <div className="space-y-6">
      {/* Step Indicators */}
      <div className="flex justify-between items-center text-sm font-medium">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center relative">
            <div
              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ${
                currentStep > index
                  ? "bg-teal-500 text-white"
                  : currentStep === index + 1
                  ? "bg-teal-300 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`mt-2 ${
                currentStep >= index + 1 ? "text-teal-600 font-semibold" : "text-gray-500"
              }`}
            >
              {step.name}
            </p>
          </div>
        ))}
      </div>

      {/* Form Fields */}
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
        {currentStepFields.includes("title") && (
          <label className="block">
            <span className="text-gray-700 font-medium">Title *</span>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              required
            />
          </label>
        )}
        {currentStepFields.includes("specificTitle") && (
          <label className="block">
            <span className="text-gray-700 font-medium">Specific Title (Optional)</span>
            <input
              type="text"
              name="specificTitle"
              value={formData.specificTitle || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
          </label>
        )}
        {currentStepFields.includes("description") && (
          <label className="block">
            <span className="text-gray-700 font-medium">Description *</span>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              required
            ></textarea>
          </label>
        )}
        {currentStepFields.includes("location") && (
          <label className="block">
            <span className="text-gray-700 font-medium">Location Name *</span>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              required
            />
          </label>
        )}
        {currentStepFields.includes("lat") && (
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700 font-medium">Latitude</span>
              <input
                type="number"
                name="lat"
                value={formData.lat || 0}
                onChange={handleChange}
                step="any"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </label>
            <label className="block">
              <span className="text-gray-700 font-medium">Longitude</span>
              <input
                type="number"
                name="lng"
                value={formData.lng || 0}
                onChange={handleChange}
                step="any"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
              />
            </label>
          </div>
        )}
        {currentStepFields.includes("media") && (
          <label className="block">
            <span className="text-gray-700 font-medium">Media (Optional)</span>
            <input
              type="text"
              name="media"
              value={formData.media || ""}
              onChange={handleChange}
              placeholder="data:image/png;base64,..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            />
          </label>
        )}
        {currentStepFields.includes("status") && isEditing && (
          <label className="block">
            <span className="text-gray-700 font-medium">Status</span>
            <select
              name="status"
              value={formData.status || "pending"}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Back
          </button>
        )}
        {currentStep < steps.length ? (
          <button
            onClick={nextStep}
            className="ml-auto px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition shadow-lg"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className={`ml-auto px-4 py-2 ${
              isEditing ? "bg-blue-500 hover:bg-blue-600" : "bg-teal-500 hover:bg-teal-600"
            } text-white rounded-md transition shadow-lg`}
          >
            {isEditing ? "Save Changes" : "Submit Report"}
          </button>
        )}
      </div>
    </div>
  );
};

// --- Map Placeholder ---
const ReportMap = ({ coordinates, location }) => {
  const [lat, lng] = coordinates || [0, 0];
  const mapUrl = `https://placehold.co/400x150/50b89b/ffffff?text=${encodeURIComponent(location || "Map")}`;

  return (
    <div className="h-32 w-full mb-3 rounded-lg overflow-hidden border-2 border-teal-300 relative bg-teal-100/50 flex items-center justify-center">
      <MapPin className="w-8 h-8 text-teal-600 absolute z-10" />
      <p className="text-center text-xs text-teal-800 z-10 p-2 bg-white/70 rounded shadow-md">
        Map: ({lat.toFixed(4)}, {lng.toFixed(4)})
      </p>
      <img src={mapUrl} alt="Map Placeholder" className="absolute inset-0 w-full h-full object-cover opacity-50" />
    </div>
  );
};

// --- Reports Component ---
const Reports = () => {
  const [reports, setReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  // Mock user
  const loggedInUser = { role: "user", email: "test.user@example.com" };
  const role = loggedInUser?.role || null;
  const userEmail = loggedInUser?.email || null;

  // Coordinates parser
  const getCoordinates = useCallback((coordString) => {
    if (!coordString) return [0, 0];
    const parts = coordString.split(",").map(Number);
    return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) ? parts : [0, 0];
  }, []);

  // Load reports safely
  const loadReports = useCallback(() => {
    try {
      const allSaved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      if (role === "admin") setReports(allSaved);
      else setReports(allSaved.filter((r) => r.createdBy === userEmail));
    } catch (e) {
      console.error("Error loading reports:", e);
      setReports([]);
    }
  }, [role, userEmail]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const saveAllReports = (allReports) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allReports));
    } catch (e) {
      console.error("Error saving reports:", e);
    }
    loadReports();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      const allReports = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
      saveAllReports(allReports.filter((r) => r.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.location) return;

    const allReports = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const lat = parseFloat(formData.lat) || 0;
    const lng = parseFloat(formData.lng) || 0;
    const baseData = {
      ...formData,
      lat,
      lng,
      coordinates: `${lat},${lng}`,
    };

    if (editingReport) {
      const updatedGlobal = allReports.map((r) =>
        r.id === editingReport.id ? { ...r, ...baseData, status: formData.status } : r
      );
      saveAllReports(updatedGlobal);
    } else {
      const newReport = { ...baseData, id: Date.now(), date: new Date().toLocaleDateString(), createdBy: userEmail, status: "pending" };
      saveAllReports([...allReports, newReport]);
    }

    setEditingReport(null);
    setFormData(initialFormData);
    setCurrentStep(1);
    setShowModal(false);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleEdit = (report) => {
    setEditingReport(report);
    const [lat, lng] = getCoordinates(report.coordinates || "");
    setFormData({ ...report, lat, lng });
    setCurrentStep(1);
    setShowModal(true);
  };

  const groupedReports = statuses.map((status) => ({
    status,
    items: (reports || []).filter((r) => r.status === status),
  }));

  // Prevent render if no user
  if (!loggedInUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 font-inter">
      <h1 className="text-2xl font-bold mb-6" style={{ color: COLOR_PRIMARY_PURPLE }}>Reports Management</h1>

      {/* Add Report Button */}
      {role === "user" && (
        <button
          onClick={() => { setEditingReport(null); setFormData(initialFormData); setCurrentStep(1); setShowModal(true); }}
          className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
        >
          <Plus className="w-4 h-4" /> Add Report
        </button>
      )}

      {/* List or Kanban View */}
      <div className="mt-6">
        {groupedReports.map((group) => (
          <div key={group.status} className="mb-4">
            <h2 className="font-bold capitalize">{group.status} ({group.items.length})</h2>
            {group.items.length === 0 && <p className="text-sm text-gray-400">No {group.status} reports.</p>}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-xl p-8 shadow-2xl relative w-[95%] lg:max-w-[900px] max-h-[95vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-3xl">&times;</button>
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
