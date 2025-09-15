import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useSignIn, useUserInvalidate } from "../../api/userQueries";
import { saveAuth } from "../../utils/auth";
import FormButton from "../../components/Button/FormButton";
import FormInput from "../../components/Input/FormInput";
import GoogleButton from "../../components/Button/GoogleButton";
import PasswordInput from "../../components/Input/PasswordInput";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const invalidateUser = useUserInvalidate();
  const signInMutation = useSignIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    signInMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          saveAuth({
            token: data.token,
            email: data.user.email,
            role: data.user.role,
            userId: data.user.id,
            fullName: data.user.fullName,
          });
          invalidateUser();

          Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: "Welcome back to our platform!",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          });

          navigate("/");
        },
        onError: (err: any) => {
          const errorMessage = err.response?.data?.message || "Something went wrong";
          setError(errorMessage);

          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: errorMessage,
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          });
        },
      }
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="py-6 px-6 bg-gradient-to-r from-[#EFF6FF] to-[#F9F5FF] rounded-t-2xl flex flex-col items-center">
          <div className="bg-white p-3 rounded-2xl shadow-md">
            <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Welcome Back</h1>
          <p className="text-gray-800 mt-2 text-sm text-center">
            Sign in to access your software licenses and downloads
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* Google Login */}
          <GoogleButton
            text="Continue with Google"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
                }/api/auth/google`;
            }}
          />

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-400 text-sm">Or continue with email</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
              label="Email "
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            {/* Password using reusable component */}
            <PasswordInput
              label="Password "
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <FormButton type="submit" disabled={signInMutation.isPending} className="w-full">
              {signInMutation.isPending ? "Signing in..." : "Sign In"}
            </FormButton>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
