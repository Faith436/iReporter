import React, { useState } from "react";
import { Map, List, ChevronDown } from "lucide-react";
import { dummyReports } from "../data/reportsData";

const COLOR_PRIMARY_PURPLE = "#4D2C5E";
const COLOR_PRIMARY_TEAL = "#116E75";

const UserDashboard = () => {
  const [activeView, setActiveView] = useState("list");
  const [reportType, setReportType] = useState("all");
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  const filteredReports = dummyReports.filter(
    (r) => reportType === "all" || r.reportType === reportType
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY_PURPLE }}>
          Incident Reports Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Report corruption incidents and request interventions easily.
        </p>
      </header>

      {/* Filters + View Toggle */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6 flex flex-wrap md:flex-row justify-between items-center gap-4">
        {/* View toggle */}
        <div className="flex gap-2 bg-gray-100 rounded-md p-1">
          <button
            onClick={() => setActiveView("list")}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
              activeView === "list"
                ? "bg-white shadow text-teal-600"
                : "text-gray-600 hover:text-teal-600"
            }`}
          >
            <List className="w-4 h-4" /> List
          </button>
          <button
            onClick={() => setActiveView("map")}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
              activeView === "map"
                ? "bg-white shadow text-teal-600"
                : "text-gray-600 hover:text-teal-600"
            }`}
          >
            <Map className="w-4 h-4" /> Map
          </button>
        </div>

        {/* Report Type Dropdown */}
        <div className="relative w-48">
          <label className="text-sm font-semibold text-gray-600">Report Type</label>
          <button
            onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2 mt-1 border rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none shadow"
            style={{ borderColor: COLOR_PRIMARY_TEAL }}
          >
            {reportType === "all" ? "All Types" : reportType}
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
          {typeDropdownOpen && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {["all", "Red-Flag", "Intervention"].map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    setReportType(type);
                    setTypeDropdownOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-teal-100 capitalize"
                >
                  {type === "all" ? "All Types" : type}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500">No reports found.</div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 ease-in-out"
            >
              <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
              <p className="text-gray-700 text-sm mb-2">{report.description}</p>
              <div className="text-xs text-gray-500">Location: {report.location}</div>
              <div className="text-xs text-gray-500">Date: {report.date}</div>
              <div className="text-xs text-gray-500">Status: {report.status}</div>
              <div className="text-xs text-gray-500">Type: {report.reportType}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
