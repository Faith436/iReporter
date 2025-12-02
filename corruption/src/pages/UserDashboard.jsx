import React, { useState, useEffect, Suspense } from "react";
import {
  CheckCircle,
  Flag,
  Zap,
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

const ReportStepper = React.lazy(() => import("../components/ReportStepper"));

// ---- StatCard ---- //
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-600",
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

// ---- StatusTag ---- //
const StatusTag = ({ status }) => {
  const colors = {
    resolved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-gray-100 text-gray-700",
    "under-investigation": "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        colors[status?.toLowerCase()] || "bg-blue-100 text-blue-700"
      }`}
    >
      {status}
    </span>
  );
};

// ---- Recent Reports Table ---- //
const RecentReports = () => {
  const { reports } = useReports();
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {reports?.slice(0, 5).map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{r.title}</td>
              <td className="p-3">{r.type}</td>
              <td className="p-3">
                <StatusTag status={r.status} />
              </td>
              <td className="p-3">
                {new Date(r.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---- Notifications Panel ---- //
const RecentNotifications = () => {
  const { notifications } = useNotifications();
  const { currentUser } = useUsers();

  const userNotifs = notifications.filter(
    (n) => n.user_id === currentUser?.id
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      {userNotifs.length === 0 ? (
        <p className="text-gray-400 text-sm text-center">No notifications</p>
      ) : (
        <div className="space-y-3">
          {userNotifs.slice(0, 5).map((n) => (
            <div key={n.id} className="p-3 rounded-lg bg-gray-50 border">
              <p className="font-medium">{n.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Quick Actions ---- //
const QuickActions = ({ openStepper, setType }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

      <div className="space-y-3">
        <button
          onClick={() => {
            setType("Red Flag");
            openStepper();
          }}
          className="bg-red-600 w-full text-white py-3 rounded-lg shadow-md"
        >
          <Flag className="inline-block w-5 h-5 mr-2" />
          Add Red-Flag Report
        </button>

        <button
          onClick={() => {
            setType("Intervention");
            openStepper();
          }}
          className="bg-blue-600 w-full text-white py-3 rounded-lg shadow-md"
        >
          <Zap className="inline-block w-5 h-5 mr-2" />
          Add Intervention
        </button>

        <button className="bg-gray-100 w-full text-gray-800 py-3 rounded-lg">
          <FileText className="inline-block w-5 h-5 mr-2" />
          View All Reports
        </button>
      </div>
    </div>
  );
};

// ---- MAIN DASHBOARD ---- //
const Dashboard = () => {
  const { currentUser, markFirstLoginSeen } = useUsers();
  const { reports } = useReports();
  const [stepperOpen, setStepperOpen] = useState(false);
  const [defaultReportType, setDefaultReportType] = useState("");

  const stats = {
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
  };

  return (
    <div className="rounded-tl-3xl m-0 bg-gray-50 min-h-screen p-6 relative">
      
      {/* ---- HEADER ---- */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500">
          Welcome back, {currentUser?.firstName}!
        </p>
      </header>

      {/* ---- STAT CARDS ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="green" />
        <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="red" />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="yellow" />
        <StatCard title="Under Investigation" value={stats.underInvestigation} icon={Info} color="blue" />
        <StatCard title="Red Flags" value={stats.redFlags} icon={Flag} color="red" />
        <StatCard title="Interventions" value={stats.interventions} icon={Zap} color="green" />
      </div>

      {/* ---- MAIN GRID ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left — Reports */}
        <div className="lg:col-span-2 space-y-6">
          <RecentReports />
        </div>

        {/* Right — Quick Actions + Notifications */}
        <div className="space-y-6">
          <QuickActions
            openStepper={() => setStepperOpen(true)}
            setType={setDefaultReportType}
          />
          <RecentNotifications />
        </div>
      </div>

      {/* ---- Report Stepper ---- */}
      {stepperOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-auto animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mt-20 p-6 relative animate-slideIn">
            <button
              onClick={() => setStepperOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
            >
              ×
            </button>

            <Suspense fallback={<p>Loading...</p>}>
              <ReportStepper
                defaultType={defaultReportType}
                onClose={() => setStepperOpen(false)}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideIn { from { transform:translateY(-20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        .animate-fadeIn { animation: fadeIn .25s ease-out; }
        .animate-slideIn { animation: slideIn .25s ease-out; }
      `}</style>

    </div>
  );
};

export default Dashboard;
