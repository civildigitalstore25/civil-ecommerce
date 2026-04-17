import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import FormInput from "../../../components/Input/FormInput";
import PasswordInput from "../../../components/Input/PasswordInput";
import type { SignupFormData } from "./signupFormValidation";
import { signupFormValidation } from "./signupFormValidation";

interface SignupFormFieldsProps {
  control: Control<SignupFormData>;
  errors: any;
}

export function SignupFormFields({ control, errors }: SignupFormFieldsProps) {
  return (
    <>
      <div>
        <Controller
          name="fullName"
          control={control}
          rules={signupFormValidation.fullName}
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

      <div>
        <Controller
          name="email"
          control={control}
          rules={signupFormValidation.email}
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
    </>
  );
}

interface SignupPasswordFieldsProps {
  control: Control<SignupFormData>;
  errors: any;
  password: string;
}

export function SignupPasswordFields({ control, errors, password }: SignupPasswordFieldsProps) {
  return (
    <>
      <div>
        <Controller
          name="password"
          control={control}
          rules={signupFormValidation.password}
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

      <div>
        <Controller
          name="confirmPassword"
          control={control}
          rules={signupFormValidation.confirmPassword(password)}
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
    </>
  );
}
