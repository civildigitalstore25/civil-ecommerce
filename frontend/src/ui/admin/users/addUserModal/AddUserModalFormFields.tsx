import { X, User, Mail, Lock, Shield } from "lucide-react";
import FormInput from "../../../../components/Input/FormInput";
import PhoneInput from "../../../../components/Input/PhoneInput";
import FormButton from "../../../../components/Button/FormButton";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { UserFormData } from "./types";

interface AddUserModalFormFieldsProps {
  colors: ThemeColors;
  formData: UserFormData;
  errors: Partial<UserFormData>;
  handleChange: (field: keyof UserFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleClose: () => void;
  createUserMutation: { isPending: boolean };
}

export function AddUserModalFormFields({
  colors,
  formData,
  errors,
  handleChange,
  handleSubmit,
  handleClose,
  createUserMutation,
}: AddUserModalFormFieldsProps) {
  return (
    <>
      <div
        className="p-6 border-b flex items-center justify-between"
        style={{ borderBottomColor: colors.border.primary }}
      >
        <h2
          className="text-xl font-bold flex items-center gap-2"
          style={{ color: colors.text.primary }}
        >
          <User className="h-5 w-5" />
          Add New User
        </h2>
        <button
          onClick={handleClose}
          className="p-1 rounded-lg hover:bg-opacity-10 transition-colors"
          style={{
            color: colors.text.secondary,
            backgroundColor: `${colors.interactive.primary}10`,
          }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <div className="relative">
            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email address"
              required
              className="pl-10"
            />
            <div className="absolute left-3 top-9 pointer-events-none">
              <Mail
                className="h-5 w-5"
                style={{ color: colors.text.secondary }}
              />
            </div>
          </div>
          {errors.email && (
            <p
              className="text-sm mt-1"
              style={{ color: colors.status.error }}
            >
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <FormInput
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Enter full name"
              required
              className="pl-10"
            />
            <div className="absolute left-3 top-9 pointer-events-none">
              <User
                className="h-5 w-5"
                style={{ color: colors.text.secondary }}
              />
            </div>
          </div>
          {errors.fullName && (
            <p
              className="text-sm mt-1"
              style={{ color: colors.status.error }}
            >
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <PhoneInput
            label="Phone Number (Optional)"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label
            className="block font-medium mb-1"
            style={{ color: colors.text.primary }}
          >
            Role <span style={{ color: colors.status.error }}>*</span>
          </label>
          <div className="relative">
            <select
              value={formData.role}
              onChange={(e) =>
                handleChange(
                  "role",
                  e.target.value as UserFormData["role"],
                )
              }
              className="w-full border rounded p-2 pl-10 transition-all duration-200 focus:ring-2 focus:outline-none"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.interactive.primary;
                e.target.style.boxShadow = `0 0 0 2px ${colors.interactive.primary}40`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border.primary;
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
            <div className="absolute left-3 top-2 pointer-events-none">
              <Shield
                className="h-5 w-5"
                style={{ color: colors.text.secondary }}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="relative">
            <FormInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              required
              className="pl-10"
            />
            <div className="absolute left-3 top-9 pointer-events-none">
              <Lock
                className="h-5 w-5"
                style={{ color: colors.text.secondary }}
              />
            </div>
          </div>
          {errors.password && (
            <p
              className="text-sm mt-1"
              style={{ color: colors.status.error }}
            >
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <FormInput
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleChange("confirmPassword", e.target.value)
              }
              placeholder="Confirm password"
              required
              className="pl-10"
            />
            <div className="absolute left-3 top-9 pointer-events-none">
              <Lock
                className="h-5 w-5"
                style={{ color: colors.text.secondary }}
              />
            </div>
          </div>
          {errors.confirmPassword && (
            <p
              className="text-sm mt-1"
              style={{ color: colors.status.error }}
            >
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <FormButton
            type="button"
            onClick={handleClose}
            className="flex-1"
            style={{
              backgroundColor: colors.background.tertiary,
              color: colors.text.secondary,
              border: `1px solid ${colors.border.primary}`,
            }}
          >
            Cancel
          </FormButton>
          <FormButton
            type="submit"
            disabled={createUserMutation.isPending}
            className="flex-1"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse,
            }}
          >
            {createUserMutation.isPending ? "Creating..." : "Create User"}
          </FormButton>
        </div>
      </form>
    </>
  );
}
