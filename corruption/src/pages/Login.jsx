import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, User, Lock, CheckCircle, XCircle } from "lucide-react";

// --- COLORS ---
const COLOR_PRIMARY_PURPLE = "#4D2C5E";
const COLOR_PRIMARY_TEAL = "#116E75";
const COLOR_LIGHT_TEAL = "#B3D8DB";

const defaultUsers = [
  {name: 'Wisdom Jerry', email: "wisdom@ireporter.com", password: "wisdom", role: "admin" },
  {name: 'Nanvule Fyth', email: "fyth@ireporter.com", password: "fyth", role: "user" },
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setLoading(true);

    setTimeout(() => {
      const foundUser = defaultUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        setStatus({
          type: "success",
          message: `Login successful! Redirecting as ${foundUser.role}...`,
        });

        // Save user to localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

        // Redirect based on role
        setTimeout(() => {
          if (foundUser.role === "admin") navigate("/admin");
          else navigate("/dashboard");
        }, 1200);

        setEmail("");
        setPassword("");
      } else {
        setStatus({
          type: "error",
          message:
            "Invalid email or password. Try admin@example.com / admin123 or user@example.com / user123",
        });
      }

      setLoading(false);
    }, 1000);
  };

  const AuthInput = ({ label, type, value, onChange, placeholder, icon: Icon }) => (
    <div className="mb-6">
      <label
        className="block text-xs font-semibold uppercase mb-1"
        style={{ color: COLOR_PRIMARY_TEAL }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 pl-10 bg-white text-gray-800 rounded-lg focus:outline-none focus:ring-2"
          style={{
            border: `1px solid ${COLOR_LIGHT_TEAL}`,
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
          required
        />
        <Icon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
          style={{ color: COLOR_PRIMARY_TEAL }}
        />
      </div>
    </div>
  );

  const StatusMessage = ({ type, message }) => {
    if (!message) return null;
    const isSuccess = type === "success";
    const Icon = isSuccess ? CheckCircle : XCircle;

    return (
      <div
        className={`flex items-center p-3 mb-4 rounded-lg text-sm transition-all duration-300 ${
          isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <p className="font-medium">{message}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans antialiased text-gray-800">
      <div className="grid md:grid-cols-[1fr_1fr] min-h-screen">
        <div className="flex flex-col p-6 sm:p-10 lg:p-16 xl:p-20 justify-center">
          <header className="mb-10">
            <h2
              className="text-4xl font-extrabold mb-2"
              style={{ color: COLOR_PRIMARY_PURPLE }}
            >
              Welcome Back!
            </h2>
            <p className="text-gray-600">Please log in to your account.</p>
          </header>

          <StatusMessage type={status.type} message={status.message} />

          <form onSubmit={handleLogin} className="w-full">
            <AuthInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              icon={User}
            />
            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
            />

            <div className="flex justify-between items-center mb-10 text-sm">
              <label className="flex items-center text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded"
                  style={{ accentColor: COLOR_PRIMARY_TEAL }}
                />
                Remember me
              </label>
              <a
                href="#"
                className="font-medium hover:underline"
                style={{ color: COLOR_PRIMARY_TEAL }}
              >
                Forgot password?
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 text-white py-3 px-6 rounded-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                style={{
                  backgroundColor: COLOR_PRIMARY_TEAL,
                  borderRadius: "10px",
                }}
                disabled={loading}
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Login
                  </>
                )}
              </button>
              <button
                type="button"
                className="flex-1 py-3 px-6 rounded-lg font-bold transition-all duration-300 hover:opacity-80"
                style={{
                  backgroundColor: "white",
                  color: COLOR_PRIMARY_TEAL,
                  border: `2px solid ${COLOR_PRIMARY_TEAL}`,
                  borderRadius: "10px",
                }}
              >
                Create account
              </button>
            </div>
          </form>

          <div className="mt-10 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <p className="font-semibold" style={{ color: COLOR_PRIMARY_PURPLE }}>
              Demo Credentials:
            </p>
            <p>
              Admin: <span className="font-mono">wisdom@ireporter.com / wisdom</span>
            </p>
            <p>
              User: <span className="font-mono">fyth@ireporter.com / fyth</span>
            </p>
          </div>
        </div>

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
                "url('https://img.freepik.com/free-photo/stylish-black-girl_1157-15553.jpg?ga=GA1.1.570788838.1761371184&semt=ais_hybrid&w=740&q=80')",
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
      </div>
    </div>
  );
};

export default Login;
