import React, { useState, useEffect, Suspense } from "react";
import { CheckCircle, Flag, Zap, XCircle, Clock, Info } from "lucide-react";

import { useReports } from "../contexts/ReportContext";
import { useUsers } from "../contexts/UserContext";
import UserReportsView from "../components/UserReportsView";
import FirstLoginPopup from "../components/FirstLoginPopup";

// Lazy load the report stepper
const ReportStepper = React.lazy(() => import("../components/ReportStepper"));

// StatCard component
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

const Dashboard = () => {
  const { currentUser, markFirstLoginSeen } = useUsers();
  const { reports } = useReports();

  const [stepperOpen, setStepperOpen] = useState(false);
  const [defaultReportType, setDefaultReportType] = useState("");
  const [editingReport, setEditingReport] = useState(null);
  const [showFirstPopup, setShowFirstPopup] = useState(false);

  // Show first-login popup if user hasn't seen it
  useEffect(() => {
    if (currentUser && !currentUser.firstLoginShown) {
      setShowFirstPopup(true);
    }
  }, [currentUser]);

  // Compute stats
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
    <div className="rounded-tl-3xl m-0 bg-gray-50 min-h-screen relative">
      {/* First login popup */}
      {showFirstPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <FirstLoginPopup
            onClose={() => {
              setShowFirstPopup(false);
              markFirstLoginSeen(); // ✅ handled in UserContext
            }}
            onAddReport={() => {
              setDefaultReportType("");
              setStepperOpen(true);
            }}
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {currentUser?.firstName}!
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Resolved Reports"
          value={stats.resolved}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Rejected Reports"
          value={stats.rejected}
          icon={XCircle}
          color="red"
        />
        <StatCard
          title="Pending Reports"
          value={stats.pending}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Under Investigation"
          value={stats.underInvestigation}
          icon={Info}
          color="blue"
        />
        <StatCard
          title="Red Flags"
          value={stats.redFlags}
          icon={Flag}
          color="red"
        />
        <StatCard
          title="Interventions"
          value={stats.interventions}
          icon={Zap}
          color="green"
        />
      </div>

      {/* Reports */}
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
      </div>

      {/* Report stepper modal */}
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
                  markFirstLoginSeen(); // ✅ handled by context
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
