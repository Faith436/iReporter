import React from "react";
import { Trash2, Pencil } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const KanbanView = ({ reports, statuses, role, userEmail, onEdit, onDelete }) => {
  const visibleReports = role === "admin" ? reports : reports.filter(r => r.createdBy === userEmail);
  const groupedReports = statuses.map(status => ({
    status,
    items: visibleReports.filter(r => r.status === status),
  }));

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {groupedReports.map(({ status, items }) => (
        <div key={status} className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold capitalize mb-3 text-gray-700">{status}</h2>
          <div className="space-y-3">
            {items.map(report => {
              const lat = parseFloat(report.lat) || 0;
              const lng = parseFloat(report.lng) || 0;

              return (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow p-3 border border-gray-200 hover:shadow-md transition relative"
                >
                  <h3 className="font-semibold text-sm">{report.title}</h3>
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
                    {role === "admin" ? (
                      <button
                        onClick={() => onDelete(report.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : report.status === "pending" ? (
                      <button
                        onClick={() => onEdit(report)}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanView;
