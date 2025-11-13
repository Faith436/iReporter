// src/components/LoginBackground.jsx
import React from "react";

const LoginBackground = React.memo(() => (
  <div
    className="relative hidden md:block overflow-hidden p-10 lg:p-16"
    style={{
      
      
    }}
  >
    <div
      className="absolute inset-0 bg-cover bg-center opacity-100"
      style={{
        backgroundImage:
          "url('https://www.rappler.com/tachyon/2025/09/CORRUPTION.jpg')",
        
      }}
    ></div>

    <div className="relative z-10 flex flex-col justify-end items-end h-full p-4">
      <h3 className="text-black text-3xl font-serif italic drop-shadow-lg">
        "Connecting you to nature's knowledge."
      </h3>
    </div>
  </div>
));

export default LoginBackground;
