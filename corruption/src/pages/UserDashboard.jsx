// src/pages/UserDashboard.jsx
import React, { useState, useEffect, Suspense } from "react";
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
import UserReportsView from "../components/UserReportsView";
import FirstLoginPopup from "../components/FirstLoginPopup";
import toast from "react-hot-toast";
import apiService from "../services/api";

// Lazy load ReportStepper to improve initial load
const ReportStepper = React.lazy(() => import("../components/ReportStepper"));

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
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
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
  const { notifications } = useNotifications();

  const [stepperOpen, setStepperOpen] = useState(false);
  const [defaultReportType, setDefaultReportType] = useState("");
  const [editingReport, setEditingReport] = useState(null);
  const [showFirstPopup, setShowFirstPopup] = useState(false);

  // ⭐ Show first-login popup immediately if needed
  useEffect(() => {
    if (!currentUser) return;
    const shouldShow = Number(currentUser.firstLoginShown) === 0;
    if (shouldShow) setShowFirstPopup(true);
  }, [currentUser]);

  // ⭐ Mark first login as shown in DB
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

  // ⭐ Compute stats directly to avoid extra render/loading
  const stats = {
    resolved: reports.filter((r) => r.status === "resolved").length,
    rejected: reports.filter((r) => r.status === "rejected").length,
    pending: reports.filter((r) => r.status === "pending").length,
    underInvestigation: reports.filter((r) =>
      ["under-investigation", "under investigation"].includes(r.status?.toLowerCase())
    ).length,
    redFlags: reports.filter((r) => r.type === "red-flag").length,
    interventions: reports.filter((r) => r.type === "intervention").length,
  };

  return (
    <div className="rounded-tl-3xl m-0 bg-gray-50 min-h-screen relative">
      {/* ⭐ FIRST LOGIN POPUP */}
      {showFirstPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <FirstLoginPopup
            onClose={() => {
              setShowFirstPopup(false);
              markFirstLoginShown();
            }}
            onAddReport={() => {
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
        <StatCard title="Resolved Reports" value={stats.resolved} icon={CheckCircle} color="green" />
        <StatCard title="Rejected Reports" value={stats.rejected} icon={XCircle} color="red" />
        <StatCard title="Pending Reports" value={stats.pending} icon={Clock} color="yellow" />
        <StatCard title="Under Investigation" value={stats.underInvestigation} icon={Info} color="blue" />
        <StatCard title="Red Flags" value={stats.redFlags} icon={Flag} color="red" />
        <StatCard title="Interventions" value={stats.interventions} icon={Zap} color="green" />
      </div>

      {/* REPORTS + NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserReportsView
            reports={reports}
            role="user"
            setEditingReport={setEditingReport}
            setShowModal={setStepperOpen}
            onDelete={(id) => console.log("Delete", id)}
            loading={false} // no unnecessary loading
          />
        </div>
        <div className="space-y-6">
          {/* QuickActions & Notifications could go here */}
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

            <Suspense fallback={null}>
              <ReportStepper
                defaultType={defaultReportType}
                reportToEdit={editingReport}
                setEditingReport={setEditingReport}
                onClose={() => setStepperOpen(false)}
                onReportAdded={() => {
                  setStepperOpen(false);
                  setShowFirstPopup(false);
                  markFirstLoginShown();
                }}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
