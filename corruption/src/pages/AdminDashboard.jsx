import React, { useMemo, useEffect, useState } from "react";
import { useReports } from "../contexts/ReportContext";
import {
  Flag,
  Zap,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Bell,
} from "lucide-react";
import api from "../services/api";
import toast, { Toaster } from "react-hot-toast";

// --- Utility Functions ---
const normalizeStatus = (status) =>
  status?.toLowerCase().replace(/\s+/g, "-") || "pending";

const calculateMetrics = (reports) => {
  const counts = reports.reduce(
    (acc, report) => {
      const type = report.type?.toLowerCase() || "red-flag";
      const status = normalizeStatus(report.status);

      if (status === "pending") acc.pending++;
      if (status === "resolved") acc.resolved++;
      if (status === "rejected") acc.rejected++;
      if (status === "under-investigation") acc.underInvestigation++;

      if (type === "red-flag") acc.totalRedFlags++;
      if (type === "intervention") acc.interventions++;
      return acc;
    },
    {
      pending: 0,
      resolved: 0,
      rejected: 0,
      underInvestigation: 0,
      totalRedFlags: 0,
      interventions: 0,
    }
  );

  return {
    ...counts,
    pendingTrend: { value: "+15%", color: "text-green-500", icon: ArrowUp },
    resolvedTrend: { value: "+10%", color: "text-green-500", icon: ArrowUp },
    rejectedTrend: { value: "-5%", color: "text-red-500", icon: ArrowDown },
    totalRedFlagsTrend: {
      value: "+12%",
      color: "text-green-500",
      icon: ArrowUp,
    },
    interventionsTrend: {
      value: "+8%",
      color: "text-green-500",
      icon: ArrowUp,
    },
    underInvestigationTrend: {
      value: "3 new this week",
      color: "text-yellow-600",
      icon: Clock,
    },
  };
};

