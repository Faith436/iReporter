import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import '../App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Mock login - replace with your actual API call
      const userData = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0],
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
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
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
          
          {/* Role Selection for Login */}
          <div className="form-group">
            <label className="form-label">Login As</label>
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
                    Access user dashboard and reports
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
                    Access admin dashboard and management
                  </span>
                </div>
              </label>
            </div>
          </div>
          
          <div className="auth-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-link">Forgot Password?</a>
          </div>
          <button type="submit" className="auth-btn">Log in</button>
        </form>
        <p className="alt-text">
          Don't have an account? <span onClick={() => navigate('/signup')} className="link">Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;