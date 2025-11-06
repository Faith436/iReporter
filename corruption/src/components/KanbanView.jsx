// import React from "react";
// import { Trash2, Pencil } from "lucide-react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";

// const markerIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const KanbanView = ({ reports, statuses, role, userEmail, onEdit, onDelete }) => {
//   const visibleReports = role === "admin" ? reports : reports.filter(r => r.createdBy === userEmail);
//   const groupedReports = statuses.map(status => ({
//     status,
//     items: visibleReports.filter(r => r.status === status),
//   }));

//   return (
//     <div className="grid md:grid-cols-4 gap-6">
//       {groupedReports.map(({ status, items }) => (
//         <div key={status} className="bg-gray-100 p-4 rounded-lg shadow-sm">
//           <h2 className="font-semibold capitalize mb-3 text-gray-700">{status}</h2>
//           <div className="space-y-3">
//             {items.map(report => {
//               const lat = parseFloat(report.lat) || 0;
//               const lng = parseFloat(report.lng) || 0;

//               return (
//                 <div
//                   key={report.id}
//                   className="bg-white rounded-lg shadow p-3 border border-gray-200 hover:shadow-md transition relative"
//                 >
//                   <h3 className="font-semibold text-sm">{report.title}</h3>
//                   <p className="text-xs text-gray-600 mb-2">{report.description}</p>

//                   {report.lat && report.lng && (
//                     <div className="h-32 mb-2">
//                       <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="w-full h-full rounded">
//                         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                         <Marker position={[lat, lng]} icon={markerIcon}>
//                           <Popup>{report.location}</Popup>
//                         </Marker>
//                       </MapContainer>
//                     </div>
//                   )}

//                   <div className="mt-2 flex justify-between items-center">
//                     {role === "admin" ? (
//                       <button
//                         onClick={() => onDelete(report.id)}
//                         className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     ) : report.status === "pending" ? (
//                       <button
//                         onClick={() => onEdit(report)}
//                         className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//                       >
//                         <Pencil className="w-4 h-4" />
//                       </button>
//                     ) : null}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default KanbanView;

import React, { useEffect, useState } from "react";
import { Trash2, SquarePen } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useReports } from "../contexts/ReportContext";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// --- Status Tag (same colors as ListView) ---
const StatusTag = ({ status }) => {
  let classes = "";
  let displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  switch (status.toLowerCase()) {
    case "resolved":
      classes = "bg-green-100 text-green-800";
      break;
    case "under-investigation":
      classes = "bg-yellow-100 text-yellow-800";
      displayStatus = "Under Investigation";
      break;
    case "rejected":
      classes = "bg-red-100 text-red-800";
      break;
    case "pending":
    default:
      classes = "bg-blue-100 text-blue-800";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${classes}`}>
      {displayStatus}
    </span>
  );
};

const KanbanView = ({ role, loggedInUserId, onEdit, onDelete, refreshKey }) => {
  const { reports, loading: contextLoading, fetchUserReports } = useReports();
  const [internalLoading, setInternalLoading] = useState(false);

  // DB statuses
  const statuses = ["pending", "under-investigation", "resolved", "rejected"];

  // Fetch reports
  useEffect(() => {
    const loadReports = async () => {
      if (!loggedInUserId) return;
      setInternalLoading(true);
      await fetchUserReports(loggedInUserId, role);
      setInternalLoading(false);
    };
    loadReports();
  }, [loggedInUserId, role, fetchUserReports, refreshKey]);

  // Filter reports based on role
  const visibleReports = role === "admin"
    ? reports
    : reports.filter(r => r.createdBy === loggedInUserId);

  // Group by status
  const groupedReports = statuses.map(status => ({
    status,
    items: visibleReports.filter(r => r.status.toLowerCase() === status),
  }));

  if (internalLoading || contextLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {groupedReports.map(({ status, items }) => (
        <div key={status} className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold capitalize mb-3 text-gray-700">
            {status.replace("-", " ")}
          </h2>
          <div className="space-y-3">
            {items.length ? items.map(report => {
              const lat = parseFloat(report.lat) || 0;
              const lng = parseFloat(report.lng) || 0;

              return (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow p-3 border border-gray-200 hover:shadow-md transition relative"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-sm">{report.title}</h3>
                    <StatusTag status={report.status} />
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{report.description}</p>

                  {report.lat && report.lng && (
                    <div className="h-32 mb-2">
                      <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="w-full h-full rounded">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[lat, lng]} icon={markerIcon}>
                          <Popup>{report.location}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  )}

                  <div className="mt-2 flex justify-between items-center">
                    {(role === "admin" || report.status.toLowerCase() === "pending") && (
                      <button
                        onClick={() => onEdit(report)}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        <SquarePen className="w-4 h-4" />
                      </button>
                    )}
                    {role === "admin" && (
                      <button
                        onClick={() => onDelete(report.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            }) : (
              <p className="text-gray-500 text-xs">No reports in this status.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;
