import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import CreateReport from '../pages/CreateReport';
import ReportDetails from '../pages/ReportDetails';
import AdminDashboard from '../pages/AdminDashboard';
import UpdateStatus from '../pages/UpdateStatus';
import { useAuth } from '../contexts/AuthContext';
import MyReports from "../components/MyReports";
import MapPreview from "../components/MapPreview"
import LandingPage from '../pages/LandingPage'; 

function RoutesConfig() {
  const { user } = useAuth();

  return (
    <Routes>
        <Route path="/" element={<LandingPage />} /> 
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/create-report" element={user ? <CreateReport /> : <Navigate to="/" />} />
       <Route path="/my-reports" element={<MyReports />} /> {/* My Reports */}
         <Route path="/map" element={<MapPreview />} />
      <Route path="/report/:id" element={user ? <ReportDetails /> : <Navigate to="/" />} />
      <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
      <Route path="/update-status/:id" element={user?.role === 'admin' ? <UpdateStatus /> : <Navigate to="/" />} />
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}

export default RoutesConfig;

