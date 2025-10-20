import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import '../App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await api.login(email, password);
    setUser(response.user);
    navigate('/dashboard');
  };

  return (
    <div className="form-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">LOGIN</button>
      </form>
      <p>
        Don't have an account? <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer', color: 'blue' }}>Create Account</span>
      </p>
    </div>
  );
}

export default Login;
