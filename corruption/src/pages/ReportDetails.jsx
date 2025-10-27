import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock report data
  const report = {
    id,
    title: "Road Repair Needed",
    description:
      "Several potholes causing traffic hazards and vehicle damage on Main Street between 5th and 7th Avenue.",
    status: "Under Investigation",
    location: "Main Street, NYC",
    date: "2 days ago",
    evidence: ["img1.jpg", "img2.jpg", "vid1.mp4"],
    history: [
      { status: "Pending", note: "System: Auto", date: "Nov 15, 9:14 AM" },
      { status: "Under Investigation", note: "Admin: Assigned to DPW", date: "Today, 10:30 AM" },
    ],
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "under investigation":
        return "bg-teal-100 text-teal-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:ml-72">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
          🛠️ {report.title}
        </h2>

        <div className="flex flex-wrap gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(report.status)}`}>
            {report.status}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
            {report.location}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
            {report.date}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">📝 Description</h3>
          <p className="text-gray-700">{report.description}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">🖼️ Evidence</h3>
          <div className="flex flex-wrap gap-4">
            {report.evidence.map((file, index) => (
              <div key={index} className="border rounded-md overflow-hidden bg-gray-50">
                {file.endsWith(".mp4") ? (
                  <video src={file} className="w-40 h-28 object-cover" controls />
                ) : (
                  <img src={file} alt="evidence" className="w-40 h-28 object-cover" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">📋 Status History</h3>
          <div className="space-y-2">
            {report.history.map((h, i) => (
              <div key={i} className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded-md">
                <p className="text-gray-800 font-semibold">{h.status} - {h.note}</p>
                <p className="text-gray-600 text-sm">{h.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportDetails;
