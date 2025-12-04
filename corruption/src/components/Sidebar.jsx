import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Bell, LogOut, Menu, X } from "lucide-react";
import { useUsers } from "../contexts/UserContext";

const Sidebar = () => {
  const { currentUser, logout } = useUsers();
  const isAdmin = currentUser?.role === "admin";
  const baseLink = isAdmin ? "/admin" : "/dashboard";

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const SidebarContent = (
    <div className="flex flex-col h-full bg-gray-800 text-white w-64 shadow-lg">
      <div className="flex items-center h-20 px-5">
        <h1 className="text-2xl font-bold tracking-wide">iReporter</h1>
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
          onClick={() => setMobileOpen(false)}
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
          onClick={() => setMobileOpen(false)}
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
          onClick={() => setMobileOpen(false)}
        >
          <Bell className="w-5 h-5" />
          Notifications
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          className="flex items-center gap-2 text-sm font-semibold hover:text-red-300 transition"
          onClick={logout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-gray-800 text-white">
        {SidebarContent}
      </aside>

      {/* Mobile hamburger button - always visible */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white shadow-md"
        onClick={toggleMobile}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 z-40
      ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        {SidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={toggleMobile}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
