import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Make sure this contains the styles above

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
        <li onClick={() => navigate("/dashboard")}>
          <i className="fas fa-plus-circle"></i> Home
        </li>
        <li onClick={() => navigate("/create-report")}>
          <i className="fas fa-upload"></i> Create Report
        </li>
        <li onClick={() => navigate("/my-reports")}>
          <i className="fas fa-file-alt"></i> My Reports
        </li>
        <li onClick={() => navigate("/notifications")}>
          <i className="fas fa-bell"></i> Notifications
        </li>
        <li onClick={() => navigate("/map")}>
          <i className="fas fa-map-marked-alt"></i> Map
        </li>
        <li onClick={() => navigate("/settings")}>
          <i className="fas fa-cog"></i> Settings
        </li>
      </ul>

      <div className="sidebar-footer">
        <small>© {new Date().getFullYear()} iReporter</small>
      </div>
    </aside>
  );
};

export default Side;
