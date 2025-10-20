import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import '../App.css';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert('Passwords do not match!');
    const response = await api.signup({ firstName, lastName, email, phone });
    setUser(response.user);
    navigate('/dashboard');
  };

  return (
    <div className="form-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSignup}>
        <input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        <button type="submit">CREATE ACCOUNT</button>
      </form>
    </div>
  );
}

export default Signup;
