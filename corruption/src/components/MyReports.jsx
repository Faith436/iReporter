// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const MyReports = () => {
//   const navigate = useNavigate();

//   const [reports, setReports] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("myReports")) || [];
//     } catch {
//       return [];
//     }
//   });

//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({
//     reportType: "",
//     title: "",
//     description: "",
//     location: "",
//     coordinates: null,
//     evidence: "",
//   });
//   const [currentStep, setCurrentStep] = useState(1);

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this report?")) {
//       const updatedReports = reports.filter((r) => r.id !== id);
//       setReports(updatedReports);
//       localStorage.setItem("myReports", JSON.stringify(updatedReports));
//     }
//   };

//   const startEdit = (report) => {
//     setEditingId(report.id);
//     setEditData({
//       reportType: report.reportType || "red-flag",
//       title: report.title || "",
//       description: report.description || "",
//       location: report.location || "",
//       coordinates: report.coordinates || null,
//       evidence: report.evidence || "",
//     });
//     setCurrentStep(1);
//   };

//   const saveEdit = (id) => {
//     const updatedReports = reports.map((r) =>
//       r.id === id ? { ...r, ...editData } : r
//     );
//     setReports(updatedReports);
//     localStorage.setItem("myReports", JSON.stringify(updatedReports));
//     setEditingId(null);
//     setCurrentStep(1);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditData({
//       reportType: "",
//       title: "",
//       description: "",
//       location: "",
//       coordinates: null,
//       evidence: "",
//     });
//     setCurrentStep(1);
//   };

//   const updateEditData = (newData) => setEditData((prev) => ({ ...prev, ...newData }));
//   const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 3));
//   const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-600";
//       case "under-investigation":
//         return "bg-teal-100 text-teal-700";
//       case "resolved":
//         return "bg-green-100 text-green-700";
//       default:
//         return "bg-gray-100 text-gray-500";
//     }
//   };

//   const getTypeIcon = (type) => (type === "red-flag" ? "🚩" : "🛠️");

//   const renderEditStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-blue-900">Edit Basic Information</h3>

//             <div className="space-y-2">
//               <label className="block font-medium text-gray-700">Report Type</label>
//               <div className="flex flex-col gap-2">
//                 {["red-flag", "intervention"].map((type) => (
//                   <label
//                     key={type}
//                     className={`flex flex-col p-4 border rounded-lg cursor-pointer transition
//                     ${editData.reportType === type ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
//                   >
//                     <input
//                       type="radio"
//                       name="reportType"
//                       value={type}
//                       checked={editData.reportType === type}
//                       onChange={(e) => updateEditData({ reportType: e.target.value })}
//                       className="mb-1"
//                     />
//                     <span className="font-semibold text-gray-800">{type === "red-flag" ? "Red Flag" : "Intervention"}</span>
//                     <span className="text-gray-500 text-sm">
//                       {type === "red-flag"
//                         ? "Report corruption incidents, bribery, or misuse of public funds"
//                         : "Request government intervention for infrastructure issues"}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="block font-medium text-gray-700">Title</label>
//               <input
//                 type="text"
//                 value={editData.title}
//                 onChange={(e) => updateEditData({ title: e.target.value })}
//                 placeholder="Brief title describing the incident"
//                 className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block font-medium text-gray-700">Description</label>
//               <textarea
//                 value={editData.description}
//                 onChange={(e) => updateEditData({ description: e.target.value })}
//                 placeholder="Provide detailed description of the incident..."
//                 rows="6"
//                 className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-blue-900">Edit Location Details</h3>
//             <div className="space-y-2">
//               <label className="block font-medium text-gray-700">Location</label>
//               <input
//                 type="text"
//                 value={editData.location}
//                 onChange={(e) => updateEditData({ location: e.target.value })}
//                 placeholder="Enter the location"
//                 className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block font-medium text-gray-700">Location Coordinates</label>
//               <button
//                 type="button"
//                 onClick={() => updateEditData({ coordinates: { lat: "6.5244", lng: "3.3792" } })}
//                 className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
//               >
//                 📍 Use Current Location
//               </button>
//               {editData.coordinates && (
//                 <div className="px-3 py-2 bg-blue-50 rounded-md border-l-4 border-blue-400 text-gray-700">
//                   <strong>Current coordinates:</strong> {editData.coordinates.lat}, {editData.coordinates.lng}
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="space-y-4">
//             <h3 className="text-xl font-semibold text-blue-900">Edit Evidence & Additional Information</h3>
//             <div className="space-y-2">
//               <label className="block font-medium text-gray-700">Additional Evidence Details</label>
//               <textarea
//                 value={editData.evidence}
//                 onChange={(e) => updateEditData({ evidence: e.target.value })}
//                 placeholder="Provide any additional evidence details..."
//                 rows="4"
//                 className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:ml-72">
//       <div className="max-w-6xl mx-auto">
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-blue-900">My Reports</h1>
//             <p className="text-gray-500">Manage and track your submitted reports</p>
//           </div>
//           <button
//             onClick={() => navigate("/create-report")}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//           >
//             + Create New Report
//           </button>
//         </header>

