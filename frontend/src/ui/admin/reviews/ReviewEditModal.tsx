import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import ReviewStarRating from "./ReviewStarRating";

type EditForm = { rating: number; comment: string };

type Props = {
  colors: ThemeColors;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  onUpdate: () => void;
  onCancel: () => void;
};

const ReviewEditModal: React.FC<Props> = ({
  colors,
  editForm,
  setEditForm,
  onUpdate,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      className="rounded-lg p-6 w-full max-w-md mx-4"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <h3 className="text-lg font-bold mb-4" style={{ color: colors.text.primary }}>
        Edit Review
      </h3>

      <div className="mb-4">
        <label className="block mb-2 font-medium" style={{ color: colors.text.primary }}>
          Rating
        </label>
        <ReviewStarRating
          rating={editForm.rating}
          interactive
          mutedStarColor={colors.text.secondary}
          onRatingChange={(r) => setEditForm((prev) => ({ ...prev, rating: r }))}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium" style={{ color: colors.text.primary }}>
          Comment
        </label>
        <textarea
          value={editForm.comment}
          onChange={(e) => setEditForm((prev) => ({ ...prev, comment: e.target.value }))}
          className="w-full p-3 rounded-lg border transition-colors"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
          rows={4}
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onUpdate}
          className="flex-1 font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
          style={{
            background: colors.interactive.primary,
            color: "#fff",
            border: `1.5px solid ${colors.interactive.primary}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              colors.interactive.primaryHover || colors.interactive.primary;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              colors.interactive.primary;
          }}
        >
          Update
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 font-bold py-2 px-4 rounded-lg transition-colors"
          style={{
            backgroundColor: colors.background.primary,
            color: colors.text.primary,
            border: `1px solid ${colors.border.primary}`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              colors.background.accent || colors.background.secondary;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              colors.background.primary;
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default ReviewEditModal;
