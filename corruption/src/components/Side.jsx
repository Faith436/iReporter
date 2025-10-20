import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Side = ({ user = { name: "John Don", email: "johndon@company.com" } }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="avatar">
          <img
            src="https://via.placeholder.com/80/ffffff/0077b6?text=JD"
            alt="avatar"
          />
        </div>
        <h3 className="sidebar-name">{user.name}</h3>
        <p className="sidebar-email">{user.email}</p>
      </div>

      <ul className="sidebar-nav">
        <li onClick={() => navigate("/dashboard")}>🏠 Dashboard</li>
        <li onClick={() => navigate("/create-report")}>📝 Create Report</li>
        <li onClick={() => navigate("/reports")}>📋 My Reports</li>
        <li onClick={() => navigate("/notifications")}>🔔 Notifications</li>
        <li onClick={() => navigate("/map")}>📍 Map</li>
        <li onClick={() => navigate("/settings")}>⚙️ Settings</li>
      </ul>

      <div className="sidebar-footer">
        <small>© {new Date().getFullYear()} iReporter</small>
      </div>
    </aside>
  );
};

export default Side;
