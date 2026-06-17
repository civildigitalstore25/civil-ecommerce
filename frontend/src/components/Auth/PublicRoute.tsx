import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import { resolveAuthRedirect } from "../../utils/authRedirect";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const authenticated = isAuthenticated();
  const location = useLocation();

  if (authenticated) {
    const redirectState = location.state as
      | {
          returnTo?: string;
          from?: {
            pathname?: string;
            search?: string;
            hash?: string;
          };
        }
      | undefined;
    const redirectTo = resolveAuthRedirect(redirectState, "/", location.search);

    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
