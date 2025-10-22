// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import api from '../services/api';
// import '../App.css';

// function Signup() {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const { setUser } = useAuth();
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) return alert('Passwords do not match!');
//     const response = await api.signup({ firstName, lastName, email });
//     setUser(response.user);
//     navigate('/dashboard');
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-container">
//         <h2 className="auth-title">Sign Up</h2>
//         <form className="auth-form" onSubmit={handleSignup}>
//           <div className="name-group">
//             <input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
//             <input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
//           </div>
//           <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
//           <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//           <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
//           <div className="auth-options">
//             <label>
//               <input type="checkbox" required /> I agree with <span className="link">privacy</span> and <span className="link">policy</span>
//             </label>
//           </div>
//           <button type="submit" className="auth-btn">Sign up</button>
//         </form>
//         <p className="alt-text">
//           Already have an account? <span onClick={() => navigate('/login')} className="link">Sign in</span>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Signup;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App'; // Import from App.js now
import '../App.css';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Mock signup - replace with your actual API call
      const userData = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        name: `${firstName} ${lastName}`,
        role: 'user'
      };
      
      login(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Sign Up</h2>
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="name-group">
            <input 
              placeholder="First Name" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              required 
            />
            <input 
              placeholder="Last Name" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              required 
            />
          </div>
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
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          <div className="auth-options">
            <label>
              <input type="checkbox" required /> I agree with <span className="link">privacy</span> and <span className="link">policy</span>
            </label>
          </div>
          <button type="submit" className="auth-btn">Sign up</button>
        </form>
        <p className="alt-text">
          Already have an account? <span onClick={() => navigate('/login')} className="link">Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;

