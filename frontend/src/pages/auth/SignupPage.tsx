import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useSignUp, useUserInvalidate } from "../../api/userQueries";
import { saveAuth } from "../../utils/auth";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import FormButton from "../../components/Button/FormButton";
import FormInput from "../../components/Input/FormInput";
import PasswordInput from "../../components/Input/PasswordInput";
import AdminThemeToggle from "../../components/ThemeToggle/AdminThemeToggle";
import logo from "../../assets/logo.png"
export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const invalidateUser = useUserInvalidate();
  const signUpMutation = useSignUp();
  const { colors } = useAdminTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: "error", title: "Validation Error", text: "Passwords do not match" });
      return false;
    }
    if (formData.password.length < 6) {
      Swal.fire({ icon: "error", title: "Validation Error", text: "Password too short" });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { confirmPassword, ...signUpData } = formData;
    signUpMutation.mutate(signUpData, {
      onSuccess: (data) => {
        saveAuth({
          token: data.token,
          email: data.user.email,
          role: data.user.role,
          userId: data.user.id,
          fullName: data.user.fullName,
        });
        invalidateUser();
        Swal.fire({ icon: "success", title: "Signup Successful!", timer: 2000, showConfirmButton: false });
        navigate("/");
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || "Signup failed";
        setError(errorMessage);
        Swal.fire({ icon: "error", title: "Signup Failed", text: errorMessage });
      },
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Theme Toggle - positioned in top right */}
      <div className="absolute top-4 right-4">
        <AdminThemeToggle />
      </div>

      <div
        className="w-full max-w-md rounded-2xl shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.background.secondary }}
      >
        {/* Header */}
        <div
          className="py-6 px-6 rounded-t-2xl flex flex-col items-center"
          style={{
            background: `linear-gradient(135deg, ${colors.interactive.primary}20, ${colors.interactive.primary}40)`
          }}
        >
          <div
            className="p-3 rounded-2xl shadow-md"
            style={{ backgroundColor: colors.background.primary }}
          >
            <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
          </div>
          <h1
            className="text-2xl font-bold mt-4"
            style={{ color: colors.text.primary }}
          >
            Create Account
          </h1>
          <p
            className="mt-2 text-sm text-center"
            style={{ color: colors.text.secondary }}
          >
            Join us to access software licenses and downloads
          </p>
        </div>

        {/* Body */}
        <div className="p-8">
          {error && (
            <div
              className="px-4 py-3 rounded-lg text-sm mb-4"
              style={{
                backgroundColor: `${colors.status.error}20`,
                borderColor: colors.status.error,
                color: colors.status.error,
                border: `1px solid ${colors.status.error}`
              }}
            >
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <FormInput label="Full Name " name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
            <FormInput label="Email " type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email" />
            <FormInput label="Phone (Optional)" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter your phone number" />

            <PasswordInput
              label="Password "
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            {/* Confirm Password */}
            <PasswordInput
              label="Confirm Password "
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />

            <FormButton type="submit" disabled={signUpMutation.isPending} className="w-full">
              {signUpMutation.isPending ? "Creating Account..." : "Create Account"}
            </FormButton>
          </form>

          <p
            className="text-center text-sm mt-6"
            style={{ color: colors.text.secondary }}
          >
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium transition-colors duration-200"
              style={{ color: colors.interactive.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.interactive.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.interactive.primary;
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
