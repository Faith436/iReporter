// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, ArrowRight } from 'lucide-react';

// const SocialButton = ({ icon, text }) => (
//   <button
//     className="flex items-center justify-center w-full py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition duration-200 text-sm font-medium"
//   >
//     {icon}
//     <span className="ml-2">{text}</span>
//   </button>
// );

// const SignupForm = () => {
//   const navigate = useNavigate();
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSignup = (e) => {
//     e.preventDefault();
//     setError('');

//     // Simple validation
//     if (!fullName || !email || !password) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     // Save user to localStorage
//     const newUser = { name: fullName, email, password, role: 'user' };
//     localStorage.setItem('registeredUser', JSON.stringify(newUser));

//     // Redirect to login page
//     navigate('/login', { replace: true });
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#211e2f' }}>
//       <div className="flex w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#211e2f' }}>

//         {/* Left Sidebar */}
//         <div 
//           className="hidden lg:block w-5/12 p-8 relative"
//           style={{ background: 'linear-gradient(135deg, #6c4b9d 0%, #30264d 100%)' }}
//         >
//           <div className="text-3xl font-bold tracking-widest text-white mb-6">AMU</div>
//           <button className="absolute top-8 right-8 flex items-center px-4 py-2 bg-white bg-opacity-10 rounded-full text-white text-sm hover:bg-opacity-20 transition duration-200">
//             Back to website <ArrowRight className="w-4 h-4 ml-2" />
//           </button>

//           <div className="absolute inset-0 z-0 opacity-70">
//             <div 
//               className="w-full h-full"
//               style={{
//                 backgroundImage: 'url("https://media.istockphoto.com/id/1766260321/photo/dark-money.webp?a=1&b=1&s=612x612&w=0&k=20&c=aXwUcoh-ZPTtAXw2SYwlxeBIZ5SvEMPsIMBe4eef9lA=")',
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 filter: 'brightness(0.6)'
//               }}
//             ></div>
//           </div>

//           <div className="absolute bottom-12 left-8 right-8 z-10 text-white">
//             <h1 className="text-3xl font-semibold leading-snug mb-4">
//               Capturing Moments,<br/>Creating Memories
//             </h1>
//             <div className="flex space-x-2 mt-4">
//               <div className="w-5 h-1 bg-white rounded-full"></div>
//               <div className="w-5 h-1 bg-white bg-opacity-50 rounded-full"></div>
//               <div className="w-5 h-1 bg-white bg-opacity-50 rounded-full"></div>
//             </div>
//           </div>
//         </div>

//         {/* Right Form */}
//         <div className="w-full lg:w-7/12 p-12 text-white">
//           <h2 className="text-4xl font-semibold mb-2">Create an Account</h2>
//           <p className="mb-8 text-gray-400">
//             Already have an account? <a href="login" className="text-purple-400 hover:underline">Log in here</a>
//           </p>

//           <form className="space-y-4" onSubmit={handleSignup}>

//             <input
//               type="text"
//               placeholder="Full Name"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
//               required
//             />

//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
//               required
//             />

//             <div className="relative">
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 pr-10"
//                 required
//               />
//               <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
//             </div>

//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <div className="flex items-start text-sm pt-2">
//               <input type="checkbox" className="mt-1 mr-2 h-4 w-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500" required />
//               <label className="text-gray-400">
//                 I agree to the <a href="#" className="text-purple-400 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>.
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="w-full py-3 mt-4 text-lg font-semibold rounded-lg transition duration-200"
//               style={{ backgroundColor: '#7a5af8', color: 'white' }}
//             >
//               Sign Up
//             </button>
//           </form>

//           <div className="flex items-center my-6">
//             <div className="flex-grow border-t border-gray-600"></div>
//             <span className="mx-4 text-sm text-gray-400">Or sign up with</span>
//             <div className="flex-grow border-t border-gray-600"></div>
//           </div>

//           <div className="flex space-x-4">
//             <SocialButton icon={<span>G</span>} text="Google" />
//             <SocialButton icon={<span>A</span>} text="Apple" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phone
      });

      // Save token and user to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      alert("Signup successful!");
      
      // Redirect based on role
      setTimeout(() => {
        if (response.user.role === "admin") navigate("/admin");
        else navigate("/dashboard");
      }, 1000);

    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 border border-gray-700 transition"
            />
            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 border border-gray-700 transition"
            />
          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 border border-gray-700 transition"
          />

          <input
            type="text"
            placeholder="Phone Number (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 border border-gray-700 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 border border-gray-700 transition"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 border border-gray-700 transition"
          />

          <label className="flex items-center gap-2 text-gray-300 text-sm">
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
            {loading ? "Creating Account..." : "Sign up"}
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