//         {reports.length === 0 ? (
//           <div className="text-center bg-white p-8 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">No reports submitted yet</h3>
//             <p className="text-gray-500 mb-4">Create your first report to see it here</p>
//             <button
//               onClick={() => navigate("/create-report")}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//             >
//               Create First Report
//             </button>
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
//             {reports.map((report) => (
//               <div
//                 key={report.id}
//                 className={`bg-white rounded-lg shadow-md border-l-4 ${getStatusColor(
//                   report.status
//                 )} p-4`}
//               >
//                 {editingId === report.id ? (
//                   <div className="space-y-4 border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
//                     {/* Progress Steps */}
//                     <div className="flex justify-between mb-4 bg-white p-4 border rounded-lg">
//                       {[1, 2, 3].map((step) => (
//                         <div
//                           key={step}
//                           className={`flex flex-col items-center gap-1 text-sm font-medium ${
//                             currentStep >= step ? "text-blue-600 font-semibold" : "text-gray-400"
//                           }`}
//                         >
//                           <span
//                             className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                               currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-200"
//                             }`}
//                           >
//                             {step}
//                           </span>
//                           {step === 1
//                             ? "Basic Info"
//                             : step === 2
//                             ? "Location"
//                             : "Evidence"}
//                         </div>
//                       ))}
//                     </div>

//                     {renderEditStep()}

//                     <div className="flex flex-wrap justify-between mt-4 border-t pt-4 gap-2">
//                       <button
//                         onClick={prevStep}
//                         disabled={currentStep === 1}
//                         className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
//                       >
//                         Previous
//                       </button>
//                       {currentStep < 3 ? (
//                         <button
//                           onClick={nextStep}
//                           className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//                         >
//                           Next
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => saveEdit(report.id)}
//                           className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//                         >
//                           Save Changes
//                         </button>
//                       )}
//                       <button
//                         onClick={cancelEdit}
//                         className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
//                       <h3 className="text-blue-900 font-semibold text-lg">
//                         {getTypeIcon(report.reportType)} {report.title}
//                       </h3>
//                       <div className="flex gap-2">
//                         <span
//                           className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
//                             report.status
//                           )}`}
//                         >
//                           {report.status?.replace("-", " ") || "Pending"}
//                         </span>
//                         <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">
//                           {report.reportType === "red-flag" ? "Red Flag" : "Intervention"}
//                         </span>
//                       </div>
//                     </div>

//                     <p className="text-gray-600">{report.description}</p>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-50 p-3 rounded-md">
//                       <div>
//                         <strong className="text-gray-800">📍 Location:</strong> {report.location || "Not specified"}
//                       </div>
//                       {report.coordinates && (
//                         <div>
//                           <strong className="text-gray-800">🌐 Coordinates:</strong>{" "}
//                           {report.coordinates.lat}, {report.coordinates.lng}
//                         </div>
//                       )}
//                       <div>
//                         <strong className="text-gray-800">📅 Date:</strong> {report.date || "Unknown"}
//                       </div>
//                       {report.evidence && (
//                         <div>
//                           <strong className="text-gray-800">📝 Additional Info:</strong> {report.evidence}
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex flex-wrap justify-end gap-2 mt-2">
//                       <button
//                         onClick={() => startEdit(report)}
//                         className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//                       >
//                         Edit Report
//                       </button>
//                       <button
//                         onClick={() => handleDelete(report.id)}
//                         className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyReports;
