import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    // Redirect to signin page if not authenticated
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;