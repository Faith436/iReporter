import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import '../App.css';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
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
        role: role
      };
      
      login(userData);
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
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
          
          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <div className="role-selection">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === 'user'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <div className="role-content">
                  <span className="role-title">👤 Citizen User</span>
                  <span className="role-description">
                    Report incidents and track their progress
                  </span>
                </div>
              </label>

              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={(e) => setRole(e.target.value)}
                />
                <div className="role-content">
                  <span className="role-title">👑 Administrator</span>
                  <span className="role-description">
                    Manage reports and update investigation status
                  </span>
                </div>
              </label>
            </div>
          </div>
          
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