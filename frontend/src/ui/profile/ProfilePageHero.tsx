import type { ChangeEvent } from "react";
import type { User } from "../../api/auth";
import { getProfileInitials } from "../../utils/userDisplay";

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
    className="flex flex-col gap-4 p-4 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between sm:p-6"
    style={{
      background: `linear-gradient(135deg, ${colors.interactive.primary} 0%, ${colors.interactive.primaryHover || colors.interactive.primary} 100%)`,
    }}
  >
    <div className="flex w-full items-center gap-3 sm:w-auto sm:gap-5">
      <div className="relative flex-shrink-0">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="avatar"
            className="h-16 w-16 rounded-full border-4 object-cover shadow-md sm:h-28 sm:w-28"
            style={{ borderColor: colors.background.primary }}
          />
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold shadow-md sm:h-28 sm:w-28 sm:text-2xl"
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
          className="truncate text-lg font-bold transition-colors duration-200 sm:text-2xl"
          style={{ color: "#FFFFFF" }}
        >
          {user?.fullName || "User"}
        </h1>
        <p
          className="mt-0.5 text-xs leading-snug transition-colors duration-200 sm:mt-1 sm:text-sm"
          style={{ color: "rgba(255, 255, 255, 0.88)" }}
        >
          Manage your personal information
        </p>
        <div className="mt-2 sm:mt-3">
          <span
            className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold sm:px-3 sm:text-sm"
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
    <div className="flex w-full justify-end sm:w-auto">
      {!isEditing ? (
        <button
          type="button"
          onClick={onStartEdit}
          className="w-full rounded-lg border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-[1.02] sm:w-auto sm:text-base"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "rgba(255, 255, 255, 0.85)",
            color: colors.interactive.primary,
          }}
        >
          Edit Profile
        </button>
      ) : null}
    </div>
  </div>
  );
}
