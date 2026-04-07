import React from "react";
import { Trash2 } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  selectedCount: number;
  onBulkDelete: () => void;
};

const ReviewsToolbar: React.FC<Props> = ({ colors, selectedCount, onBulkDelete }) => (
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
    <div>
      <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
        Reviews Management
      </h2>
      <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
        Manage customer reviews and feedback
      </p>
    </div>
    <div className="flex gap-2 items-center">
      {selectedCount > 0 && (
        <button
          type="button"
          className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200 bg-red-600 text-white hover:bg-red-700"
          onClick={onBulkDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete Selected ({selectedCount})
        </button>
      )}
    </div>
  </div>
);

export default ReviewsToolbar;
