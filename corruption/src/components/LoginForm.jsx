// src/components/LoginForm.jsx - FIXED VERSION
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, CheckCircle, XCircle } from "lucide-react";
import apiService from "../services/api"; // ✅ Use your API service
import { useUsers } from "../contexts/UserContext";

const COLOR_PRIMARY_TEAL = "#116E75";

const AuthInput = ({ label, type, value, onChange, placeholder, icon: Icon }) => (
  <div className="mb-5">
    <label className="block text-xs font-semibold uppercase mb-1" style={{ color: COLOR_PRIMARY_TEAL }}>
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 pl-10 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2 border border-teal-200 shadow-sm"
        required
      />
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: COLOR_PRIMARY_TEAL }} />
    </div>
  </div>
);

const StatusMessage = ({ type, message }) => {
  if (!message) return null;
  const Icon = type === "success" ? CheckCircle : XCircle;
  const colorClass = type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  return (
    <div className={`flex items-center p-3 mb-4 rounded-lg text-sm ${colorClass}`}>
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      <p className="font-medium">{message}</p>
    </div>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useUsers();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setLoading(true);

    try {
      // ✅ Use your apiService instead of axios directly
      const data = await apiService.login(email, password);

      // Set current user in context
      setCurrentUser(data.user);

      setStatus({ type: "success", message: "Login successful! Redirecting..." });

      // Clear input
      setEmail("");
      setPassword("");

      // Redirect based on role
      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 1000);

    } catch (err) {
      console.error("Login error:", err);
      setStatus({
        type: "error",
        message: err.message || "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-slate-100 p-8 sm:p-12 lg:p-16 justify-center">
      <h2 className="text-3xl font-extrabold mb-2" style={{ color: COLOR_PRIMARY_TEAL }}>
        Welcome Back!
      </h2>
      <p className="text-gray-600 mb-6">Log in to continue</p>

      <StatusMessage type={status.type} message={status.message} />

      <form onSubmit={handleLogin} className="w-full" noValidate>
        <AuthInput 
          label="Email Address" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="faith@example.com" 
          icon={Mail} 
        />
        <AuthInput 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="••••••••" 
          icon={Lock} 
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 bg-teal-500 hover:bg-teal-400 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"></path>
            </svg>
          ) : (
            <>
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </>
          )}
        </button>
      </form>

      <p className="text-gray-400 text-center mt-4 text-sm">
        Don't have an account?{" "}
        <span onClick={() => navigate("/registration")} className="text-teal-500 hover:underline cursor-pointer">
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginForm;