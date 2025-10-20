import React, { useEffect, useState } from "react";

const NotificationToast = ({ message, type = "info", duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const bgColor =
    type === "success"
      ? "#28a745"
      : type === "error"
      ? "#dc3545"
      : "#17a2b8";

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: bgColor,
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
};

export default NotificationToast;
