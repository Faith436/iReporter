// import React, { useState, useEffect } from "react";
// import { Search, ChevronDown, Trash2 } from "lucide-react";
// import { useUsers } from "../contexts/UserContext";
// import Header from "../components/Header";
// import apiService from "../services/api"; // axios service with /users, /reports endpoints
// import { useNavigate } from "react-router-dom";

// const COLOR_PRIMARY_PURPLE = "#4D2C5E";
// const COLOR_PRIMARY_TEAL = "#116E75";
// const statusOptions = ["pending", "under-investigation", "resolved"];

// const AdminDashboard = () => {
//   const { currentUser } = useUsers();
//   const navigate = useNavigate();

//   const [reports, setReports] = useState([]);
//   const [filteredReports, setFilteredReports] = useState([]);
//   const [filters, setFilters] = useState({ status: "all", search: "" });
//   const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

//   // --- Fetch reports from backend ---
//   const fetchReports = async () => {
//     try {
//       let res = await apiService.getReports(); // GET /reports
//       if (currentUser.role !== "admin") {
//         // filter only current user's reports
//         res.reports = res.reports.filter(
//           (r) => r.createdBy === currentUser.email
//         );
//       }
//       setReports(res.reports);
//     } catch (err) {
//       console.error("Error fetching reports:", err);
//     }
//   };

//   useEffect(() => {
//     if (!currentUser) {
//       navigate("/login"); // redirect if not logged in
//       return;
//     }
//     fetchReports();
//   }, [currentUser]);

//   // --- Filter reports ---
//   useEffect(() => {
//     let filtered = [...reports];

//     if (filters.status !== "all") {
//       filtered = filtered.filter((r) => r.status === filters.status);
//     }

//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       filtered = filtered.filter(
//         (r) =>
//           r.title?.toLowerCase().includes(searchLower) ||
//           r.description?.toLowerCase().includes(searchLower) ||
//           r.location?.toLowerCase().includes(searchLower) ||
//           r.userName?.toLowerCase().includes(searchLower)
//       );
//     }

//     setFilteredReports(filtered);
//   }, [filters, reports]);

//   const handleStatusUpdate = async (reportId, newStatus) => {
//     try {
//       // 1. Update report status
//       await apiService.updateReport(reportId, { status: newStatus });
//       setReports((prev) =>
//         prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
//       );

//       // 2. Find the report owner
//       const report = reports.find((r) => r.id === reportId);
//       if (!report) return;

//       const userId = report.userId; // or report.createdBy if that's the user's id
//       const reportTitle = report.title || "Untitled Report";

//       // 3. Create a notification for the user
//       await apiService.createNotification({
//         user_id: userId,
//         message: `The status of your report "${reportTitle}" has been updated to "${newStatus.replace(
//           "-",
//           " "
//         )}".`,
//       });
//     } catch (err) {
//       console.error("Failed to update status or create notification:", err);
//     }
//   };

//   // --- Delete report ---
//   const handleDelete = async (reportId) => {
//     if (!window.confirm("Are you sure you want to delete this report?")) return;
//     try {
//       await apiService.deleteReport(reportId);
//       setReports((prev) => prev.filter((r) => r.id !== reportId));
//     } catch (err) {
//       console.error("Failed to delete report:", err);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "under-investigation":
//         return "bg-blue-100 text-blue-700";
//       case "resolved":
//         return "bg-green-100 text-green-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const getStatusDisplay = (status) => status.replace("-", " ");

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <main className="pt-20 px-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1
//             className="text-3xl font-bold"
//             style={{ color: COLOR_PRIMARY_PURPLE }}
//           >
//             {currentUser.role === "admin" ? "Admin Dashboard" : "My Reports"}
//           </h1>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-4 items-end">
//           <div className="relative w-48">
//             <label className="text-sm font-semibold text-gray-600">
//               Status
//             </label>
//             <button
//               className="w-full flex items-center justify-between px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none shadow mt-1"
//               style={{ borderColor: COLOR_PRIMARY_TEAL }}
//               onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
//             >
//               <span className="capitalize">
//                 {filters.status === "all"
//                   ? "All Status"
//                   : getStatusDisplay(filters.status)}
//               </span>
//               <ChevronDown className="w-4 h-4 text-gray-600" />
//             </button>
//             {statusDropdownOpen && (
//               <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//                 <div
//                   onClick={() => {
//                     setFilters({ ...filters, status: "all" });
//                     setStatusDropdownOpen(false);
//                   }}
//                   className="px-4 py-2 cursor-pointer hover:bg-teal-100 capitalize"
//                 >
//                   All Status
//                 </div>
//                 {statusOptions.map((s) => (
//                   <div
//                     key={s}
//                     onClick={() => {
//                       setFilters({ ...filters, status: s });
//                       setStatusDropdownOpen(false);
//                     }}
//                     className="px-4 py-2 cursor-pointer hover:bg-teal-100 capitalize"
//                   >
//                     {getStatusDisplay(s)}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="flex-1 relative">
//             <label className="text-sm font-semibold text-gray-600">
//               Search
//             </label>
//             <div className="relative mt-1">
//               <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 value={filters.search}
//                 onChange={(e) =>
//                   setFilters({ ...filters, search: e.target.value })
//                 }
//                 placeholder="Search reports by title, description, location, or user..."
//                 className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 focus:ring-2 focus:ring-[#116E75] focus:outline-none"
//               />
//             </div>
//           </div>

