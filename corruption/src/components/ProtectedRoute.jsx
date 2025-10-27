import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role, currentUser }) => {
  if (!currentUser) {
    return <Navigate to="/" replace />; // Not logged in
  }

  if (role && currentUser.role !== role) {
    // Redirect user based on role
    return currentUser.role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }

  return children;
};

export default ProtectedRoute;
