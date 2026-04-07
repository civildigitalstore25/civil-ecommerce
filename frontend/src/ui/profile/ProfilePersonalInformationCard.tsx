import type { BaseSyntheticEvent } from "react";
import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import type { User } from "../../api/auth";
import FormInput from "../../components/Input/FormInput";
import PhoneInput from "../../components/Input/PhoneInput";

type FormValues = { fullName: string; phoneNumber: string };

type Props = {
  colors: any;
  isEditing: boolean;
  user: User | undefined;
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  errors: FieldErrors<FormValues>;
  onSubmit: (data: FormValues) => void | Promise<void>;
  handleSubmit: (
    fn: (data: FormValues) => void | Promise<void>,
  ) => (e?: BaseSyntheticEvent) => Promise<void>;
};

export function ProfilePersonalInformationCard({
  colors,
  isEditing,
  user,
  register,
  watch,
  errors,
  onSubmit,
  handleSubmit,
}: Props) {
  return (
  <div
    className="p-5 rounded-lg transition-colors duration-200"
    style={{ backgroundColor: colors.background.secondary }}
  >
    <h2
      className="text-lg font-semibold mb-4 flex items-center transition-colors duration-200"
      style={{ color: colors.text.primary }}
    >
      <svg
        className="w-5 h-5 mr-2 transition-colors duration-200"
        fill="currentColor"
        viewBox="0 0 20 20"
        style={{ color: colors.interactive.primary }}
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
      Personal Information
    </h2>

    {isEditing ? (
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Full Name"
          {...register("fullName", { required: "Full name is required" })}
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
        )}
        <PhoneInput
          label="Phone Number"
          name="phoneNumber"
          value={watch("phoneNumber")}
          onChange={register("phoneNumber", { required: "Phone number is required" }).onChange}
          placeholder="Enter number"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
        )}
      </form>
    ) : (
      <div className="space-y-3">
        <div>
          <label
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            Full Name
          </label>
          <p
            className="transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            {user?.fullName || "Not provided"}
          </p>
        </div>
        <div>
          <label
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            Phone Number
          </label>
          <p
            className="transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            {user?.phoneNumber || "Not provided"}
          </p>
        </div>
      </div>
    )}
  </div>
  );
}