//           <button
//             onClick={() => setFilters({ status: "all", search: "" })}
//             className="bg-[#116E75] text-white px-4 py-2 rounded-md hover:bg-[#0d575c] transition"
//           >
//             Clear Filters
//           </button>
//         </div>

//         {/* Reports Table */}
//         <div className="overflow-x-auto bg-white rounded-xl shadow">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-3 border-b">#</th>
//                 <th className="px-4 py-3 border-b">Title</th>
//                 <th className="px-4 py-3 border-b">Description</th>
//                 <th className="px-4 py-3 border-b">Type</th>
//                 {currentUser.role === "admin" && (
//                   <th className="px-4 py-3 border-b">User</th>
//                 )}
//                 <th className="px-4 py-3 border-b">Location</th>
//                 <th className="px-4 py-3 border-b">Status</th>
//                 <th className="px-4 py-3 border-b">Date</th>
//                 <th className="px-4 py-3 border-b">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredReports.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={currentUser.role === "admin" ? 9 : 8}
//                     className="text-center py-8 text-gray-500"
//                   >
//                     {reports.length === 0
//                       ? "No reports submitted yet."
//                       : "No reports match your filters."}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredReports.map((r, idx) => (
//                   <tr
//                     key={r.id}
//                     className={`border-t ${
//                       idx % 2 === 0 ? "bg-white" : "bg-gray-50"
//                     } hover:bg-gray-100`}
//                   >
//                     <td className="px-4 py-3">{idx + 1}</td>
//                     <td className="px-4 py-3 font-semibold">
//                       {r.title || "Untitled Report"}
//                     </td>
//                     <td className="px-4 py-3 max-w-xs">
//                       <div className="truncate" title={r.description}>
//                         {r.description || "No description"}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           r.reportType === "red-flag"
//                             ? "bg-red-100 text-red-700"
//                             : "bg-blue-100 text-blue-700"
//                         }`}
//                       >
//                         {r.reportType === "red-flag"
//                           ? "🚩 Red Flag"
//                           : "🛠️ Intervention"}
//                       </span>
//                     </td>
//                     {currentUser.role === "admin" && (
//                       <td className="px-4 py-3">{r.userName || r.createdBy}</td>
//                     )}
//                     <td className="px-4 py-3">
//                       {r.location || "Not specified"}
//                     </td>
//                     <td className="px-4 py-3 capitalize">
//                       <select
//                         value={r.status || "pending"}
//                         onChange={(e) =>
//                           handleStatusUpdate(r.id, e.target.value)
//                         }
//                         className={`px-3 py-1 rounded text-sm border-none focus:ring-2 focus:ring-blue-300 cursor-pointer ${getStatusColor(
//                           r.status
//                         )}`}
//                         disabled={currentUser.role !== "admin"} // only admin can change
//                       >
//                         {statusOptions.map((s) => (
//                           <option key={s} value={s}>
//                             {s.replace("-", " ")}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="px-4 py-3">{r.date || "Unknown"}</td>
//                     <td className="px-4 py-3">
//                       {currentUser.role === "admin" ? (
//                         <button
//                           onClick={() => handleDelete(r.id)}
//                           className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs transition-colors"
//                           title="Delete Report"
//                         >
//                           <Trash2 className="w-4 h-4 inline" /> Delete
//                         </button>
//                       ) : (
//                         <span className="text-gray-400 text-xs">
//                           No actions
//                         </span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-4 text-sm text-gray-600">
//           Showing {filteredReports.length} of {reports.length} total reports
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from "react";
import { FileWarning, CheckCircle, AlertTriangle, Wrench, Search, ChevronDown } from "lucide-react";
import { useReports } from "../contexts/ReportContext";
import { useUsers } from "../contexts/UserContext";
import Header from "../components/Header";
<<<<<<< Updated upstream

