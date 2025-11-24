import React from "react";

function useAdminTheme() {
  return {
    colors: {
      interactive: {
        primary: "#FACC15",
      },
    },
  };
}

type ThemeColors = {
  interactive: {
    primary: string;
  };
};

interface FeatureCardProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  color?: string;
  colors?: ThemeColors;
}

export default function FeatureCard({
  icon,
  title,
  description,
  color,
  colors: colorsProp,
}: FeatureCardProps) {
  const { colors: adminColors } = useAdminTheme();
  const themeColors = colorsProp ?? adminColors;

  const displayColor = color ?? themeColors.interactive.primary;
  const Icon = icon;

  return (
    <div
      className="flex flex-col items-start justify-center w-full bg-slate-900/60 backdrop-blur border border-white/10 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 group"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#FACC15"; // <-- YELLOW BORDER
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
      }}
    >
  <div
  className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
  style={{
    backgroundColor: `${displayColor}15`,       
    boxShadow: `0 0 6px ${displayColor}50`,      
  }}
>
  {Icon ? (
    <Icon
      className="w-6 h-6"
      style={{
        color: displayColor,
        filter: `drop-shadow(0 0 6px ${displayColor}60)`, 
      }}
    />
  ) : null}
</div>


      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-sm text-white/60 text-start leading-relaxed">
        {description}
      </p>
    </div>
  );
}
