import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  List,
  Trash2,
  ChevronDown,
  Pencil,
  Plus,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import ReportStepper from "../components/ReportStepper";

const COLOR_PRIMARY_PURPLE = "#4D2C5E";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ✅ Define report statuses once
const statuses = ["pending", "under investigation", "resolved", "rejected"];

const Reports = () => {
  const [activeView, setActiveView] = useState("list");
  const [reports, setReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);
  const [activeStatusDropdown, setActiveStatusDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    specificTitle: "",
    description: "",
    location: "",
    lat: "",
    lng: "",
    status: "pending",
    media: null,
  });

  // ✅ logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const role = loggedInUser?.role || "user";
  const userEmail = loggedInUser?.email || "";

  // ✅ Load reports from localStorage
  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(savedReports);
  }, []);

  // ✅ Sync reports with localStorage
  useEffect(() => {
    localStorage.setItem("reports", JSON.stringify(reports));
  }, [reports]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      const updatedReports = reports.filter((r) => r.id !== id);
      setReports(updatedReports);
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    const updatedReports = reports.map((r) =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    setReports(updatedReports);
    setActiveStatusDropdown(null);
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData(report);
    setShowModal(true);
    setCurrentStep(1);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.location) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingReport) {
      const updatedReports = reports.map((r) =>
        r.id === editingReport.id ? { ...formData, createdBy: editingReport.createdBy } : r
      );
      setReports(updatedReports);
    } else {
      const newReport = {
        ...formData,
        id: Date.now(), // unique ID
        coordinates: `${formData.lat},${formData.lng}`,
        date: new Date().toLocaleDateString(),
        createdBy: userEmail,
      };
      setReports([...reports, newReport]);
    }

    setEditingReport(null);
    setFormData({
      title: "",
      specificTitle: "",
      description: "",
      location: "",
      lat: "",
      lng: "",
      status: "pending",
      media: null,
    });
    setCurrentStep(1);
    setShowModal(false);
  };

  // ✅ Group reports for Kanban view
  const groupedReports = statuses.map((status) => ({
    status,
    items: (role === "admin" ? reports : reports.filter((r) => r.createdBy === userEmail))
      .filter((r) => r.status === status),
  }));

  // ✅ Filter reports for list view (per role)
  const visibleReports =
    role === "admin" ? reports : reports.filter((r) => r.createdBy === userEmail);

  // ✅ Convert coordinates string to [lat, lng]
  const getCoordinates = (coordString) => {
    if (!coordString) return [0, 0];
    const parts = coordString.split(",");
    return parts.length === 2
      ? [parseFloat(parts[0]), parseFloat(parts[1])]
      : [0, 0];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY_PURPLE }}>
          Reports Management
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
                  media: null,
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
              <List className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setActiveView("kanban")}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
                activeView === "kanban"
                  ? "bg-white shadow text-teal-600"
                  : "text-gray-600 hover:text-teal-600"
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Kanban
            </button>
          </div>
        </div>
      </div>

      {/* LIST VIEW */}
      {activeView === "list" && (
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
              {visibleReports.length ? (
                visibleReports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{report.title}</td>
                    <td className="p-3">{report.description}</td>
                    <td className="p-3">{report.location}</td>
                    <td className="p-3">{report.date}</td>
                    <td className="p-3 capitalize">{report.status}</td>
                    <td className="p-3 relative flex gap-2">
                      {role === "admin" ? (
                        <>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveStatusDropdown(
                                  activeStatusDropdown === report.id ? null : report.id
                                )
                              }
                              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs"
                            >
                              Status <ChevronDown className="w-4 h-4" />
                            </button>
                            {activeStatusDropdown === report.id && (
                              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                {statuses.map((s) => (
                                  <div
                                    key={s}
                                    onClick={() => handleStatusUpdate(report.id, s)}
                                    className="px-4 py-2 text-sm cursor-pointer hover:bg-teal-100 capitalize"
                                  >
                                    {s}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(report.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </>
                      ) : (
                        report.status === "pending" && (
                          <button
                            onClick={() => handleEdit(report)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs flex items-center gap-1"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* KANBAN VIEW */}
      {activeView === "kanban" && (
        <div className="grid md:grid-cols-3 gap-6">
          {groupedReports.map(({ status, items }) => (
            <div key={status} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h2 className="font-semibold capitalize mb-3 text-gray-700">
                {status}
              </h2>
              <div className="space-y-3">
                {items.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-lg shadow p-3 border border-gray-200 hover:shadow-md transition relative"
                  >
                    <h3 className="font-semibold text-sm">{report.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">{report.description}</p>

                    {report.coordinates && (
                      <div className="h-32 mb-2">
                        <MapContainer
                          center={getCoordinates(report.coordinates)}
                          zoom={13}
                          scrollWheelZoom={false}
                          className="w-full h-full rounded"
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker
                            position={getCoordinates(report.coordinates)}
                            icon={markerIcon}
                          >
                            <Popup>{report.location}</Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    )}

                    <div className="mt-2 flex justify-between items-center">
                      {role === "admin" ? (
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        report.status === "pending" && (
                          <button
                            onClick={() => handleEdit(report)}
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL WITH STEPPER */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg relative w-[90%] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {editingReport ? "Edit Report" : "Add Report"}
            </h2>

            <ReportStepper
              currentStep={currentStep}
              nextStep={nextStep}
              prevStep={prevStep}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
