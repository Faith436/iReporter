// src/pages/UserDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  Flag,
  Zap,
  Search,
  XCircle,
  Clock,
  Info,
  FileText,
} from "lucide-react";

import { useReports } from "../contexts/ReportContext";
import { useUsers } from "../contexts/UserContext";
import apiService from "../services/api";
import ReportStepper from "../components/ReportStepper";
import { useNavigate } from "react-router-dom";

// --- StatCard Component ---
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="relative bg-white border border-gray-100 rounded-xl p-8 shadow-md hover:shadow-lg transition-all">
      <div
        className={`absolute top-4 right-4 p-2 rounded-full ${colorClasses[color]} flex items-center justify-center`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      </div>
    </div>
  );
};

// --- StatusTag Component ---
const StatusTag = ({ status }) => {
  let classes = "";
  switch (status?.toLowerCase()) {
    case "resolved":
      classes = "bg-green-100 text-green-800";
      break;
    case "under-investigation":
      classes = "bg-blue-100 text-yellow-800";
      break;
    case "rejected":
      classes = "bg-red-100 text-red-800";
      break;
    case "pending":
      classes = "bg-gray-100 text-gray-800";
      break;
    default:
      classes = "bg-blue-100 text-blue-800";
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${classes}`}
    >
      {status}
    </span>
  );
};

// --- Recent Reports Table ---
const RecentReports = ({ reports = [] }) => {
  const safeReports = Array.isArray(reports)
    ? reports.filter((r) => r && typeof r === "object")
    : [];
  const recentReports = safeReports.slice(0, 5);

  if (recentReports.length === 0) {
    return (
      <div className="text-gray-500 text-center p-6 bg-gray-50 rounded border border-gray-200">
        No recent reports.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Reports
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Title", "Type", "Status", "Date"].map((header) => (
                <th
                  key={header}
                  className="px-3 py-3 text-left text-sm font-semibold text-gray-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentReports.map((r, idx) => (
              <tr key={r?.id || idx} className="hover:bg-gray-50">
                <td className="px-3 py-4">{r?.title ?? "Untitled Report"}</td>
                <td className="px-3 py-4">{r?.type ?? "Unknown"}</td>
                <td className="px-3 py-4">
                  <StatusTag status={r?.status ?? "Pending"} />
                </td>
                <td className="px-3 py-4">
                  {r?.created_at
                    ? new Date(r.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Recent Notifications ---
const RecentNotifications = ({ notifications, currentUser }) => {
  const userNotifications = notifications.filter(
    (n) => n.user_id === currentUser?.id
  );

  const IconMap = {
    Info: { Icon: Info, bg: "bg-blue-50", color: "text-blue-600" },
    Resolved: { Icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
    Reminder: { Icon: Clock, bg: "bg-yellow-50", color: "text-yellow-600" },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Notifications
      </h2>
      <div className="space-y-4">
        {userNotifications.length === 0 && (
          <p className="text-gray-500 text-sm text-center">
            No notifications yet.
          </p>
        )}
        {userNotifications.map((n) => {
          const { Icon, bg, color } = IconMap[n.type] || {
            Icon: Info,
            bg: "bg-gray-50",
            color: "text-gray-600",
          };
          return (
            <div
              key={n.id}
              className={`p-4 rounded-lg ${bg} border ${color.replace(
                "text",
                "border"
              )}`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 mt-1 ${color}`} />
                <div>
                  <p className={`text-sm font-semibold ${color}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Quick Actions ---
const QuickActions = ({ openStepper, setType }) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add Red-Flag Record",
      icon: Flag,
      className: "bg-red-500 hover:bg-teal-600 text-white",
      type: "Red Flag",
    },
    {
      label: "Add Intervention",
      icon: Zap,
      className: "bg-teal-500 hover:bg-teal-700 text-white",
      type: "Intervention",
    },
    {
      label: "View All Reports",
      icon: FileText,
      className: "bg-gray-100 hover:bg-gray-200 text-gray-800",
      type: "view",
    },
  ];

  const handleAction = (action) => {
    if (action.type === "view") {
      navigate("/dashboard/reports");
    } else {
      setType(action.type); // pre-select type in stepper
      setTimeout(() => openStepper(), 50);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>
      <div className="space-y-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleAction(action)}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition duration-150 ease-in-out ${
              action.className
            } ${action.className.includes("bg-gray") ? "" : "shadow-md"}`}
          >
            <action.icon className="w-5 h-5" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main User Dashboard ---
const Dashboard = () => {
  const { currentUser } = useUsers();
  const { reports } = useReports();

  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [stepperOpen, setStepperOpen] = useState(false);
  const [defaultReportType, setDefaultReportType] = useState("");

  // Fetch dynamic stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const allReports = await apiService.getReports(currentUser?.id);
        if (allReports) {
          setStats({
            resolved: allReports.filter(
              (r) => r.status?.toLowerCase() === "resolved"
            ).length,
            rejected: allReports.filter(
              (r) => r.status?.toLowerCase() === "rejected"
            ).length,
            pending: allReports.filter(
              (r) => r.status?.toLowerCase() === "pending"
            ).length,
            underInvestigation: allReports.filter((r) =>
              ["under-investigation", "under investigation"].includes(
                r.status?.toLowerCase()
              )
            ).length,
            redFlags: allReports.filter(
              (r) => r.type?.toLowerCase() === "red-flag"
            ).length,
            interventions: allReports.filter(
              (r) => r.type?.toLowerCase() === "intervention"
            ).length,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [currentUser]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const allNotifications = await apiService.getNotifications();
      setNotifications(allNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const statCards = [
    {
      title: "Resolved Reports",
      value: stats.resolved || 0,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Pending Reports",
      value: stats.pending || 0,
      icon: Clock,
      color: "gray",
    },
    {
      title: "Under Investigation",
      value: stats.underInvestigation || 0,
      icon: Search,
      color: "yellow",
    },
    {
      title: "Rejected Reports",
      value: stats.rejected || 0,
      icon: XCircle,
      color: "red",
    },
    {
      title: "Red-Flag Reports",
      value: stats.redFlags || 0,
      icon: Flag,
      color: "red",
    },
    {
      title: "Interventions",
      value: stats.interventions || 0,
      icon: Zap,
      color: "blue",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {currentUser?.firstName}! Here’s what’s happening with
          your reports.
        </p>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentReports reports={reports} />
        </div>
        <div className="space-y-6">
          <QuickActions
            openStepper={() => setStepperOpen(true)}
            // CHANGE 2: Use the dedicated setter
            setType={(type) => setDefaultReportType(type)}
          />
          <RecentNotifications
            notifications={notifications}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Report Stepper Modal */}
      {stepperOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-auto animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mt-20 p-6 relative animate-slideIn">
            <button
              onClick={() => setStepperOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ×
            </button>
            <ReportStepper
              // CHANGE 3: Pass the type using the correct prop name
              defaultType={defaultReportType}
              onClose={() => setStepperOpen(false)}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Dashboard;
