type Colors = Record<string, any>;

type ReviewModalProps = {
  open: boolean;
  onClose: () => void;
  colors: Colors;
  onSelectAsAdmin: () => void;
  onSelectAsAnonymousUser: () => void;
};

export function ProductDetailReviewTypeModal({
  open,
  onClose,
  colors,
  onSelectAsAdmin,
  onSelectAsAnonymousUser,
}: ReviewModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 max-w-md w-full shadow-xl"
        style={{ backgroundColor: colors.background.secondary }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-2xl font-bold mb-4"
          style={{ color: colors.text.primary }}
        >
          Choose Review Type
        </h3>
        <p
          className="mb-6"
          style={{ color: colors.text.secondary }}
        >
          How would you like to write this review?
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={onSelectAsAdmin}
            className="w-full p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.interactive.primary,
              color: colors.text.primary,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                colors.interactive.primary + "20";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                colors.background.primary;
            }}
          >
            <div className="text-left">
              <div className="font-bold mb-1">Review as Admin</div>
              <div className="text-sm" style={{ color: colors.text.secondary }}>
                Your review will show your admin account name
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onSelectAsAnonymousUser}
            className="w-full p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.interactive.secondary,
              color: colors.text.primary,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                colors.interactive.secondary + "20";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                colors.background.primary;
            }}
          >
            <div className="text-left">
              <div className="font-bold mb-1">Review as User</div>
              <div className="text-sm" style={{ color: colors.text.secondary }}>
                You can provide a custom name for this review
              </div>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-2 rounded-lg font-medium transition-colors duration-200"
          style={{
            backgroundColor: colors.background.primary,
            color: colors.text.secondary,
            border: `1px solid ${colors.border.primary}`,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

type ReplyModalProps = {
  reviewId: string | null;
  onClose: () => void;
  colors: Colors;
  onSelectAsAdmin: () => void;
  onSelectAsAnonymousUser: () => void;
};

export function ProductDetailReplyTypeModal({
  reviewId,
  onClose,
  colors,
  onSelectAsAdmin,
  onSelectAsAnonymousUser,
}: ReplyModalProps) {
  if (!reviewId) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 max-w-md w-full shadow-xl"
        style={{ backgroundColor: colors.background.secondary }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-2xl font-bold mb-4"
          style={{ color: colors.text.primary }}
        >
          Choose Reply Type
        </h3>
        <p
          className="mb-6"
          style={{ color: colors.text.secondary }}
        >
          How would you like to reply to this review?
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={onSelectAsAdmin}
            className="w-full p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.interactive.primary,
              color: colors.text.primary,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                colors.interactive.primary + "20";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                colors.background.primary;
            }}
          >
            <div className="text-left">
              <div className="font-bold mb-1">Reply as Admin</div>
              <div className="text-sm" style={{ color: colors.text.secondary }}>
                Your reply will show your admin account name
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onSelectAsAnonymousUser}
            className="w-full p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.interactive.secondary,
              color: colors.text.primary,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                colors.interactive.secondary + "20";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                colors.background.primary;
            }}
          >
            <div className="text-left">
              <div className="font-bold mb-1">Reply as User</div>
              <div className="text-sm" style={{ color: colors.text.secondary }}>
                You can provide a custom name for this reply
              </div>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-2 rounded-lg font-medium transition-colors duration-200"
          style={{
            backgroundColor: colors.background.primary,
            color: colors.text.secondary,
            border: `1px solid ${colors.border.primary}`,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
