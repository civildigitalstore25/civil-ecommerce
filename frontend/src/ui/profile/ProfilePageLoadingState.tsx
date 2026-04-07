import React from "react";

type Props = { colors: any };

export const ProfilePageLoadingState: React.FC<Props> = ({ colors }) => (
  <div
    className="min-h-screen flex items-center justify-center transition-colors duration-200"
    style={{ backgroundColor: colors.background.secondary }}
  >
    <div
      className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
      style={{ borderColor: colors.interactive.primary }}
    />
  </div>
);
