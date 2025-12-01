import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import AuthInput from "./AuthInput";
import apiService from "../services/api";

const StatusMessage = ({ type, message }) => {
  if (!message) return null;
  const Icon = type === "success" ? CheckCircle : XCircle;

  return (
    <div
      className={`flex items-center p-3 mb-4 rounded-lg text-sm ${
        type === "success"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <p className="font-medium">{message}</p>
    </div>
  );
};

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let msg = "";

    switch (field) {
      case "firstName":
        if (!value.trim()) msg = "First name is required";
        else if (/\d/.test(value)) msg = "Must not contain numbers";
        break;

      case "lastName":
        if (!value.trim()) msg = "Last name is required";
        else if (/\d/.test(value)) msg = "Must not contain numbers";
        break;

      case "email":
        if (!value.trim()) msg = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(value)) msg = "Invalid email format";
        break;

      case "password":
        if (value.length < 6) msg = "Min 6 characters required";
        else if (!/\d/.test(value)) msg = "Must include at least 1 number";
        break;

      case "phone":
        if (value && !/^\d{10,15}$/.test(value)) msg = "Must be 10–15 digits";
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const validateAll = () => {
    Object.keys(form).forEach((field) => validateField(field, form[field]));
    return Object.values(errors).every((e) => e === "");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const data = await apiService.register(form); // ✅ use apiService

      setStatus({ type: "success", message: data.message });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-br bg-slate-100 p-8 sm:p-12 lg:p-16  shadow-md">
      <h2 className="text-3xl font-extrabold mb-2 text-red-600">
        Create Account
      </h2>
      <p className="text-red-500 mb-6">Sign up to get started</p>

      <StatusMessage type={status.type} message={status.message} />

      <form onSubmit={handleRegister} className="w-full">
        <div className="flex gap-4">
          <div className="flex-1">
            <AuthInput
              label="First Name"
              type="text"
              value={form.firstName}
              onChange={(e) => updateForm("firstName", e.target.value)}
              onBlur={() => validateField("firstName", form.firstName)}
              placeholder="Wisdom"
              icon={User}
              error={errors.firstName}
            />
          </div>

          <div className="flex-1">
            <AuthInput
              label="Last Name"
              type="text"
              value={form.lastName}
              onChange={(e) => updateForm("lastName", e.target.value)}
              onBlur={() => validateField("lastName", form.lastName)}
              placeholder="Jerry"
              icon={User}
              error={errors.lastName}
            />
          </div>
        </div>

        <AuthInput
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => updateForm("email", e.target.value)}
          onBlur={() => validateField("email", form.email)}
          placeholder="wisdom@example.com"
          icon={Mail}
          error={errors.email}
        />

        <AuthInput
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => updateForm("password", e.target.value)}
          onBlur={() => validateField("password", form.password)}
          placeholder="••••••••"
          icon={Lock}
          error={errors.password}
        />

        <AuthInput
          label="Phone (optional)"
          type="text"
          value={form.phone}
          onChange={(e) => updateForm("phone", e.target.value)}
          onBlur={() => validateField("phone", form.phone)}
          placeholder="0700000000"
          icon={User}
          error={errors.phone}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 bg-red-500 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="text-black text-center mt-4 text-sm">
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
