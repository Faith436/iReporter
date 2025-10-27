import React, { useEffect, useState } from "react";

const NotificationToast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), duration);
    // Call onClose after disappearing
    const closeTimer = setTimeout(() => onClose && onClose(), duration + 300);
    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  const icon =
    type === "success" ? "✔️" : type === "error" ? "❌" : "ℹ️";

  return (
    <div
      className={`fixed top-6 right-6 flex items-center gap-3 text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      } ${bgColor}`}
      style={{ zIndex: 1000 }}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default NotificationToast;
