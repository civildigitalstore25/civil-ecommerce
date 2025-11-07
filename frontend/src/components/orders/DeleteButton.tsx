import React from "react";
import { Trash2 } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface DeleteButtonProps {
  onDelete: () => void;
  isDeleting: boolean;
  canDelete: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = React.memo(
  ({ onDelete, isDeleting, canDelete }) => {
    const { colors } = useAdminTheme();

    if (!canDelete) return null;

    return (
      <div className="absolute top-4 right-4">
        <button
          onClick={onDelete}
          className="p-2 rounded-lg transition-all duration-200 hover:bg-opacity-20"
          style={{
            color: colors.status.error,
            backgroundColor: colors.background.tertiary,
            border: `1px solid ${colors.status.error}30`,
          }}
          disabled={isDeleting}
          aria-label="Delete order"
        >
          {isDeleting ? (
            <div
              className="animate-spin rounded-full h-4 w-4 border-2 border-b-2"
              style={{ borderColor: colors.status.error }}
              aria-label="Deleting..."
            />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  },
);

DeleteButton.displayName = "DeleteButton";

export default DeleteButton;
