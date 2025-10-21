import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the / page, but save the current location they were
    // trying to go to. This is optional but good UX.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If allowedRoles is provided, check if the user's role is in the array
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a relevant page if the role is not authorized
    const redirectTo = user.role === 'student' ? '/student/profile' : '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;