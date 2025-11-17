// src/components/RegistrationForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

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
          className="w-full p-3 pl-10 pr-10 rounded-lg border border-red-200 shadow-sm focus:outline-none focus:ring-2 placeholder:text-xs"
          required
        />
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Invalid email format";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!/\d/.test(password))
      newErrors.password = "Password must include at least one number";

    if (phone && !/^\d{10,15}$/.test(phone))
      newErrors.phone = "Phone must be 10-15 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus({ type: null, message: "" });
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        { firstName, lastName, email, password, phone },
        { withCredentials: true }
      );

      setStatus({ type: "success", message: data.message });

      // Clear inputs
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPhone("");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration error:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.error || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-slate-100 p-8 sm:p-12 lg:p-16 justify-center">
      <h2 className="text-3xl font-extrabold mb-2 text-red-600">
        Create Account
      </h2>
      <p className="text-red-600 mb-6">Sign up to get started</p>

      <StatusMessage type={status.type} message={status.message} />

      <form onSubmit={handleRegister} className="w-full" noValidate>
        <div className="flex gap-4">
          <div className="flex-1">
            <AuthInput
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="wisdom"
              icon={User}
            />
            {errors.firstName && (
              <p className="text-gray-500 text-sm">{errors.firstName}</p>
            )}
          </div>
          <div className="flex-1">
            <AuthInput
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Jerry"
              icon={User}
            />
            {errors.lastName && (
              <p className="text-gray-500 text-sm">{errors.lastName}</p>
            )}
          </div>
        </div>

        <AuthInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="wisdom@example.com"
          icon={Mail}
        />
        {errors.email && (
          <p className="text-gray-500 text-sm">{errors.email}</p>
        )}

        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={Lock}
        />
        {errors.password && (
          <p className="text-gray-500 text-sm">{errors.password}</p>
        )}

        <AuthInput
          label="Phone (optional)"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0700000000"
          icon={User}
        />
        {errors.phone && (
          <p className="text-gray-500 text-sm">{errors.phone}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 bg-red-500 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="text-black-600 text-center mt-4 text-sm">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-red-500 hover:underline cursor-pointer"
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default RegistrationForm;