const COLOR_PRIMARY_PURPLE = "#4D2C5E";
const COLOR_PRIMARY_TEAL = "#116E75";

const statusOptions = ["pending", "under-investigation", "resolved"];

const AdminDashboard = () => {
  const { reports, updateReport, deleteReport, getStats } = useReports();
=======
import apiService from "../services/api";
import { useNavigate } from "react-router-dom";
import SimpleAdminDashboard from "../components/SimpleAdminDashboard";

const COLOR_PRIMARY_PURPLE = "#4D2C5E";
const COLOR_PRIMARY_TEAL = "#116E75";
const statusOptions = ["pending", "under investigation", "resolved", "rejected"];

const AdminDashboard = () => {
  
>>>>>>> Stashed changes
  const { currentUser } = useUsers();

  const [filteredReports, setFilteredReports] = useState([]);
  const [filters, setFilters] = useState({ status: "all", search: "" });
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

<<<<<<< Updated upstream
  // Filter reports in real-time
=======
  // --- Fetch reports from backend ---
  const fetchReports = async () => {
    try {
      setLoading(true);
      let allReports;
      
      if (currentUser.role === "admin") {
        // Use getAllReports for admin
        allReports = await apiService.getAllReports();
      } else {
        // Use getUserReports for regular users
        allReports = await apiService.getUserReports();
      }
      
      setReports(allReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchReports();
  }, [currentUser]);

  // --- Filter reports ---
>>>>>>> Stashed changes
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
          (r.user_name && r.user_name.toLowerCase().includes(searchLower)) ||
          (r.email && r.email.toLowerCase().includes(searchLower))
      );
    }

    setFilteredReports(filtered);
  }, [filters, reports]);

<<<<<<< Updated upstream
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
=======
  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      // Update report status
      await apiService.updateReportStatus(reportId, { status: newStatus });
      
      // Update local state
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );

      // Find the report to get user info for notification
      const report = reports.find((r) => r.id === reportId);
      if (!report) return;

      // Create a notification for the user
      await apiService.createNotification({
        user_id: report.user_id,
        message: `The status of your report "${report.title}" has been updated to "${newStatus}".`,
      });
    } catch (err) {
      console.error("Failed to update status or create notification:", err);
      alert("Failed to update report status");
    }
  };

  // --- Delete report ---
  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await apiService.deleteReport(reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      console.error("Failed to delete report:", err);
      alert("Failed to delete report");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "under investigation":
        return "bg-blue-100 text-blue-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
>>>>>>> Stashed changes
    }
  };

  const getStatusDisplay = (status) => status;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-20 px-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        </main>
      </div>
    );
  }

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
<<<<<<< Updated upstream
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
=======
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          r.report_type === "Red-Flag" || r.report_type === "red-flag"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {r.report_type === "Red-Flag" || r.report_type === "red-flag"
                          ? "🚩 Red Flag"
                          : "🛠️ Intervention"}
                      </span>
                    </td>
                    {currentUser.role === "admin" && (
                      <td className="px-4 py-3">{r.user_name || r.email || "Unknown User"}</td>
                    )}
                    <td className="px-4 py-3">
                      {r.location || "Not specified"}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <select
                        value={r.status || "pending"}
                        onChange={(e) =>
                          handleStatusUpdate(r.id, e.target.value)
                        }
                        className={`px-3 py-1 rounded text-sm border-none focus:ring-2 focus:ring-blue-300 cursor-pointer ${getStatusColor(
                          r.status
                        )}`}
                        disabled={currentUser.role !== "admin"}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
>>>>>>> Stashed changes
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : "Unknown"}
                    </td>
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
      <SimpleAdminDashboard />;
      
    </div>
    
  );
};

export default AdminDashboard;