// --- KPI Card ---
const KPICard = ({ title, count, icon: Icon, color, trend }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between transition hover:shadow-lg hover:scale-[1.01] duration-150">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
          {count}
        </p>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${color.replace("bg-", "text-")}`} />
      </div>
    </div>
    {trend && (
      <div className="flex items-center mt-3 text-xs">
        {trend.icon && <trend.icon className={`w-3 h-3 mr-1 ${trend.color}`} />}
        <span className={`font-semibold ${trend.color} mr-1`}>
          {trend.value}
        </span>
        {title !== "Under Investigation" && (
          <span className="text-gray-400">from last month</span>
        )}
      </div>
    )}
  </div>
);

// --- Recent Reports ---
const RecentReports = ({ reports, onStatusUpdate }) => {
  const statuses = ["pending", "under-investigation", "resolved", "rejected"];
  const normalize = (status) =>
    status?.toLowerCase().replace(/\s+/g, "-") || "pending";

  const getStatusStyle = (status) => {
    const normalized = normalize(status);
    const base = "px-3 py-1 rounded-full text-xs font-medium capitalize";
    switch (normalized) {
      case "pending":
        return `${base} bg-pink-100 text-pink-700`;
      case "resolved":
        return `${base} bg-green-100 text-green-700`;
      case "rejected":
        return `${base} bg-red-100 text-red-700`;
      case "under-investigation":
        return `${base} bg-yellow-100 text-yellow-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Reports
        </h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Title", "User", "Status", "Date"].map((header) => (
                <th
                  key={header}
                  className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {reports.slice(0, 5).map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition">
                <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">
                  {report.title}
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                  {report.userName || report.user?.name || "Unknown User"}
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <select
                    value={normalize(report.status)}
                    onChange={(e) =>
                      onStatusUpdate(report.id, e.target.value, report.user_id)
                    }
                    className={`text-xs font-medium rounded-full px-2 py-1 border focus:outline-none focus:ring-2 ${getStatusStyle(
                      report.status
                    )}`}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() +
                          status.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                  {formatDate(report.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Reports
        </h2>
        <div className="space-y-4">
          {reports.slice(0, 5).map((report) => (
            <div
              key={report.id}
              className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 space-y-2"
            >
              <div className="flex justify-between">
                <span className="font-medium">Title:</span>
                <span>{report.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">User:</span>
                <span>
                  {report.userName || report.user?.name || "Unknown User"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <select
                  value={normalize(report.status)}
                  onChange={(e) =>
                    onStatusUpdate(report.id, e.target.value, report.user_id)
                  }
                  className={`text-xs font-medium rounded-full px-2 py-1 border focus:outline-none focus:ring-2 ${getStatusStyle(
                    report.status
                  )}`}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{formatDate(report.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Notifications Sidebar ---
const RecentNotifications = ({ notifications }) => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Recent Notifications
    </h2>
    {notifications.length === 0 ? (
      <p className="text-gray-500 text-sm">No notifications yet.</p>
    ) : (
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {notifications.slice(0, 5).map((n, i) => (
          <div key={i} className="flex items-start p-3 rounded-lg bg-gray-50">
            <Bell className="w-5 h-5 mt-1 mr-3 text-blue-600" />
            <div>
              <p className="font-semibold text-sm text-gray-700">
                {n.title || "Notification"}
              </p>
              <p className="text-sm text-gray-600">{n.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// --- Admin Dashboard ---
  const AdminDashboard = ({ onDelete }) => {
  const { reports, loading, currentUser, fetchReports } = useReports();
  const metrics = useMemo(() => calculateMetrics(reports), [reports]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchReports();
    fetchNotifications();
  }, [fetchReports]);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const STATUS_API_MAP = {
    pending: "pending",
    "under-investigation": "under-investigation",
    resolved: "resolved",
    rejected: "rejected",
  };

  const handleStatusUpdate = async (reportId, newStatus, userId) => {
    const formattedStatus = STATUS_API_MAP[newStatus];
    if (!formattedStatus) return console.error("Invalid status:", newStatus);

    try {
      console.log("Sending status update:", formattedStatus);
      await api.updateReportStatus(reportId, formattedStatus);
      if (userId) {
        const newNotification = {
          user_id: userId,
          title: "Report Update",
          message: `Your report status has been updated to "${formattedStatus}"`,
          is_read: 0,
          created_at: new Date().toISOString(),
        };
        await api.createNotification(newNotification);
        setNotifications((prev) => [newNotification, ...prev]);
      }
      fetchReports();
      toast.success(`Report status updated to "${formattedStatus}"`);
    } catch (err) {
      console.error("Error updating status or sending notification:", err);
      toast.error("Failed to update status.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Loading Dashboard Data...</p>
      </div>
    );

  const userName = currentUser?.name || "Admin";
  const displayName = userName.split(" ")[0] || "Admin";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <Toaster position="top-center" />
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Dashboard Overview
      </h1>
      <p className="text-gray-600 mt-1 mb-6 sm:mb-8">
        Welcome back, {displayName} — here’s a quick summary of your reports.
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <KPICard
          title="Pending"
          count={metrics.pending}
          icon={Clock}
          color="bg-pink-500"
          trend={metrics.pendingTrend}
        />
        <KPICard
          title="Resolved"
          count={metrics.resolved}
          icon={CheckCircle}
          color="bg-green-500"
          trend={metrics.resolvedTrend}
        />
        <KPICard
          title="Rejected"
          count={metrics.rejected}
          icon={XCircle}
          color="bg-red-500"
          trend={metrics.rejectedTrend}
        />
        <KPICard
          title="Total Red-Flags"
          count={metrics.totalRedFlags}
          icon={Flag}
          color="bg-red-500"
          trend={metrics.totalRedFlagsTrend}
        />
        <KPICard
          title="Interventions"
          count={metrics.interventions}
          icon={Zap}
          color="bg-blue-500"
          trend={metrics.interventionsTrend}
        />
        <KPICard
          title="Under Investigation"
          count={metrics.underInvestigation}
          icon={Search}
          color="bg-yellow-500"
          trend={metrics.underInvestigationTrend}
        />
      </div>

      {/* Reports + Notifications */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <RecentReports
            reports={reports}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
        <div className="w-full lg:w-80">
          <RecentNotifications notifications={notifications} />
        </div>
      </div>
    </div>
  );
};



export default AdminDashboard;