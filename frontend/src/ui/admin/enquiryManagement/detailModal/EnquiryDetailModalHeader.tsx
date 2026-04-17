import { Trash2 } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { Enquiry } from "../../../../api/enquiryApi";

type EnquiryDetailModalHeaderProps = {
  colors: ThemeColors;
  enquiry: Enquiry;
  onStatusChange: (enquiryId: string, status: string) => void;
  onDelete: (enquiryId: string) => void;
  onClose: () => void;
};

export function EnquiryDetailModalHeader({
  colors,
  enquiry,
  onStatusChange,
  onDelete,
  onClose,
}: EnquiryDetailModalHeaderProps) {
  return (
    <div
      className="sticky top-0 p-6 border-b"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Enquiry Details
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={enquiry.status}
            onChange={(e) => onStatusChange(enquiry._id, e.target.value)}
            className="px-4 py-2 rounded-lg border outline-none transition-colors"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          >
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
          <button
            type="button"
            onClick={() => onDelete(enquiry._id)}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: colors.status.error,
              color: "#ffffff",
            }}
          >
            <Trash2 size={20} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: colors.background.accent,
              color: colors.text.primary,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
