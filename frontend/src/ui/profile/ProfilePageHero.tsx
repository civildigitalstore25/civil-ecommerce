import type { ChangeEvent } from "react";
import FormButton from "../../components/Button/FormButton";
import type { User } from "../../api/auth";
import { getProfileInitials } from "./profilePageUtils";

type Props = {
  user: User | undefined;
  colors: any;
  isEditing: boolean;
  avatarPreview: string | null;
  onStartEdit: () => void;
  onAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function ProfilePageHero({
  user,
  colors,
  isEditing,
  avatarPreview,
  onStartEdit,
  onAvatarChange,
}: Props) {
  return (
  <div
    className="p-6 transition-colors duration-200 flex flex-col sm:flex-row items-center sm:items-center sm:justify-between gap-4"
    style={{
      backgroundColor: colors.interactive.primary,
    }}
  >
    <div className="flex items-center gap-4 w-full sm:w-auto">
      <div className="relative flex-shrink-0">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="avatar"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-md border-4"
            style={{ borderColor: colors.background.primary }}
          />
        ) : (
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-2xl font-bold shadow-md"
            style={{
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
            }}
          >
            {getProfileInitials(user?.fullName) || "U"}
          </div>
        )}
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="absolute bottom-0 right-0 opacity-0 w-8 h-8"
            title="Upload avatar"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h1
          className="text-2xl font-bold transition-colors duration-200 truncate"
          style={{ color: colors.text.primary }}
        >
          {user?.fullName || "User"}
        </h1>
        <p
          className="text-sm mt-1 transition-colors duration-200 whitespace-normal break-words"
          style={{ color: colors.text.secondary }}
        >
          Manage your personal information
        </p>
        <div className="mt-3">
          <span
            className="px-3 py-1 text-sm rounded-full font-semibold inline-block"
            style={{
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
              border: `1px solid ${colors.border.primary}`,
              opacity: 0.95,
            }}
          >
            {user?.role || "user"}
          </span>
        </div>
      </div>
    </div>
    <div className="w-full sm:w-auto flex justify-end sm:justify-end mt-2 sm:mt-0">
      {!isEditing ? (
        <FormButton
          onClick={onStartEdit}
          variant="secondary"
          className="ml-2"
          style={{ borderRadius: 8 }}
        >
          Edit Profile
        </FormButton>
      ) : null}
    </div>
  </div>
  );
}
