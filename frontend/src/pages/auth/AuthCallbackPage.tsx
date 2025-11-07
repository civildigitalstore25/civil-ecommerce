import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuth } from "../../utils/auth";
import { useCurrentUser } from "../../api/auth"; // Use the new hook
import { useUserInvalidate } from "../../api/userQueries";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const invalidateUser = useUserInvalidate();
  const { refetch } = useCurrentUser(); // Use the hook to get user data

  useEffect(() => {
    const handleGoogleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (token) {
          // Save the token to localStorage
          localStorage.setItem("token", token);

          // Use the TanStack Query hook to fetch user data
          const { data: userData } = await refetch();

          if (userData) {
            // Save complete user data to localStorage
            saveAuth({
              token,
              email: userData.email,
              role: userData.role,
              userId: userData.id,
              fullName: userData.fullName,
            });
            invalidateUser();
            navigate("/");
          } else {
            throw new Error("Failed to fetch user data");
          }
        } else {
          navigate("/signin");
        }
      } catch (error) {
        console.error("Auth callback failed:", error);
        navigate("/signin");
      }
    };

    handleGoogleAuthCallback();
  }, [navigate, invalidateUser, refetch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Completing login...
        </h2>
        <p className="text-gray-600 mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
