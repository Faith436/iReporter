// src/pages/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Flag,
  Zap,
  Search,
  Trash2,
  XCircle,
  Clock,
  Info,
  FileText,
} from "lucide-react";
import { useReports } from "../contexts/ReportContext";
import { useUsers } from "../contexts/UserContext";
import { useNotifications } from "../contexts/NotificationContext";
import ReportStepper from "../components/ReportStepper";
import UserReportsView from "../components/UserReportsView";
import FirstLoginPopup from "../components/FirstLoginPopup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
// ─────────────────────────────────────────────
// STAT CARD COMPONENT
// ─────────────────────────────────────────────
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
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
};
// ─────────────────────────────────────────────
// NOTIFICATIONS LIST
// ─────────────────────────────────────────────
const RecentNotifications = ({
  notifications,
  currentUser,
  deleteNotification,
}) => {
  const [removing, setRemoving] = useState(null);
  const userNotifications = notifications.filter(
    (n) => Number(n.user_id) === Number(currentUser?.id)
  );

  const IconMap = {
    Info: { Icon: Info, bg: "bg-blue-50", color: "text-blue-600" },
    Resolved: { Icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
    Reminder: { Icon: Clock, bg: "bg-yellow-50", color: "text-yellow-600" },
  };

  const handleDelete = async (id) => {
    setRemoving(id);
    try {
      await deleteNotification(id);
      toast.success("Notification deleted", { position: "top-center" });
      setRemoving(null);
    } catch {
      toast.error("Failed to delete notification", { position: "top-center" });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Notifications
      </h2>

      {userNotifications.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">
          No notifications yet.
        </p>
      ) : (
        <div className="space-y-4">
          {userNotifications.slice(0, 5).map((n) => {
            const typeKey =
              n.type?.charAt(0).toUpperCase() + n.type?.slice(1).toLowerCase();
            const { Icon, bg, color } = IconMap[typeKey] || {
              Icon: Info,
              bg: "bg-gray-50",
              color: "text-gray-600",
            };

            return (
              <div
                key={n.id}
                className={`p-4 rounded-lg border flex justify-between items-start transition-all duration-200 ${bg} ${color.replace(
                  "text",
                  "border"
                )} ${removing === n.id ? "opacity-0 scale-95" : "opacity-100"}`}
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
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-1 rounded hover:bg-red-100 transition"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// QUICK ACTIONS
// ─────────────────────────────────────────────
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
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>
      <div className="space-y-3">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={() =>
              a.type === "view"
                ? navigate("/dashboard/reports")
                : (setType(a.type), openStepper())
            }
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition ${
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
// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
const Dashboard = () => {
  const { currentUser, setCurrentUser } = useUsers();
  const { reports } = useReports();
  const { notifications, deleteNotification } = useNotifications();
  const [stats, setStats] = useState({});
  const [stepperOpen, setStepperOpen] = useState(false);
  const [defaultReportType, setDefaultReportType] = useState("");
  const [editingReport, setEditingReport] = useState(null);
  // First login popup
  const [showFirstPopup, setShowFirstPopup] = useState(false);
  useEffect(() => {
    if (!currentUser) return;
    const shouldShow = Number(currentUser.firstLoginShown) === 0;
    if (shouldShow) {
      setTimeout(() => setShowFirstPopup(true), 300);
    }
  }, [currentUser, reports]);
  const markFirstLoginShown = async () => {
    try {
      await apiService.put(`/users/${currentUser.id}/first-login-shown`, {
        firstLoginShown: 1,
      });
      setCurrentUser({
        ...currentUser,
        firstLoginShown: 1,
      });
    } catch (err) {
      console.error("Failed to update firstLoginShown:", err);
    }
  };
  // Calculate stats
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
  return (
    <div className="rounded-tl-3xl m-0 bg-gray-50 min-h-screen relative p-4">
      {/* FIRST LOGIN POPUP */}
      {showFirstPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <FirstLoginPopup
            onClose={() => {
              setShowFirstPopup(false);
              markFirstLoginShown();
            }}
            onAddReport={() => {
              setShowFirstPopup(false);
              markFirstLoginShown();
              setDefaultReportType("");
              setStepperOpen(true);
            }}
          />
        </div>
      )}
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {currentUser?.firstName}!
        </p>
      </header>
      {/* STATS GRID */}
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
      {/* REPORTS + NOTIFICATIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Reports */}
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
        {/* Right side: Quick actions + Notifications */}
        <div className="space-y-6">
          <QuickActions
            openStepper={() => setStepperOpen(true)}
            setType={setDefaultReportType}
          />
          <RecentNotifications
            notifications={notifications}
            currentUser={currentUser}
            deleteNotification={deleteNotification}
          />
        </div>
      </div>
      {/* REPORT STEPPER MODAL */}
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
