import React from "react";

const QuickStats = ({ stats }) => {
  const items = [
    { label: "Total", value: stats.total, color: "#0077b6" },
    { label: "Active", value: stats.active, color: "#ffb020" },
    { label: "Resolved", value: stats.resolved, color: "#28a745" },
  ];

  return (
    <div className="dashboard-stats">
      {items.map((item, i) => (
        <div
          key={i}
          className="stat-card"
          style={{
            borderLeft: `6px solid ${item.color}`,
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0 6px 18px rgba(18,35,63,0.06)",
            padding: "14px 20px",
          }}
        >
          <h3 style={{ margin: 0, color: item.color }}>{item.value}</h3>
          <p style={{ margin: 0, color: "#555" }}>{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
