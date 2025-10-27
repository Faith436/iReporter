// import React from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// // import "../styles/MapPreview.css"; // optional for custom styling

// // Custom icons for different report types
// const redFlagIcon = new L.Icon({
//   iconUrl: "https://img.icons8.com/color/48/000000/marker.png", // replace with red icon
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const interventionIcon = new L.Icon({
//   iconUrl: "https://img.icons8.com/color/48/000000/wrench.png", // replace with intervention icon
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const resolvedIcon = new L.Icon({
//   iconUrl: "https://img.icons8.com/color/48/000000/checkmark.png", // replace with resolved icon
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// const MapPreview = ({ reports = [] }) => {
//   return (
//     <div className="map-preview">
//       <h2>🗺️ CivicWatch Map</h2>
//       <MapContainer
//         center={[0.3476, 32.5825]} // example coordinates (Kampala)
//         zoom={13}
//         style={{ height: "300px", width: "100%", borderRadius: "10px" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap contributors"
//         />

//         {reports.map((r) => (
//           <Marker
//             key={r.id}
//             position={[r.location.lat, r.location.lng]}
//             icon={
//               r.type === "red" ? redFlagIcon : r.type === "intervention" ? interventionIcon : resolvedIcon
//             }
//           >
//             <Popup>
//               <strong>{r.title}</strong>
//               <p>{r.description}</p>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>

//       <div className="map-legend">
//         <p>🔴 Red Flags ({reports.filter((r) => r.type === "red").length})</p>
//         <p>🛠️ Interventions ({reports.filter((r) => r.type === "intervention").length})</p>
//         <p>🟢 Resolved ({reports.filter((r) => r.type === "resolved").length})</p>
//       </div>

//       <div className="map-buttons">
//         <button>Filter</button>
//         <button>My Reports</button>
//         <button>Refresh</button>
//       </div>

//       <p style={{ marginTop: "10px", color: "#555" }}>Tap markers for details →</p>
//     </div>
//   );
// };

// export default MapPreview;
