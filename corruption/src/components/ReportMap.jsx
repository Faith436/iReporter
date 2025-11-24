// src/components/ReportMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useReports } from "../contexts/ReportContext";

// Custom marker icon
const locationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Auto-fit map bounds to markers
const MapBoundsSetter = ({ markers }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!markers || markers.length === 0) return;

    const bounds = markers.map((r) => [r.lat, r.lng]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [markers, map]);

  return null;
};

const ReportMap = () => {
  const { locations } = useReports(); // get reactive locations

  const validLocations = locations.filter((loc) => loc.lat && loc.lng);

  const defaultCenter = [0.347596, 32.58252]; // Kampala

  return (
    <div className="relative w-full h-96 z-0">
      <MapContainer
        center={defaultCenter}
        zoom={10}
        className="w-full h-full relative z-0"
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {validLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={locationIcon}
          >
            <Popup className="z-40">
              <div className="space-y-1">
                <h3 className="font-bold text-red-600">{loc.title}</h3>
                <p>
                  <strong>Type:</strong> {loc.type}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      loc.status === "resolved"
                        ? "text-green-600"
                        : loc.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {loc.status.toUpperCase()}
                  </span>
                </p>
                {loc.userName && (
                  <p>
                    <strong>User:</strong> {loc.userName}
                  </p>
                )}
                {loc.userEmail && (
                  <p>
                    <strong>Email:</strong> {loc.userEmail}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <MapBoundsSetter markers={validLocations} />
      </MapContainer>
    </div>
  );
};

export default ReportMap;
