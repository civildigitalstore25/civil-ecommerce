import React from "react";

type Props = { colors: any };

export const ProfilePageSecurityNote: React.FC<Props> = ({ colors }) => (
  <div
    className="mt-6 p-4 rounded-lg border transition-colors duration-200"
    style={{
      backgroundColor: colors.background.secondary,
      borderColor: colors.border.primary,
    }}
  >
    <div className="flex">
      <svg
        className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0 transition-colors duration-200"
        fill="currentColor"
        viewBox="0 0 20 20"
        style={{ color: colors.interactive.primary }}
      >
        <path
          fillRule="evenodd"
          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <h3
          className="font-medium transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Security Note
        </h3>
        <p
          className="text-sm mt-1 transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Your personal information is secure and will not be shared with third parties.
        </p>
      </div>
    </div>
  </div>
);
