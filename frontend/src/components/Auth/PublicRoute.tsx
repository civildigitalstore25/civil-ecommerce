import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const authenticated = isAuthenticated();

  if (authenticated) {
    // Redirect to home page if already authenticated
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
