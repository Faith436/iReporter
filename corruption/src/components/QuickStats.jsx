import React from "react";
import { useUsers } from "../contexts/UserContext";

const QuickStats = ({ reports = [], openModal }) => {
  const { currentUser } = useUsers();

  // Filter reports for current user, fallback to all if no user
  const userReports = currentUser
    ? reports.filter((r) => r.userId === currentUser.id)
    : reports;

  const stats = {
    redFlags: userReports.filter(r => r.reportType === "red-flag").length,
    interventions: userReports.filter(r => r.reportType === "intervention").length,
    underInvestigation: userReports.filter(r => r.status === "under-investigation").length,
    resolved: userReports.filter(r => r.status === "resolved").length,
  };

  const statCards = [
    { title: "Red Flags", value: stats.redFlags, color: "red", description: "Corruption reports" },
    { title: "Interventions", value: stats.interventions, color: "blue", description: "Infrastructure requests" },
    { title: "Under Investigation", value: stats.underInvestigation, color: "yellow", description: "Active investigations" },
    { title: "Resolved", value: stats.resolved, color: "green", description: "Completed cases" },
  ];

  const colorClasses = {
    red: { border: "border-t-red-500", text: "text-red-600" },
    blue: { border: "border-t-blue-500", text: "text-blue-600" },
    yellow: { border: "border-t-yellow-500", text: "text-yellow-600" },
    green: { border: "border-t-green-500", text: "text-green-600" },
  };

  // Wrapper to pass current user ID when opening modal
  const handleCreateReport = () => {
    if (!currentUser) {
      alert("Please log in to create a report.");
      return;
    }
    openModal({ userId: currentUser.id });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`flex flex-col items-center justify-center bg-white shadow-md rounded-2xl p-6 transition-transform hover:scale-105 hover:shadow-lg ${colorClasses[stat.color].border}`}
        >
          <div className={`text-4xl font-bold mb-2 ${colorClasses[stat.color].text}`}>
            {stat.value}
          </div>
          <div className="text-gray-800 font-semibold text-lg">{stat.title}</div>
          <div className="text-gray-500 text-sm text-center">{stat.description}</div>
        </div>
      ))}

      {/* Create Report Button */}
      <div className="flex items-center justify-center bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-blue-400 transition">
        <button
          onClick={handleCreateReport}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition"
        >
          + Create Report
        </button>
      </div>
    </div>
  );
};

export default QuickStats;
