// src/pages/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, User, Lock, CheckCircle, XCircle } from "lucide-react";
import apiService from "../services/api";

import LoginForm from "../components/LoginForm";
import LoginBackground from "../components/LoginBackground";

// --- COLORS ---
const COLOR_PRIMARY_PURPLE = "#4D2C5E";
const COLOR_PRIMARY_TEAL = "#116E75";
const COLOR_LIGHT_TEAL = "#B3D8DB";

const Login = () => {
  return (
    <div className="min-h-screen font-sans antialiased text-gray-800">
      <div className="grid md:grid-cols-[1fr_1fr] min-h-screen">
        <LoginForm />
        <LoginBackground />
      </div>
    </div>
  );
};

export default Login;
