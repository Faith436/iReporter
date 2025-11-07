// src/pages/Login.jsx
import React from "react";
import RegistrationForm from "../components/RegistrationForm";
import LoginBackground from "../components/LoginBackground";

const Registration = () => {
  return (
    <div className="min-h-screen font-sans antialiased text-gray-800">
      <div className="grid md:grid-cols-[1fr_1fr] min-h-screen">
        <LoginBackground />
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Registration;
