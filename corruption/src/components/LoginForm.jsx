// src/components/LoginForm.jsx - FIXED VERSION
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, CheckCircle, XCircle } from "lucide-react";
import apiService from "../services/api"; // ✅ Use your API service
import { useUsers } from "../contexts/UserContext";

const AuthInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold uppercase mb-1 text-red-600">
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 pl-10 pr-10 from-red-50 to-white rounded-lg border border-red-200 shadow-sm focus:outline-none focus:ring-2 placeholder:text-xs"
          required
        />

        {/* Left Icon */}
        <Icon className="absolute text-red-500 left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />

        {/* Eye Button for Password */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        )}
      </div>
    </div>
  );
};

const StatusMessage = ({ type, message }) => {
  if (!message) return null;
  const Icon = type === "success" ? CheckCircle : XCircle;
  const colorClass =
    type === "success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  return (
    <div
      className={`flex items-center p-3 mb-4 rounded-lg text-sm ${colorClass}`}
    >
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate inputs
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus({ type: null, message: "" });
    setLoading(true);

    try {
      // 1️⃣ Log in and get token & user
      const data = await apiService.login(email, password);

      // 2️⃣ Store token
      localStorage.setItem("token", data.token);

      // 3️⃣ Fetch full current user from API (to avoid null)
      const fullUser = await apiService.getCurrentUser();

      // 4️⃣ Set in context
      setCurrentUser(fullUser.user);

      setStatus({
        type: "success",
        message: "Login successful! Redirecting...",
      });

      setEmail("");
      setPassword("");

      // 5️⃣ Redirect based on role
      setTimeout(() => {
        if (fullUser.user.role === "admin") navigate("/admin");
        else navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-slate-100 p-8 sm:p-12 lg:p-16 justify-center">
      <h2 className="text-3xl text-red-600 font-extrabold mb-2">
        Welcome Back!
      </h2>
      <p className="text-red-600 mb-6">Log in to continue</p>

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
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={Lock}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 bg-red-500 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
              ></path>
            </svg>
          ) : (
            <>
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </>
          )}
        </button>
      </form>

      <p className="text-black-400 text-center mt-4 text-sm">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/registration")}
          className="text-red-500 hover:underline cursor-pointer"
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
