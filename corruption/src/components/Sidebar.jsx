import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Bell, LogOut } from "lucide-react";
import { useUsers } from "../contexts/UserContext"; // 👈 Import our context

const Sidebar = () => {
  const { currentUser, logout } = useUsers(); // 👈 use the context
  const isAdmin = currentUser?.role === "admin";
  const baseLink = isAdmin ? "/admin" : "/dashboard";

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#116E75] text-white flex flex-col shadow-lg">
      <div className="flex items-center h-20 border-b border-white/20">
        <h1 className="text-2xl mx-5 font-bold tracking-wide">iReporter</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-5">
        <NavLink
          to={baseLink}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition ${
              isActive
                ? "bg-white/20 text-white font-semibold"
                : "text-white/80 hover:bg-white/10"
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          {isAdmin ? "Admin Dashboard" : "Dashboard"}
        </NavLink>

        <NavLink
          to={`${baseLink}/reports`}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition ${
              isActive
                ? "bg-white/20 text-white font-semibold"
                : "text-white/80 hover:bg-white/10"
            }`
          }
        >
          <FileText className="w-5 h-5" />
          My Reports
        </NavLink>

        <NavLink
          to={`${baseLink}/notifications`}
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition ${
              isActive
                ? "bg-white/20 text-white font-semibold"
                : "text-white/80 hover:bg-white/10"
            }`
          }
        >
          <Bell className="w-5 h-5" />
          Notifications
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          className="flex items-center gap-2 text-sm font-semibold hover:text-red-300 transition"
          onClick={logout} // 👈 Calls logout from context
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
