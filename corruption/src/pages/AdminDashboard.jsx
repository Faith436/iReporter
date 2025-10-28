// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { 
  Bell, X, Search, Trash2, Edit3, FileWarning, CheckCircle, AlertTriangle, Wrench, Plus, ChevronDown 
} from "lucide-react";
import Header from "../components/Header";

const COLOR_PRIMARY_PURPLE = "#4D2C5E";
const COLOR_PRIMARY_TEAL = "#116E75";

// ✅ Define statuses and date options locally
const statuses = ["pending", "in-progress", "resolved", "under investigation"];
const dateOptions = ["All Dates", "Today", "Last 3 Days", "This Week", "This Month", "Last Month"];

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({ status: "all", date: "All Dates", search: "" });
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    location: "",
    date: "",
  });

  // Filter logic based on date
  const checkDateFilter = (reportDate) => {
    if (!reportDate) return true;
    const today = new Date();
    const report = new Date(reportDate);
    switch (filters.date) {
      case "Today":
        return report.toDateString() === today.toDateString();
      case "Last 3 Days":
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(today.getDate() - 3);
        return report >= threeDaysAgo && report <= today;
      case "This Week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return report >= weekStart && report <= weekEnd;
      case "This Month":
        return report.getMonth() === today.getMonth() && report.getFullYear() === today.getFullYear();
      case "Last Month":
        const lastMonth = today.getMonth() - 1;
        return report.getMonth() === lastMonth && report.getFullYear() === today.getFullYear();
      default:
        return true; // "All Dates"
    }
  };

  // Filter reports whenever filters or reports change
  useEffect(() => {
    let filtered = [...reports];
    if (filters.status !== "all") filtered = filtered.filter(r => r.status === filters.status);
    filtered = filtered.filter(r => checkDateFilter(r.date));
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.title?.toLowerCase().includes(searchLower) ||
          r.description?.toLowerCase().includes(searchLower) ||
          r.location?.toLowerCase().includes(searchLower)
      );
    }
    setFilteredReports(filtered);
  }, [filters, reports]);

  // Stats calculation
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "pending").length,
    inProgress: reports.filter(r => r.status === "in-progress").length,
    resolved: reports.filter(r => r.status === "resolved").length,
    underInvestigation: reports.filter(r => r.status === "under investigation").length,
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-500";
      case "in-progress": return "bg-blue-500";
      case "resolved": return "bg-green-500";
      case "under investigation": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  // Handle add/edit
  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.location || !formData.date) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingReport) {
      setReports(prev => prev.map(r => r.id === editingReport.id ? { ...r, ...formData } : r));
    } else {
      const newReport = {
        id: reports.length > 0 ? reports[reports.length - 1].id + 1 : 1,
        ...formData,
      };
      setReports(prev => [...prev, newReport]);
    }

    setModalOpen(false);
    setEditingReport(null);
    setFormData({ title: "", description: "", status: "pending", location: "", date: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-6 px-6">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold" style={{ color: COLOR_PRIMARY_PURPLE }}>Admin Dashboard</h1>
          <button
            onClick={() => { setModalOpen(true); setEditingReport(null); }}
            className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
          >
            <Plus className="w-4 h-4" /> Add Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Reports", value: stats.total, icon: <FileWarning />, color: COLOR_PRIMARY_TEAL },
            { label: "Pending", value: stats.pending, icon: <AlertTriangle />, color: "#EAB308" },
            { label: "In-Progress", value: stats.inProgress, icon: <Wrench />, color: "#0284C7" },
            { label: "Resolved", value: stats.resolved, icon: <CheckCircle />, color: "#16A34A" },
            { label: "Under Investigation", value: stats.underInvestigation, icon: <Search />, color: "#7C3AED" },
          ].map(s => (
            <div key={s.label} className="bg-white p-4 rounded-xl shadow-md flex items-center gap-3 border-l-4" style={{ borderColor: s.color }}>
              <div className="p-2 rounded-lg text-white" style={{ backgroundColor: s.color }}>{s.icon}</div>
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
              <span className="capitalize">{filters.status}</span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            {statusDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {["all", ...statuses].map(s => (
                  <div
                    key={s}
                    onClick={() => { setFilters({ ...filters, status: s }); setStatusDropdownOpen(false); }}
                    className="px-4 py-2 cursor-pointer hover:bg-teal-100 capitalize"
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date Dropdown */}
          <div className="relative w-48">
            <label className="text-sm font-semibold text-gray-600">Date</label>
            <button
              className="w-full flex items-center justify-between px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none shadow mt-1"
              style={{ borderColor: COLOR_PRIMARY_TEAL }}
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            >
              {filters.date}
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            {dateDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {dateOptions.map(d => (
                  <div
                    key={d}
                    onClick={() => { setFilters({ ...filters, date: d }); setDateDropdownOpen(false); }}
                    className="px-4 py-2 cursor-pointer hover:bg-teal-100 capitalize"
                  >
                    {d}
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
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search reports..."
                className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 focus:ring-2 focus:ring-[#116E75] focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => setFilters({ status: "all", date: "All Dates", search: "" })}
            className="bg-[#116E75] text-white px-4 py-2 rounded-md hover:bg-[#0d575c] transition"
          >
            Clear
          </button>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b w-8">#</th>
                <th className="px-4 py-2 border-b w-1/4">Title</th>
                <th className="px-4 py-2 border-b w-1/3">Description</th>
                <th className="px-4 py-2 border-b w-1/6">Status</th>
                <th className="px-4 py-2 border-b w-1/6">Date</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">No reports found.</td>
                </tr>
              ) : (
                filteredReports.map((r, idx) => (
                  <tr key={r.id} className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2 font-semibold">{r.title}</td>
                    <td className="px-4 py-2">{r.description}</td>
                    <td className="px-4 py-2 capitalize">
                      <span className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{r.date}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleDelete(r.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">{editingReport ? "Edit Report" : "Add New Report"}</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="border p-2 rounded"
              />
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="border p-2 rounded"
              />
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="border p-2 rounded"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={handleSubmit}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition mt-2"
              >
                {editingReport ? "Save Changes" : "Add Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
