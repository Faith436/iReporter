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
  const { reports } = useReports();

  // ensure lat/lng are numbers
  const validReports = reports
    .filter((r) => r.lat && r.lng)
    .map((r) => ({
      ...r,
      lat: Number(r.lat),
      lng: Number(r.lng),
    }));

  const defaultCenter = [0.347596, 32.58252]; // Kampala

  return (
    <div className="relative w-full h-96">
      <MapContainer center={defaultCenter} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {validReports.map((r) => (
          <Marker key={r.id} position={[r.lat, r.lng]} icon={locationIcon}>
            <Popup>
              <strong>{r.title}</strong>
              <br />
              {r.type} — {r.status}
            </Popup>
          </Marker>
        ))}

        <MapBoundsSetter markers={validReports} />
      </MapContainer>
    </div>
  );
};

export default ReportMap;
