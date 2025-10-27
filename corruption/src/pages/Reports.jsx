import React, { useState } from "react";
import {
  LayoutGrid,
  List,
  Upload,
  Trash2,
  ChevronDown,
  Pencil,
  Plus,
} from "lucide-react"; // Removed MapPin import
import { dummyReports, statuses } from "../data/reportsData";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const COLOR_PRIMARY_PURPLE = "#4D2C5E";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const Reports = () => {
  const [activeView, setActiveView] = useState("list");
  const [reports, setReports] = useState(dummyReports);
  const [editingReport, setEditingReport] = useState(null);
  const [activeStatusDropdown, setActiveStatusDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    coordinates: "",
    date: "",
    status: "pending",
    media: null,
  });

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const role = loggedInUser?.role || "user";

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleDelete = (id) => setReports(reports.filter((r) => r.id !== id));

  const handleStatusUpdate = (id, newStatus) => {
    setReports(
      reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setActiveStatusDropdown(null);
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData(report);
    setShowModal(true);
    setCurrentStep(1);
  };

  const handleSubmit = () => {
    if (editingReport) {
      setReports(
        reports.map((r) => (r.id === editingReport.id ? { ...formData } : r))
      );
    } else {
      const newReport = { 
        ...formData, 
        id: reports.length + 1,
        date: formData.date || new Date().toISOString().split('T')[0] // Add default date if empty
      };
      setReports([...reports, newReport]);
    }
    setEditingReport(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      coordinates: "",
      date: "",
      status: "pending",
      media: null,
    });
    setCurrentStep(1);
    setShowModal(false);
  };

  const groupedReports = statuses
    .filter((s) => s !== "all")
    .map((status) => ({
      status,
      items: reports.filter((r) => r.status === status),
    }));

  const getCoordinates = (coordString) => {
    if (!coordString) return [6.5244, 3.3792]; // Default to Lagos coordinates
    const parts = coordString.split(",");
    if (parts.length === 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());
      return [isNaN(lat) ? 6.5244 : lat, isNaN(lng) ? 3.3792 : lng];
    }
    return [6.5244, 3.3792]; // Default coordinates
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveStatusDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
                  description: "",
                  location: "",
                  coordinates: "",
                  date: new Date().toISOString().split('T')[0], // Set default date
                  status: "pending",
                  media: null,
                });
                setCurrentStep(1);
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 shadow text-sm transition duration-200"
            >
              <Plus className="w-4 h-4" /> Add Report
            </button>
          )}

          <div className="flex gap-2 bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setActiveView("list")}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition duration-200 ${
                activeView === "list"
                  ? "bg-white shadow text-teal-600"
                  : "text-gray-600 hover:text-teal-600"
              }`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setActiveView("kanban")}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition duration-200 ${
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
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 font-semibold">Title</th>
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold">Location</th>
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length ? (
                reports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50 transition duration-150">
                    <td className="p-3 font-medium">{report.title}</td>
                    <td className="p-3 text-gray-600 max-w-xs truncate">{report.description}</td>
                    <td className="p-3">{report.location}</td>
                    <td className="p-3">{report.date}</td>
                    <td className="p-3">
                      <span className="capitalize px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {report.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {role === "admin" ? (
                          <>
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveStatusDropdown(
                                    activeStatusDropdown === report.id ? null : report.id
                                  );
                                }}
                                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs"
                              >
                                Status <ChevronDown className="w-4 h-4" />
                              </button>
                              {activeStatusDropdown === report.id && (
                                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32">
                                  {statuses
                                    .filter((s) => s !== "all")
                                    .map((s) => (
                                      <div
                                        key={s}
                                        onClick={() => handleStatusUpdate(report.id, s)}
                                        className="px-4 py-2 text-sm cursor-pointer hover:bg-teal-100 capitalize transition duration-150"
                                      >
                                        {s}
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDelete(report.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </>
                        ) : (
                          report.status === "pending" && (
                            <button
                              onClick={() => handleEdit(report)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
                            >
                              <Pencil className="w-4 h-4" /> Edit
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">
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
              <h2 className="font-semibold capitalize mb-3 text-gray-700">{status}</h2>
              <div className="space-y-3">
                {items.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-lg shadow p-3 border border-gray-200 hover:shadow-md transition duration-300"
                  >
                    <h3 className="font-semibold text-sm mb-2">{report.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{report.description}</p>

                    {report.media && (
                      <div className="mb-3">
                        {report.media.type?.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(report.media)}
                            alt="media"
                            className="rounded-md w-full h-32 object-cover"
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(report.media)}
                            controls
                            className="rounded-md w-full h-32 object-cover"
                          />
                        )}
                      </div>
                    )}

                    {report.coordinates && (
                      <div className="h-32 mb-3">
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

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{report.location}</span>
                      <span>{report.date}</span>
                    </div>

                    <div className="mt-3 flex justify-end gap-2">
                      {role === "admin" ? (
                        <>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveStatusDropdown(
                                  activeStatusDropdown === report.id ? null : report.id
                                );
                              }}
                              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleDelete(report.id)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
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
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl transition duration-200"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {editingReport ? "Edit Report" : "Add Report"}
            </h2>

            {/* Stepper */}
            <div className="flex justify-between mb-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1 text-center">
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white transition duration-200 ${
                      currentStep === step ? "bg-teal-500" : "bg-gray-300"
                    }`}
                  >
                    {step}
                  </div>
                  <p className="text-xs mt-1 text-gray-600">
                    {step === 1
                      ? "Type & Description"
                      : step === 2
                      ? "Location & Map"
                      : "Review & Submit"}
                  </p>
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="space-y-4">
              {currentStep === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <select
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="Red Flag">Red Flag</option>
                      <option value="Intervention">Intervention</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      placeholder="Provide detailed description of the incident..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows="4"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location / Address</label>
                    <input
                      type="text"
                      placeholder="Enter the location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates (lat,lng)</label>
                    <input
                      type="text"
                      placeholder="6.5244, 3.3792"
                      value={formData.coordinates}
                      onChange={(e) =>
                        setFormData({ ...formData, coordinates: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Evidence</label>
                    <div className="flex items-center gap-2 border border-gray-300 rounded-md p-2">
                      <Upload className="text-gray-500 w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) =>
                          setFormData({ ...formData, media: e.target.files[0] })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {formData.coordinates && (
                    <div className="h-48 mt-2">
                      <MapContainer
                        center={getCoordinates(formData.coordinates)}
                        zoom={13}
                        scrollWheelZoom={false}
                        className="w-full h-full rounded"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          position={getCoordinates(formData.coordinates)}
                          icon={markerIcon}
                        >
                          <Popup>{formData.location || "Selected Location"}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  )}
                </>
              )}

              {currentStep === 3 && (
                <div className="space-y-3">
                  <div><strong>Type:</strong> {formData.title || "Not specified"}</div>
                  <div><strong>Description:</strong> {formData.description || "Not provided"}</div>
                  <div><strong>Location:</strong> {formData.location || "Not specified"}</div>
                  <div><strong>Coordinates:</strong> {formData.coordinates || "Not provided"}</div>

                  {formData.media && (
                    <div>
                      <strong>Evidence:</strong>
                      {formData.media.type?.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(formData.media)}
                          alt="media"
                          className="rounded-md w-full h-32 object-cover mt-2"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(formData.media)}
                          controls
                          className="rounded-md w-full h-32 object-cover mt-2"
                        />
                      )}
                    </div>
                  )}

                  {formData.coordinates && (
                    <div className="h-48 mt-2">
                      <MapContainer
                        center={getCoordinates(formData.coordinates)}
                        zoom={13}
                        scrollWheelZoom={false}
                        className="w-full h-full rounded"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          position={getCoordinates(formData.coordinates)}
                          icon={markerIcon}
                        >
                          <Popup>{formData.location || "Selected Location"}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition duration-200"
                >
                  Back
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600 transition duration-200 ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600 transition duration-200 ml-auto"
                >
                  {editingReport ? "Save Changes" : "Submit Report"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;