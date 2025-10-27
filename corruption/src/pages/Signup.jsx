import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { login, user } = useAuth(); // ✅ use AuthContext
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const name = `${firstName} ${lastName}`;

      // Create new user object with "user" role
      const newUser = { id: Date.now(), name, email, role: "user" };

      // ✅ log the user in immediately
      login(newUser);
      alert("Signup successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Auto-redirect after login/signup
  useEffect(() => {
    if (!user) return;
    // Normal user goes to dashboard
    if (user.role === "admin") navigate("/admin");
    else navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="relative flex items-center justify-center h-screen text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-b before:from-gray-900/85 before:to-gray-900/85"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1619874349927-ac1b7b8d8dbf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvcnJ1cHRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1000')`,
        }}
      ></div>

      <div className="relative z-10 bg-gray-900/90 p-10 rounded-xl shadow-lg w-96 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 border border-gray-700 transition"
            />
            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 border border-gray-700 transition"
            />
          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 border border-gray-700 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 border border-gray-700 transition"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 border border-gray-700 transition"
          />

          <label className="flex items-center gap-2 text-gray-300 text-sm">
            <input type="checkbox" required className="accent-pink-500" />
            I agree with{" "}
            <span className="text-pink-500 cursor-pointer hover:underline">privacy</span> and{" "}
            <span className="text-pink-500 cursor-pointer hover:underline">policy</span>
          </label>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-pink-500 hover:bg-pink-400 rounded-lg font-semibold transition"
          >
            Sign up
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-pink-500 hover:underline cursor-pointer transition"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
