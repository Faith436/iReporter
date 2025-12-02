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
import ReportStepper from "../components/ReportStepper";
import { useNotifications } from "../contexts/NotificationContext";
import UserReportsView from "../components/UserReportsView";
import FirstLoginPopup from "../components/FirstLoginPopup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

// ───── STAT CARD ─────
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

// ───── QUICK ACTIONS ─────
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

// ───── DASHBOARD ─────
const Dashboard = () => {
  const { currentUser, setCurrentUser } = useUsers();
  const { reports, notifications, createReport, updateReport, deleteReport } =
    useReports();
  const [stats, setStats] = useState({});
  const [stepperOpen, setStepperOpen] = useState(false);
  const [defaultReportType, setDefaultReportType] = useState("");
  const [editingReport, setEditingReport] = useState(null);
  const [showFirstPopup, setShowFirstPopup] = useState(false);

  const navigate = useNavigate();

  // First login popup
  useEffect(() => {
    if (!currentUser) return;
    if (Number(currentUser.firstLoginShown) === 0) {
      setTimeout(() => setShowFirstPopup(true), 300);
    }
  }, [currentUser]);

  const markFirstLoginShown = async () => {
    try {
      await apiService.put(`/users/${currentUser.id}/first-login-shown`, {
        firstLoginShown: 1,
      });
      setCurrentUser({ ...currentUser, firstLoginShown: 1 });
    } catch (err) {
      console.error("Failed to update firstLoginShown:", err);
    }
  };

  // Update stats whenever reports change
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

      {/* REPORTS + QUICK ACTIONS + NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserReportsView
            reports={reports}
            role="user"
            setEditingReport={setEditingReport}
            setShowModal={setStepperOpen}
            onDelete={(id) => deleteReport(id)}
            onEdit={(report) => {
              setEditingReport(report);
              setStepperOpen(true);
            }}
            onUpdate={(id, data) => updateReport(id, data)}
            loading={false}
          />
        </div>

        <div className="space-y-6">
          <QuickActions
            openStepper={() => setStepperOpen(true)}
            setType={setDefaultReportType}
          />

          {/* RECENT NOTIFICATIONS */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Notifications
            </h2>
            {notifications && notifications.length > 0 ? (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {notifications
                  .slice(0, 5) // show latest 5
                  .map((n) => (
                    <li
                      key={n.id}
                      className="p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                    >
                      <p className="text-gray-700 text-sm">{n.message}</p>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No recent notifications</p>
            )}
          </div>
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
              editingReport={editingReport}
              onClose={() => {
                setStepperOpen(false);
                setEditingReport(null);
              }}
              onReportAdded={(savedReport) => toast.success("Report added!")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
