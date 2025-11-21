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
import UserReportsView from "../components/UserReportsView";

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

const QuickActions = ({ openStepper, setType }) => {
  const navigate = useNavigate();
  const actions = [
    {
      label: "Add Red-Flag Record",
      icon: Flag,
      className: "bg-red-500 hover:bg-red-700 text-white",
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
    if (action.type === "view") navigate("/dashboard/reports");
    else {
      setType(action.type);
      setTimeout(() => openStepper(), 50);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>
      <div className="space-y-3">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={() => handleAction(a)}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition duration-150 ease-in-out ${
              a.className
            } ${a.className.includes("bg-gray") ? "" : "shadow-md"}`}
          >
            <a.icon className="w-5 h-5" />
            <span>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { currentUser } = useUsers();
  const { reports } = useReports();
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [stepperOpen, setStepperOpen] = useState(false);
  const [defaultReportType, setDefaultReportType] = useState("");
  const [editingReport, setEditingReport] = useState(null);

  // Show overlay if user has no reports
  const [showNoReportsOverlay, setShowNoReportsOverlay] = useState(false);
  useEffect(() => {
    if (currentUser && reports) {
      setShowNoReportsOverlay(reports.length === 0);
    }
  }, [currentUser, reports]);

  // Stats Fetch
  useEffect(() => {
    if (!reports) return;

    setStats({
      resolved: reports.filter((r) => r.status === "resolved").length,
      rejected: reports.filter((r) => r.status === "rejected").length,
      pending: reports.filter((r) => r.status === "pending").length,
      underInvestigation: reports.filter((r) =>
        ["under-investigation", "under investigation"].includes(
          r.status?.toLowerCase()
        )
      ).length,
      redFlags: reports.filter((r) => r.type === "red-flag").length,
      interventions: reports.filter((r) => r.type === "intervention").length,
    });
  }, [reports]);

  const fetchNotifications = useCallback(async () => {
    try {
      const allNotifications = await apiService.getNotifications();
      setNotifications(allNotifications);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="rounded-tl-3xl m-0 bg-gray-50 min-h-screen relative">
      {/* Overlay if no reports */}
      {showNoReportsOverlay && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No Reports Yet 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              You currently have no reports. Start by creating your first
              Red-Flag or Intervention report.
            </p>
            <button
              onClick={() => {
                setStepperOpen(true);
                setShowNoReportsOverlay(false);
                setDefaultReportType("Red Flag");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md w-full"
            >
              Add Your First Report
            </button>
          </div>
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {currentUser?.firstName}!
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Resolved Reports",
            value: stats.resolved,
            icon: CheckCircle,
            color: "green",
          },
          {
            title: "Pending Reports",
            value: stats.pending,
            icon: Clock,
            color: "gray",
          },
          {
            title: "Under Investigation",
            value: stats.underInvestigation,
            icon: Search,
            color: "yellow",
          },
          {
            title: "Rejected Reports",
            value: stats.rejected,
            icon: XCircle,
            color: "red",
          },
          {
            title: "Red-Flag Reports",
            value: stats.redFlags,
            icon: Flag,
            color: "red",
          },
          {
            title: "Interventions",
            value: stats.interventions,
            icon: Zap,
            color: "blue",
          },
        ].map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserReportsView
            reports={reports}
            role="user"
            setEditingReport={setEditingReport}
            setShowModal={setStepperOpen}
            onDelete={(id) => console.log("Delete", id)}
            loading={false}
          />
        </div>

        <div className="space-y-6">
          <QuickActions
            openStepper={() => setStepperOpen(true)}
            setType={setDefaultReportType}
          />
          <RecentNotifications
            notifications={notifications}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Stepper */}
      {stepperOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mt-20 p-6 relative">
            <button
              onClick={() => setStepperOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
            <ReportStepper
              defaultType={defaultReportType}
              onClose={() => setStepperOpen(false)}
              editingReport={editingReport}
              setEditingReport={setEditingReport}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
