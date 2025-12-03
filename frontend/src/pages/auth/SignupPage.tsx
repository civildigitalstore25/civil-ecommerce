import { useNavigate, Link } from "react-router-dom";
import { Controller } from "react-hook-form";
import { useAppForm } from "../../hooks/useAppForm";
import Swal from "sweetalert2";
import { useSignUp, useUserInvalidate } from "../../api/userQueries";
import { saveAuth } from "../../utils/auth";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import FormButton from "../../components/Button/FormButton";
import FormInput from "../../components/Input/FormInput";
import PasswordInput from "../../components/Input/PasswordInput";
import AdminThemeToggle from "../../components/ThemeToggle/AdminThemeToggle";
import logo from "../../assets/logo.png";
import { useState } from "react";
import type { CountryData, PhoneInputProps } from "react-phone-input-2";
// @ts-ignore
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  countryCode: string;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const invalidateUser = useUserInvalidate();
  const signUpMutation = useSignUp();
  const { colors } = useAdminTheme();
  const [countryCode, setCountryCode] = useState<string>("91");

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useAppForm<SignupFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
      countryCode: "+91",
    },
  });

  const password = watch("password");

  const onSubmit = (data: SignupFormData) => {
    const { confirmPassword, ...signUpData } = data;
    
    // Extract phone number without country code
    let phone = data.phoneNumber;
    let cc = countryCode;
    
    if (phone.startsWith("+")) {
      const match = phone.match(/^\+(\d{1,4})/);
      if (match) {
        cc = match[1];
        phone = phone.replace(/^\+\d{1,4}/, "");
      }
    }
    
    const submitData = {
      ...signUpData,
      phoneNumber: phone.trim(),
      countryCode: `+${cc}`,
    };
    
    signUpMutation.mutate(submitData, {
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
          title: "Signup Successful!",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
      },
      onError: (err: any) => {
        const errorMessage = err.response?.data?.message || "Signup failed";
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: errorMessage,
        });
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
            background: `linear-gradient(135deg, ${colors.interactive.primary}20, ${colors.interactive.primary}40)`,
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
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <Controller
                name="fullName"
                control={control}
                rules={{
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name must not exceed 50 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: "Name can only contain letters and spaces",
                  },
                }}
                render={({ field }) => (
                  <FormInput
                    label="Full Name "
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter your full name"
                    required
                  />
                )}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email address is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                }}
                render={({ field }) => (
                  <FormInput
                    label="Email "
                    type="email"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter your email"
                    required
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number with Country Code */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.primary }}
              >
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  required: "Phone number is required",
                  validate: (value) => {
                    if (!value) return "Phone number is required";
                    const digits = value.replace(/\D/g, "");
                    if (digits.length < 8 || digits.length > 15) {
                      return "Phone number must be 8-15 digits";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <div className="phone-input-wrapper">
                    <style>{`
                      .phone-input-wrapper .react-tel-input .form-control {
                        width: 100% !important;
                        padding-left: 60px !important;
                        padding-right: 16px !important;
                        padding-top: 10px !important;
                        padding-bottom: 10px !important;
                        border-radius: 0.5rem !important;
                        background-color: ${colors.background.primary} !important;
                        border: 1px solid ${colors.border?.primary || '#e5e7eb'} !important;
                        color: ${colors.text.primary} !important;
                        font-size: 0.875rem !important;
                        outline: none !important;
                        transition: all 0.2s !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .form-control:focus {
                        border-color: ${colors.interactive.primary} !important;
                        box-shadow: 0 0 0 2px ${colors.interactive.primary}33 !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .flag-dropdown {
                        background-color: ${colors.background.primary} !important;
                        border: none !important;
                        border-radius: 0.5rem !important;
                        padding-left: 8px !important;
                        padding-right: 8px !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .flag-dropdown:hover,
                      .phone-input-wrapper .react-tel-input .flag-dropdown.open {
                        background-color: ${colors.background.primary} !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .selected-flag {
                        background-color: transparent !important;
                        padding: 0 8px !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .selected-flag:hover,
                      .phone-input-wrapper .react-tel-input .selected-flag.open {
                        background-color: ${colors.background.secondary || 'rgba(0,0,0,0.1)'} !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .country-list {
                        background-color: ${colors.background.primary} !important;
                        border: 1px solid ${colors.border?.primary || '#e5e7eb'} !important;
                        border-radius: 0.5rem !important;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
                        margin-top: 4px !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .country-list .country {
                        background-color: ${colors.background.primary} !important;
                        color: ${colors.text.primary} !important;
                        padding: 8px 12px !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .country-list .country:hover,
                      .phone-input-wrapper .react-tel-input .country-list .country.highlight {
                        background-color: ${colors.background.secondary || 'rgba(0,0,0,0.1)'} !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .country-list .country.preferred {
                        background-color: ${colors.background.secondary || 'rgba(0,0,0,0.05)'} !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .country-list .search {
                        background-color: ${colors.background.primary} !important;
                        padding: 8px !important;
                        position: sticky !important;
                        top: 0 !important;
                        z-index: 1 !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .country-list .search-box {
                        width: 100% !important;
                        padding: 8px 12px !important;
                        border-radius: 0.375rem !important;
                        background-color: ${colors.background.secondary || 'rgba(0,0,0,0.1)'} !important;
                        border: 1px solid ${colors.border?.primary || '#e5e7eb'} !important;
                        color: ${colors.text.primary} !important;
                        font-size: 0.875rem !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .country-list .search-box::placeholder {
                        color: ${colors.text.secondary || '#9ca3af'} !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .country-list .search-box:focus {
                        outline: none !important;
                        border-color: ${colors.interactive.primary} !important;
                        box-shadow: 0 0 0 2px ${colors.interactive.primary}33 !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .country-list .divider {
                        border-bottom: 1px solid ${colors.border?.primary || '#e5e7eb'} !important;
                      }
                      
                      .phone-input-wrapper .react-tel-input .country-list .country-name,
                      .phone-input-wrapper .react-tel-input .country-list .dial-code {
                        color: ${colors.text.primary} !important;
                      }
                    `}</style>
                    <PhoneInput
                      country={"in"}
                      value={field.value}
                      onChange={(value: string, data: CountryData) => {
                        field.onChange(value);
                        setValue("phoneNumber", value);
                        if (data && typeof data === "object" && "dialCode" in data && data.dialCode) {
                          setCountryCode(data.dialCode);
                          setValue("countryCode", `+${data.dialCode}`);
                        }
                      }}
                      inputProps={{
                        name: "phone",
                        required: true,
                        autoFocus: false,
                      }}
                      containerClass="w-full"
                      enableSearch
                      disableSearchIcon={false}
                      searchPlaceholder="Search country"
                      specialLabel=""
                      countryCodeEditable={false}
                      enableAreaCodes={true}
                      masks={{ in: "+.. ........." }}
                    />
                  </div>
                )}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                    message:
                      "Password must contain uppercase, lowercase, number, and special character",
                  },
                }}
                render={({ field }) => (
                  <PasswordInput
                    label="Password "
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter your password"
                    required
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                render={({ field }) => (
                  <PasswordInput
                    label="Confirm Password "
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Confirm password"
                    required
                  />
                )}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <FormButton
              type="submit"
              disabled={signUpMutation.isPending}
              className="w-full"
            >
              {signUpMutation.isPending
                ? "Creating Account..."
                : "Create Account"}
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