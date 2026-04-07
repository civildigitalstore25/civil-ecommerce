interface MenuManagementErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export function MenuManagementErrorAlert({
  message,
  onDismiss,
}: MenuManagementErrorAlertProps) {
  return (
    <div className="mb-4 p-4 rounded-lg bg-red-100 border border-red-300 text-red-800">
      {message}
      <button
        type="button"
        onClick={onDismiss}
        className="float-right font-bold"
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  );
}
