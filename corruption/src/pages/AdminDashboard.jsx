import React, { useState, useEffect } from "react";
import { FileWarning, CheckCircle, AlertTriangle, Wrench, Search, ChevronDown } from "lucide-react";
import { useReports } from "../contexts/ReportContext";
import { useUsers } from "../contexts/UserContext";
import Header from "../components/Header";

const COLOR_PRIMARY_PURPLE = "#4D2C5E";
const COLOR_PRIMARY_TEAL = "#116E75";

const statusOptions = ["pending", "under-investigation", "resolved"];

const AdminDashboard = () => {
  const { reports, updateReport, deleteReport, getStats } = useReports();
  const { currentUser } = useUsers();

  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({ status: "all", search: "" });
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Filter reports in real-time
  useEffect(() => {
    let filtered = [...reports];
    
    if (filters.status !== "all") {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.title?.toLowerCase().includes(searchLower) ||
          r.description?.toLowerCase().includes(searchLower) ||
          r.location?.toLowerCase().includes(searchLower) ||
          r.userName?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredReports(filtered);
  }, [filters, reports]);

  const stats = getStats();

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "under-investigation": return "bg-blue-100 text-blue-700";
      case "resolved": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusUpdate = (reportId, newStatus) => {
    updateReport(reportId, { status: newStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      deleteReport(id);
    }
  };

  const getStatusDisplay = (status) => status.replace("-", " ");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20 px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold" style={{ color: COLOR_PRIMARY_PURPLE }}>
            Admin Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Reports", value: stats.total, icon: "📊", color: COLOR_PRIMARY_TEAL },
            { label: "Red Flags", value: stats.redFlags, icon: "🚩", color: "#DC2626" },
            { label: "Interventions", value: stats.interventions, icon: "🛠️", color: "#2563EB" },
            { label: "Pending", value: stats.pending, icon: "⏳", color: "#EAB308" },
            { label: "Resolved", value: stats.resolved, icon: "✅", color: "#16A34A" },
          ].map((s) => (
            <div key={s.label} className="bg-white p-4 rounded-xl shadow-md flex items-center gap-3 border-l-4" style={{ borderColor: s.color }}>
              <div className="p-2 rounded-lg text-white text-xl" style={{ backgroundColor: s.color }}>
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-4 items-end">
          {/* Status Dropdown */}
          <div className="relative w-48">
            <label className="text-sm font-semibold text-gray-600">Status</label>
            <button
              className="w-full flex items-center justify-between px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none shadow mt-1"
              style={{ borderColor: COLOR_PRIMARY_TEAL }}
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            >
              <span className="capitalize">
                {filters.status === "all" ? "All Status" : getStatusDisplay(filters.status)}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            {statusDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div
                  onClick={() => {
                    setFilters({ ...filters, status: "all" });
                    setStatusDropdownOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-teal-100 capitalize"
                >
                  All Status
                </div>
                {statusOptions.map(s => (
                  <div
                    key={s}
                    onClick={() => { setFilters({ ...filters, status: s }); setStatusDropdownOpen(false); }}
                    className="px-4 py-2 cursor-pointer hover:bg-teal-100 capitalize"
                  >
                    {getStatusDisplay(s)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <label className="text-sm font-semibold text-gray-600">Search</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search reports by title, description, location, or user..."
                className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 focus:ring-2 focus:ring-[#116E75] focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => setFilters({ status: "all", search: "" })}
            className="bg-[#116E75] text-white px-4 py-2 rounded-md hover:bg-[#0d575c] transition"
          >
            Clear Filters
          </button>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 border-b">#</th>
                <th className="px-4 py-3 border-b">Title</th>
                <th className="px-4 py-3 border-b">Description</th>
                <th className="px-4 py-3 border-b">Type</th>
                <th className="px-4 py-3 border-b">User</th>
                <th className="px-4 py-3 border-b">Location</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b">Date</th>
                <th className="px-4 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    {reports.length === 0 ? "No reports submitted yet." : "No reports match your filters."}
                  </td>
                </tr>
              ) : (
                filteredReports.map((r, idx) => (
                  <tr key={r.id} className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3 font-semibold">{r.title || "Untitled Report"}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="truncate" title={r.description}>
                        {r.description || "No description"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        r.reportType === "red-flag" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {r.reportType === "red-flag" ? "🚩 Red Flag" : "🛠️ Intervention"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{r.userName || "Unknown User"}</td>
                    <td className="px-4 py-3">{r.location || "Not specified"}</td>
                    <td className="px-4 py-3 capitalize">
                      <select
                        value={r.status || "pending"}
                        onChange={(e) => handleStatusUpdate(r.id, e.target.value)}
                        className={`px-3 py-1 rounded text-sm border-none focus:ring-2 focus:ring-blue-300 cursor-pointer ${getStatusColor(r.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="under-investigation">Under Investigation</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">{r.date || "Unknown"}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleDelete(r.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs transition-colors"
                        title="Delete Report"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredReports.length} of {reports.length} total reports
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
