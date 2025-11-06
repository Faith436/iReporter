import React, { useState, useMemo, useEffect } from "react";
import {
  CheckCircle,
  Flag,
  Zap,
  Search,
  XCircle,
  SquarePen,
  X,
  Info,
  Clock,
  FileText,
} from "lucide-react";

import { useReports } from "../contexts/ReportContext";
import { useUsers } from "../contexts/UserContext";
import { useNotifications } from "../contexts/NotificationContext";
import ReportStepper from "../components/ReportStepper"; // Ensure path is correct

// --- StatCard Component ---
const StatCard = ({ title, value, percentage, color, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between border border-gray-100">
    <div>
      <h3 className="text-gray-500 text-base">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      <p className={`text-sm font-medium mt-1 ${color}`}>{percentage}</p>
    </div>
    <div className={`p-3 rounded ${iconBg} flex`} style={{ height: "45px", justifyContent: "center", alignItems: "center" }}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
  </div>
);

// --- StatusTag Component ---
const StatusTag = ({ status }) => {
  let classes = "";
  switch (status.toLowerCase()) {
    case "resolved":
      classes = "bg-green-100 text-green-800";
      break;
    case "under-investigation":
      classes = "bg-yellow-100 text-yellow-800";
      break;
    case "draft":
      classes = "bg-blue-100 text-blue-800";
      break;
    default:
      classes = "bg-gray-100 text-gray-800";
  }
  return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${classes}`}>{status}</span>;
};

// --- RecentReports Component ---
const RecentReports = () => {
  const { reports, loading } = useReports();

  if (loading) return <p>Loading reports...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Reports</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-4">{r.title}</td>
                <td className="px-3 py-4">{r.type}</td>
                <td className="px-3 py-4">
                  <StatusTag status={r.status} />
                </td>
                <td className="px-3 py-4">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-4 flex justify-end gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <SquarePen className="w-5 h-5" />
                  </button>
                  <button className="text-red-400 hover:text-red-600">
                    <X className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- RecentNotifications Component ---
const RecentNotifications = () => {
  const { currentUser } = useUsers();
  const { notifications, loading } = useNotifications();

  if (loading) return <p>Loading notifications...</p>;

  const userNotifications = notifications.filter(n => n.user_id === currentUser?.id);

  const IconMap = {
    Info: { Icon: Info, bg: "bg-blue-50", color: "text-blue-600" },
    Resolved: { Icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
    Reminder: { Icon: Clock, bg: "bg-yellow-50", color: "text-yellow-600" },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Notifications</h2>
      <div className="space-y-4">
        {userNotifications.length === 0 && <p className="text-gray-500 text-sm text-center">No notifications</p>}
        {userNotifications.map((n) => {
          const { Icon, bg, color } = IconMap[n.type] || { Icon: Info, bg: "bg-gray-50", color: "text-gray-600" };
          return (
            <div key={n.id} className={`p-4 rounded-lg ${bg} border border-opacity-50 ${color.replace("text", "border")}`}>
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 mt-1 ${color} flex-shrink-0`} />
                <div>
                  <p className={`text-sm font-semibold ${color}`}>{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- QuickActions Component ---
const QuickActions = ({ openStepper, setType }) => {
  const actions = [
    { label: "Add Red-Flag Record", icon: Flag, className: "bg-teal-500 hover:bg-teal-600 text-white", type: "Red Flag" },
    { label: "Add Intervention", icon: Zap, className: "bg-blue-600 hover:bg-blue-700 text-white", type: "Intervention" },
    { label: "View All Reports", icon: FileText, className: "bg-gray-100 hover:bg-gray-200 text-gray-800", type: "view" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (action.type === "view") return;
              setType(action.type);
              openStepper();
            }}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition duration-150 ease-in-out ${action.className} ${action.className.includes("bg-gray") ? "" : "shadow-md"}`}
          >
            <action.icon className="w-5 h-5" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Dashboard Component ---
const Dashboard = () => {
  const { reports } = useReports();

  const [stepperOpen, setStepperOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const openStepper = () => setStepperOpen(true);
  const closeStepper = () => setStepperOpen(false);
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleSubmit = () => {
    console.log("Submit form data:", formData);
    closeStepper();
  };

  // --- Compute Stats dynamically ---
  const statData = useMemo(() => {
    const resolvedCount = reports.filter(r => r.status.toLowerCase() === "resolved").length;
    const rejectedCount = reports.filter(r => r.status.toLowerCase() === "rejected").length;
    const underInvestigation = reports.filter(r => r.status.toLowerCase() === "under-investigation").length;
    const pendingCount = reports.filter(r => r.status.toLowerCase() === "pending").length;
    const redFlags = reports.filter(r => r.type?.toLowerCase() === "red-flag").length;
    const interventions = reports.filter(r => r.type?.toLowerCase() === "intervention").length;

    return [
      { title: "Resolved", value: resolvedCount, percentage: "", color: "text-green-600", icon: CheckCircle, iconBg: "bg-green-100", iconColor: "text-green-600" },
      { title: "Rejected", value: rejectedCount, percentage: "", color: "text-red-600", icon: XCircle, iconBg: "bg-red-100", iconColor: "text-red-600" },
      { title: "Pending", value: pendingCount, percentage: "", color: "text-gray-600", icon: Clock, iconBg: "bg-gray-100", iconColor: "text-gray-600" },
      { title: "Under Investigation", value: underInvestigation, percentage: "", color: "text-yellow-600", icon: Search, iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
      { title: "Total Red-Flags", value: redFlags, percentage: "", color: "text-blue-600", icon: Flag, iconBg: "bg-red-100", iconColor: "text-red-600" },
      { title: "Interventions", value: interventions, percentage: "", color: "text-green-600", icon: Zap, iconBg: "bg-blue-100", iconColor: "text-green-600" },
    ];
  }, [reports]);

  const topStats = statData.slice(0, 3);
  const bottomStats = statData.slice(3);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen relative">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your reports.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {topStats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {bottomStats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><RecentReports /></div>
        <div className="lg:col-span-1 space-y-6">
          <QuickActions openStepper={openStepper} setType={(type) => setFormData({ ...formData, titleType: type })} />
          <RecentNotifications />
        </div>
      </div>

      {stepperOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-auto animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mt-20 p-6 relative animate-slideIn">
            <button
              onClick={closeStepper}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ×
            </button>

            <ReportStepper
              currentStep={currentStep}
              nextStep={nextStep}
              prevStep={prevStep}
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
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
