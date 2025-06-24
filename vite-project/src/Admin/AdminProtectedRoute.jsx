import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const NAMESPACE = "https://myapp.com/claims"; // use the same namespace you used in the Auth0 Action

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  const roles = user?.[`${NAMESPACE}/roles`] || [];

  if (!roles.includes('Admin')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminRoute;
