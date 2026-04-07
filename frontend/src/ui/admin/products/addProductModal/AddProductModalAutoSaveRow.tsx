import { Clock } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  lastSaved: Date | null;
};

export function AddProductModalAutoSaveRow({ colors, lastSaved }: Props) {
  if (!lastSaved) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 text-sm" style={{ color: colors.text.secondary }}>
        <Clock className="h-4 w-4" />
        <span>Auto-saved at {lastSaved.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
