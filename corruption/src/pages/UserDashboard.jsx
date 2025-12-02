// src/pages/UserDashboard.jsx
import React, { useMemo, useState, useEffect, Suspense } from "react";
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
import toast, { Toaster } from "react-hot-toast";

import { useReports } from "../contexts/ReportContext";
import { useUsers } from "../contexts/UserContext";
import { useNotifications } from "../contexts/NotificationContext";

import UserReportsView from "../components/UserReportsView"; // optional but we keep for listing
import FirstLoginPopup from "../components/FirstLoginPopup";

const ReportStepper = React.lazy(() => import("../components/ReportStepper"));

// ----------------------- Utilities -----------------------
const normalizeStatus = (status) =>
  status?.toLowerCase().replace(/\s+/g, "-") || "pending";

const calculateMetrics = (reports = []) => {
  const counts = reports.reduce(
    (acc, report) => {
      const type = (report.type || "").toLowerCase();
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

// ----------------------- KPI Card -----------------------
const KPICard = ({ title, count, icon: Icon, color, trend }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between transition hover:shadow-lg hover:scale-[1.01] duration-150">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{count}</p>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${color.replace("bg-", "text-")}`} />
      </div>
    </div>

    {trend && (
      <div className="flex items-center mt-3 text-xs">
        {trend.icon && <trend.icon className={`w-3 h-3 mr-1 ${trend.color}`} />}
        <span className={`font-semibold ${trend.color} mr-1`}>{trend.value}</span>
        {title !== "Under Investigation" && <span className="text-gray-400">from last month</span>}
      </div>
    )}
  </div>
);

// ----------------------- Recent Reports (user view) -----------------------
const RecentReports = ({ reports = [] }) => {
  const statuses = ["pending", "under-investigation", "resolved", "rejected"];

  const getStatusStyle = (status) => {
    const normalized = normalizeStatus(status);
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
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Reports</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Title", "Date", "Type", "Status"].map((h) => (
                <th key={h} className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {reports.slice(0, 8).map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition">
                <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">{r.title}</td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">{formatDate(r.created_at)}</td>
                <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{(r.type || "").replace("-", " ")}</td>
                <td className="px-4 sm:px-6 py-4">
                  <span className={getStatusStyle(r.status)}>{r.status ?? "Pending"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Reports</h2>
        <div className="space-y-4">
          {reports.slice(0, 6).map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Title:</span>
                <span>{r.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{formatDate(r.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>{(r.type || "").replace("-", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={getStatusStyle(r.status)}>{r.status ?? "Pending"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ----------------------- Recent Notifications -----------------------
const RecentNotifications = () => {
  const { notifications = [] } = useNotifications();

  const arr = Array.isArray(notifications) ? notifications : notifications?.notifications || [];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Notifications</h2>
      {arr.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications yet.</p>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {arr.slice(0, 6).map((n, i) => (
            <div key={i} className="flex items-start p-3 rounded-lg bg-gray-50">
              <Bell className="w-5 h-5 mt-1 mr-3 text-blue-600" />
              <div>
                <p className="font-semibold text-sm text-gray-700">{n.title || "Notification"}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(n.created_at || n.createdAt || Date.now()).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------- User Dashboard (page) -----------------------
const UserDashboard = () => {
  const { reports, fetchReports } = useReports();
  const { currentUser, markFirstLoginSeen } = useUsers();
  const metrics = useMemo(() => calculateMetrics(reports), [reports]);
  const { fetchNotifications } = useNotifications();

  const [showFirstPopup, setShowFirstPopup] = useState(false);
  const [stepperOpen, setStepperOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [defaultReportType, setDefaultReportType] = useState("");

  useEffect(() => {
    // show first login popup when appropriate
    if (currentUser && !currentUser.firstLoginShown) setShowFirstPopup(true);
  }, [currentUser]);

  // small helper to refresh data
  const refreshAll = async () => {
    try {
      await fetchReports();
      await fetchNotifications();
    } catch (err) {
      console.error("Refresh failed", err);
    }
  };

  useEffect(() => {
    // initial load
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <Toaster position="top-center" />
      <header className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1 mb-4">Welcome back, {currentUser?.firstName || "User"} — here’s a quick summary of your reports.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <KPICard title="Pending" count={metrics.pending} icon={Clock} color="bg-pink-500" trend={metrics.pendingTrend} />
        <KPICard title="Resolved" count={metrics.resolved} icon={CheckCircle} color="bg-green-500" trend={metrics.resolvedTrend} />
        <KPICard title="Rejected" count={metrics.rejected} icon={XCircle} color="bg-red-500" trend={metrics.rejectedTrend} />
        <KPICard title="Total Red-Flags" count={metrics.totalRedFlags} icon={Flag} color="bg-red-500" trend={metrics.totalRedFlagsTrend} />
        <KPICard title="Interventions" count={metrics.interventions} icon={Zap} color="bg-blue-500" trend={metrics.interventionsTrend} />
        <KPICard title="Under Investigation" count={metrics.underInvestigation} icon={Search} color="bg-yellow-500" trend={metrics.underInvestigationTrend} />
      </div>

      {/* Content: Reports + Notifications */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <RecentReports reports={reports} />
        </div>

        <div className="w-full lg:w-80">
          <RecentNotifications />
        </div>
      </div>

      {/* First-login popup */}
      {showFirstPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <FirstLoginPopup
            onClose={() => {
              setShowFirstPopup(false);
              markFirstLoginSeen();
            }}
            onAddReport={() => {
              setDefaultReportType("");
              setStepperOpen(true);
            }}
          />
        </div>
      )}

      {/* Report stepper modal */}
      {stepperOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mt-20 p-6 relative">
            <button onClick={() => setStepperOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl">×</button>
            <Suspense fallback={null}>
              <ReportStepper
                defaultType={defaultReportType}
                reportToEdit={editingReport}
                setEditingReport={setEditingReport}
                onClose={() => setStepperOpen(false)}
                onReportAdded={() => {
                  setStepperOpen(false);
                  setShowFirstPopup(false);
                  markFirstLoginSeen();
                  refreshAll();
                  toast.success("Report added");
                }}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
