// src/components/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import { useUsers } from "../contexts/UserContext";

const COLOR_PRIMARY_TEAL = "#116E75";

const AuthInput = ({ label, type, name, value, onChange, placeholder }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-xs font-semibold uppercase mb-1" style={{ color: COLOR_PRIMARY_TEAL }}>
        {label}
      </label>
    )}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 border border-gray-700 transition"
    />
  </div>
);

const StatusMessage = ({ type, message }) => {
  if (!message) return null;
  const colorClass = type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  return (
    <div className={`p-3 mb-4 rounded-lg text-sm ${colorClass}`}>
      {message}
    </div>
  );
};

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useUsers();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setLoading(true);

    try {
      const res = await apiService.register(formData);

      // Optionally fetch current user if backend returns it
      if (res.user) setUser(res.user);

      setStatus({ type: "success", message: "Signup successful! Redirecting to login..." });

      // Clear form
      setFormData({ firstName: "", lastName: "", email: "", password: "", phone: "" });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Signup error:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || err.response?.data?.error || "Signup failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900/90 p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: COLOR_PRIMARY_TEAL }}>
          Sign Up
        </h2>

        <StatusMessage type={status.type} message={status.message} />

        <form onSubmit={handleSignup} className="flex flex-col">
          <div className="flex gap-4 flex-col sm:flex-row">
            <AuthInput
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
            <AuthInput
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </div>

          <AuthInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
          />
          <AuthInput
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number (Optional)"
          />
          <AuthInput
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />

          <label className="flex items-center gap-2 text-gray-300 text-sm mb-4">
            <input type="checkbox" required className="accent-teal-500" />
            I agree with{" "}
            <span className="text-teal-500 cursor-pointer hover:underline">privacy</span> and{" "}
            <span className="text-teal-500 cursor-pointer hover:underline">policy</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-teal-500 hover:bg-teal-400 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-teal-500 hover:underline cursor-pointer transition"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;


