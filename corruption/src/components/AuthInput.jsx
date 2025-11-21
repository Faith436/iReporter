import React, { useState } from "react";

const AuthInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase mb-1 text-red-600">
        {label}
      </label>

      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full p-3 pl-10 pr-10 rounded-lg border ${
            error ? "border-red-500" : "border-red-200"
          } shadow-sm focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-400" : "focus:ring-red-200"
          } placeholder:text-xs`}
        />

        {/* Left Icon */}
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />

        {/* Eye toggle */}
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

      {error && (
        <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export default AuthInput;
