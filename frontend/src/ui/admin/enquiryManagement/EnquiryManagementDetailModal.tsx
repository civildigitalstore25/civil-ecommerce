import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { Enquiry } from "../../../api/enquiryApi";
import { EnquiryDetailModalHeader } from "./detailModal/EnquiryDetailModalHeader";
import { EnquiryDetailModalCustomerPanel } from "./detailModal/EnquiryDetailModalCustomerPanel";
import { EnquiryDetailModalProductPanel } from "./detailModal/EnquiryDetailModalProductPanel";
import { EnquiryDetailModalSubjectMessagePanel } from "./detailModal/EnquiryDetailModalSubjectMessagePanel";
import { EnquiryDetailModalReplyPanel } from "./detailModal/EnquiryDetailModalReplyPanel";

type Props = {
  colors: ThemeColors;
  enquiry: Enquiry;
  replyText: string;
  onReplyTextChange: (v: string) => void;
  isReplying: boolean;
  onClose: () => void;
  onStatusChange: (enquiryId: string, status: string) => void;
  onDelete: (enquiryId: string) => void;
  onSendReply: () => void;
};

export function EnquiryManagementDetailModal({
  colors,
  enquiry,
  replyText,
  onReplyTextChange,
  isReplying,
  onClose,
  onStatusChange,
  onDelete,
  onSendReply,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.background.secondary }}
        onClick={(e) => e.stopPropagation()}
      >
        <EnquiryDetailModalHeader
          colors={colors}
          enquiry={enquiry}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onClose={onClose}
        />

        <div className="p-6 space-y-6">
          <EnquiryDetailModalCustomerPanel colors={colors} enquiry={enquiry} />
          <EnquiryDetailModalProductPanel colors={colors} enquiry={enquiry} />
          <EnquiryDetailModalSubjectMessagePanel
            colors={colors}
            enquiry={enquiry}
          />
          <EnquiryDetailModalReplyPanel
            colors={colors}
            enquiry={enquiry}
            replyText={replyText}
            onReplyTextChange={onReplyTextChange}
            isReplying={isReplying}
            onSendReply={onSendReply}
          />
        </div>
      </div>
    </div>
  );
}
