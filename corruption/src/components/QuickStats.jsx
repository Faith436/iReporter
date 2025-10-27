import React from "react";
import { useReports } from "../contexts/ReportContext";
import { useUsers } from "../contexts/UserContext";

const QuickStats = ({ openModal }) => {
  const { currentUser } = useUsers();
  const { getStats } = useReports();

  // Get dynamic stats - FIXED: Check if functions exist
  const stats = getStats ? (currentUser?.role === "admin" 
    ? getStats() // Admin sees all reports
    : getStats(currentUser?.id) // User sees only their reports
  ) : {
    total: 0, redFlags: 0, interventions: 0, pending: 0, underInvestigation: 0, resolved: 0
  };

  const statCards = [
    { 
      title: "Total Reports", 
      value: stats.total, 
      color: "teal", 
      description: "All submissions",
      icon: "📊"
    },
    { 
      title: "Red Flags", 
      value: stats.redFlags, 
      color: "red", 
      description: "Corruption reports",
      icon: "🚩"
    },
    { 
      title: "Interventions", 
      value: stats.interventions, 
      color: "blue", 
      description: "Infrastructure requests",
      icon: "🛠️"
    },
    { 
      title: "Pending", 
      value: stats.pending, 
      color: "yellow", 
      description: "Awaiting review",
      icon: "⏳"
    },
    { 
      title: "Resolved", 
      value: stats.resolved, 
      color: "green", 
      description: "Completed cases",
      icon: "✅"
    },
  ];

  const colorClasses = {
    teal: { border: "border-t-teal-500", text: "text-teal-600", bg: "bg-teal-50" },
    red: { border: "border-t-red-500", text: "text-red-600", bg: "bg-red-50" },
    blue: { border: "border-t-blue-500", text: "text-blue-600", bg: "bg-blue-50" },
    yellow: { border: "border-t-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50" },
    green: { border: "border-t-green-500", text: "text-green-600", bg: "bg-green-50" },
  };

  const handleCreateReport = () => {
    if (!currentUser) {
      alert("Please log in to create a report.");
      return;
    }
    if (openModal) {
      openModal();
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`flex flex-col p-4 rounded-lg shadow-md border-t-4 ${colorClasses[stat.color].border} ${colorClasses[stat.color].bg} transition-transform hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`text-2xl font-bold ${colorClasses[stat.color].text}`}>
              {stat.value}
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
          <div className="text-gray-800 font-semibold text-sm">{stat.title}</div>
          <div className="text-gray-500 text-xs">{stat.description}</div>
        </div>
      ))}

      {/* Create Report Button */}
      <div 
        onClick={handleCreateReport}
        className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
      >
        <button className="text-blue-600 font-semibold flex items-center gap-2">
          <span className="text-xl">+</span>
          Create Report
        </button>
      </div>
    </div>
  );
};

export default QuickStats;