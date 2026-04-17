import { Send } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { Enquiry } from "../../../../api/enquiryApi";

type EnquiryDetailModalReplyPanelProps = {
  colors: ThemeColors;
  enquiry: Enquiry;
  replyText: string;
  onReplyTextChange: (v: string) => void;
  isReplying: boolean;
  onSendReply: () => void;
};

export function EnquiryDetailModalReplyPanel({
  colors,
  enquiry,
  replyText,
  onReplyTextChange,
  isReplying,
  onSendReply,
}: EnquiryDetailModalReplyPanelProps) {
  return (
    <>
      <div>
        <h3
          className="text-sm font-medium mb-2"
          style={{ color: colors.text.secondary }}
        >
          Your Reply
        </h3>
        <textarea
          value={replyText}
          onChange={(e) => onReplyTextChange(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-lg border outline-none resize-none transition-colors"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
          placeholder="Type your reply here..."
        />
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={onSendReply}
            disabled={isReplying || !replyText.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.interactive.primary,
              color: "#ffffff",
            }}
          >
            {isReplying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Send Reply</span>
              </>
            )}
          </button>
        </div>
      </div>

      {enquiry.adminReply && enquiry.adminReply !== replyText && (
        <div>
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: colors.text.secondary }}
          >
            Previous Reply
          </h3>
          <div
            className="p-4 rounded-lg border-l-4"
            style={{
              backgroundColor: colors.background.accent,
              borderColor: colors.status.success,
            }}
          >
            <p style={{ color: colors.text.primary }}>{enquiry.adminReply}</p>
          </div>
          {enquiry.repliedAt && (
            <p className="text-sm mt-2" style={{ color: colors.text.secondary }}>
              Replied on {new Date(enquiry.repliedAt).toLocaleString()}
              {enquiry.repliedBy?.fullName &&
                ` by ${enquiry.repliedBy.fullName}`}
            </p>
          )}
        </div>
      )}
    </>
  );
}
