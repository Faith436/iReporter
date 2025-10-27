import React, { useState } from "react";
import { useReports } from "../contexts/ReportContext";
import { useUsers } from "../contexts/UserContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CreateReportModal from "../components/CreateReportModal";
import QuickStats from "../components/QuickStats";
import RecentReports from "../components/RecentReports";
import { Bell, Map, List, X } from "lucide-react";

const COLOR_PRIMARY_PURPLE = "#4D2C5E";
const COLOR_PRIMARY_TEAL = "#116E75";

// 🧭 Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🌙 Sidebar with notifications
const Side = ({ user }) => {
  const { notifications, markNotificationRead } = useReports();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(
    (n) => n.userId === user.id && !n.read
  ).length;

  return (
    <>
      <aside
        className="fixed top-0 left-0 h-screen w-72 text-white flex flex-col p-6 shadow-xl z-40"
        style={{
          background: `linear-gradient(180deg, ${COLOR_PRIMARY_PURPLE}, ${COLOR_PRIMARY_TEAL})`,
        }}
      >
        <div className="text-center mb-6">
          <img
            src="https://via.placeholder.com/80/ffffff/4D2C5E?text=U"
            alt="avatar"
            className="w-20 h-20 mx-auto rounded-full border-4 border-white mb-2 shadow-md"
          />
          <h3 className="font-semibold text-white">{user.name}</h3>
          <p className="text-gray-200 text-sm">{user.email}</p>
        </div>

        <ul className="flex-1 space-y-2 overflow-y-auto">
          <li
            className="flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-white/10 transition"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" /> Notifications
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </li>
        </ul>
      </aside>

      {/* Notifications dropdown */}
      {showNotifications && (
        <div className="fixed left-80 top-20 w-80 bg-white rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto border border-gray-200 animate-slideDown">
          <div className="flex justify-between items-center p-4 border-b bg-gray-50 rounded-t-xl">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-500 hover:text-red-500 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2">
            {notifications.filter((n) => n.userId === user.id).length === 0 ? (
              <div className="text-gray-500 p-4 text-center">
                No notifications
              </div>
            ) : (
              notifications
                .filter((n) => n.userId === user.id)
                .map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition ${
                      !n.read ? "bg-teal-50" : ""
                    }`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div className="font-medium text-gray-800">{n.title}</div>
                    <div className="text-sm text-gray-600">{n.message}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(n.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

// 🧾 Report List Component
const ReportList = ({ reports, onEdit }) => {
  const statusColors = {
    "under-investigation": "bg-yellow-100 text-yellow-700 border-yellow-200",
    resolved: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-gray-100 text-gray-700 border-gray-200",
  };
  const typeColors = {
    "red-flag": "bg-red-100 text-red-700 border-red-200",
    intervention: "bg-teal-100 text-teal-700 border-teal-200",
  };

  return (
    <div className="flex flex-col gap-6">
      {reports.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-500">
          No reports found.
        </div>
      ) : (
        reports.map((report) => (
          <div
            key={report.id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 ease-in-out"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-3">
              <h3
                className="text-lg font-semibold truncate"
                style={{ color: COLOR_PRIMARY_PURPLE }}
              >
                {report.title}
              </h3>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    statusColors[report.status]
                  }`}
                >
                  {report.status?.replace("-", " ") || "Pending"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    typeColors[report.reportType]
                  }`}
                >
                  {report.reportType?.replace("-", " ") || "Unknown"}
                </span>
                {report.status === "pending" && (
                  <button
                    className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-3 py-1 rounded-md text-sm transition"
                    onClick={() => onEdit(report)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-4">{report.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border-t border-gray-200 text-gray-600">
              <div className="flex items-center gap-2">📍 {report.location}</div>
              {report.coordinates && (
                <div>
                  🌐 {report.coordinates.lat}, {report.coordinates.lng}
                </div>
              )}
              {report.date && <div>📅 {report.date}</div>}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// 🧭 Main Dashboard
const Dashboard = () => {
  const { currentUser } = useUsers();
  const { reports, createReport, updateReport } = useReports();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeView, setActiveView] = useState("list");
  const [reportType, setReportType] = useState("all");
  const [editReport, setEditReport] = useState(null);

  if (!currentUser)
    return <div className="p-6 text-gray-600">Please log in to access your dashboard.</div>;

  const handleSaveReport = (reportData) => {
    const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
    // Add user information to the report
    const reportWithUser = { 
      ...reportData, 
      userId: currentUser.id,
      userName: currentUser.name,
      id: Date.now(), // Generate unique ID
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
      status: "pending"
    };

    if (editReport) {
      updateReport(editReport.id, reportWithUser);
    } else {
      createReport(reportWithUser);
    }
    
    setEditReport(null);
    setModalOpen(false);
    // Success message is now handled in the modal
  };

  const filteredReports =
    reportType === "all"
      ? reports
      : reports.filter((r) => r.reportType === reportType);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Side user={currentUser} />
      <div className="flex-1 p-8 ml-72">
        {/* Header */}
        <header className="mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: COLOR_PRIMARY_PURPLE }}
          >
            Incident Reports Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Report corruption incidents and request interventions easily.
          </p>
        </header>

        <QuickStats reports={reports} openModal={() => setModalOpen(true)} />

        {/* Recent Reports Section */}
        <div className="mb-8">
          <RecentReports />
        </div>

        {/* View toggle */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6 flex flex-wrap md:flex-row justify-between items-center gap-4">
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
              onClick={() => setActiveView("map")}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
                activeView === "map"
                  ? "bg-white shadow text-teal-600"
                  : "text-gray-600 hover:text-teal-600"
              }`}
            >
              <Map className="w-4 h-4" /> Map
            </button>
          </div>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm border-gray-300 focus:ring-1 focus:ring-teal-400 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="red-flag">Red Flag</option>
            <option value="intervention">Intervention</option>
          </select>
        </div>

        {/* Map View */}
        {activeView === "map" && (
          <div className="mb-6">
            {filteredReports.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-500">
                No reports to show on the map.
              </div>
            ) : (
              <MapContainer
                center={[6.5244, 3.3792]}
                zoom={6}
                className="leaflet-container h-96 rounded-md"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {filteredReports.map((r) => (
                  <Marker
                    key={r.id}
                    position={[
                      r.coordinates?.lat || 6.5244,
                      r.coordinates?.lng || 3.3792,
                    ]}
                  >
                    <Popup>
                      <strong>{r.title}</strong>
                      <br />
                      {r.description}
                      <br />
                      <em>{r.reportType}</em>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        )}

        {/* List View */}
        {activeView === "list" && (
          <ReportList reports={filteredReports} onEdit={setEditReport} />
        )}

        {/* Modal */}
        <CreateReportModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveReport}
          reportToEdit={editReport}
        />
      </div>
    </div>
  );
};

export default Dashboard;