import React, { useState } from "react";
import {
  LayoutGrid,
  List,
  MapPin,
  Upload,
  Trash2,
  ChevronDown,
  Pencil,
  Plus,
} from "lucide-react";
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
      const newReport = { ...formData, id: reports.length + 1 };
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
                  description: "",
                  location: "",
                  coordinates: "",
                  date: "",
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
              {reports.length ? (
                reports.map((report) => (
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
                                {statuses
                                  .filter((s) => s !== "all")
                                  .map((s) => (
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
              <h2 className="font-semibold capitalize mb-3 text-gray-700">{status}</h2>
              <div className="space-y-3">
                {items.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-lg shadow p-3 border border-gray-200 hover:shadow-md transition relative"
                  >
                    <h3 className="font-semibold text-sm">{report.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">{report.description}</p>

                    {report.media && (
                      <div className="mb-2">
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
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveStatusDropdown(
                                  activeStatusDropdown === report.id ? null : report.id
                                )
                              }
                              className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs"
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
                        </div>
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
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {editingReport ? "Edit Report" : "Add Report"}
            </h2>

            {/* Stepper */}
            <div className="flex justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1 text-center">
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white ${
                      currentStep === step ? "bg-teal-500" : "bg-gray-300"
                    }`}
                  >
                    {step}
                  </div>
                  <p className="text-xs mt-1">
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
            <div className="space-y-3">
              {currentStep === 1 && (
                <>
                  <select
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Type</option>
                    <option value="Red Flag">Red Flag</option>
                    <option value="Intervention">Intervention</option>
                  </select>

                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <input
                    type="text"
                    placeholder="Location / Address"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    placeholder="Coordinates (lat,lng)"
                    value={formData.coordinates}
                    onChange={(e) =>
                      setFormData({ ...formData, coordinates: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                  <div className="flex items-center gap-2">
                    <Upload className="text-gray-500 w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) =>
                        setFormData({ ...formData, media: e.target.files[0] })
                      }
                      className="border p-2 rounded w-full"
                    />
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
                          <Popup>{formData.location}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  )}
                </>
              )}

              {currentStep === 3 && (
                <div className="space-y-2">
                  <p><strong>Type:</strong> {formData.title}</p>
                  <p><strong>Description:</strong> {formData.description}</p>
                  <p><strong>Location:</strong> {formData.location}</p>
                  <p><strong>Coordinates:</strong> {formData.coordinates}</p>

                  {formData.media && (
                    <div>
                      {formData.media.type?.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(formData.media)}
                          alt="media"
                          className="rounded-md w-full h-32 object-cover"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(formData.media)}
                          controls
                          className="rounded-md w-full h-32 object-cover"
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
                          <Popup>{formData.location}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-4">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Back
                </button>
              )}
              {currentStep < 3 && (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600 ml-auto"
                >
                  Next
                </button>
              )}
              {currentStep === 3 && (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600 ml-auto"
                >
                  Submit
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
