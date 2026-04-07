import type { BaseSyntheticEvent } from "react";
import FormButton from "../../components/Button/FormButton";

type FormValues = { fullName: string; phoneNumber: string };

type Props = {
  colors: any;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (data: FormValues) => void | Promise<void>;
  handleSubmit: (
    fn: (data: FormValues) => void | Promise<void>,
  ) => (e?: BaseSyntheticEvent) => Promise<void>;
};

export function ProfilePageEditFooter({
  colors,
  isPending,
  onCancel,
  onSubmit,
  handleSubmit,
}: Props) {
  return (
  <div
    className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t transition-colors duration-200"
    style={{ borderColor: colors.border.primary }}
  >
    <FormButton
      onClick={onCancel}
      variant="secondary"
      className="w-full sm:w-auto"
      disabled={isPending}
    >
      Cancel
    </FormButton>
    <FormButton
      onClick={handleSubmit(onSubmit)}
      className="w-full sm:w-auto"
      disabled={isPending}
      type="button"
    >
      {isPending ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Saving...
        </span>
      ) : (
        "Save Changes"
      )}
    </FormButton>
  </div>
  );
}
