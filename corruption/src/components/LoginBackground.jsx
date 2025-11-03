// src/components/LoginBackground.jsx
import React from "react";

const LoginBackground = React.memo(() => (
  <div
    className="relative hidden md:block overflow-hidden p-10 lg:p-16"
    style={{
      background: "linear-gradient(135deg, #10B981, #065F46)",
      boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
    }}
  >
    <div
      className="absolute inset-0 bg-cover bg-center opacity-80"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/stylish-black-girl_1157-15553.jpg?w=740&q=80')",
        mixBlendMode: "multiply",
      }}
    ></div>
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#A7F3D0", stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: "#065F46", stopOpacity: 0.5 }} />
        </linearGradient>
      </defs>
      <path d="M 10 0 L 90 20 L 80 80 L 20 100 Z" fill="url(#leafGradient)" opacity="0.4" />
      <circle cx="95" cy="5" r="15" fill="#34D399" opacity="0.3" />
      <path d="M 0 50 C 30 20, 70 20, 100 50 L 100 100 L 0 100 Z" fill="#059669" opacity="0.3" />
    </svg>
    <div className="relative z-10 flex flex-col justify-end items-end h-full p-4">
      <h3 className="text-white text-3xl font-serif italic drop-shadow-lg">
        "Connecting you to nature's knowledge."
      </h3>
    </div>
  </div>
));

export default LoginBackground;
