import React from "react";
import * as LucideIcons from "lucide-react";

type IconProps = { className?: string; size?: number };

export function renderProductDetailLucideIcon(iconName: string, className?: string) {
  const IconComponent = (
    LucideIcons as unknown as Record<string, React.ComponentType<IconProps> | undefined>
  )[iconName];
  if (IconComponent) {
    return <IconComponent className={className} size={24} />;
  }
  return <LucideIcons.Check className={className} size={24} />;
}
