import React from "react";

const MapPreview = ({ height = 220 }) => {
  return (
    <div
      className="map-preview"
      style={{
        height,
        borderRadius: "10px",
        background: "linear-gradient(180deg, #e6f5fb, #fff)",
        boxShadow: "0 6px 18px rgba(18,35,63,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="map-center" style={{ width: "100%", height: "100%" }}>
        <div style={{ position: "absolute", top: "40%", left: "30%" }}>📍</div>
        <div style={{ position: "absolute", top: "60%", left: "55%" }}>📍</div>
        <div style={{ position: "absolute", top: "30%", left: "70%" }}>📍</div>
        <p
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            fontWeight: "600",
            color: "#003049",
          }}
        >
          🗺️ MAP PREVIEW
        </p>
      </div>
    </div>
  );
};

export default MapPreview;
