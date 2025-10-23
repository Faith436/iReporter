import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Predefined admin credentials
  const ADMIN_CREDENTIALS = {
    email: "admin@ireporter.com",
    password: "admin123" 
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let role = "user";

      // Check if the login matches admin credentials
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        role = "admin";
      }

      // Create user data
      const userData = {
        id: Date.now(),
        email: email,
        name: email.split("@")[0],
        role: role,
      };

      // Save user in auth context and localStorage
      login(userData);

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Log In</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="auth-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="auth-btn">
            Log in
          </button>
        </form>

        <p className="alt-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className="link">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
