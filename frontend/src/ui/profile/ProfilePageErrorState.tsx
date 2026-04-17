import React from "react";

type Props = { colors: any };

export const ProfilePageErrorState: React.FC<Props> = ({ colors }) => (
  <div
    className="min-h-screen flex items-center justify-center transition-colors duration-200"
    style={{ backgroundColor: colors.background.secondary }}
  >
    <div
      className="text-center max-w-md p-6 rounded-lg shadow-md transition-colors duration-200"
      style={{ backgroundColor: colors.background.primary }}
    >
      <h2
        className="text-xl font-semibold mb-2 transition-colors duration-200"
        style={{ color: colors.text.primary }}
      >
        Error loading profile
      </h2>
      <p
        className="transition-colors duration-200"
        style={{ color: colors.text.secondary }}
      >
        Please try again later.
      </p>
    </div>
  </div>
);
