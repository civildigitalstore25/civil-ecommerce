import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { Enquiry } from "../../../../api/enquiryApi";

export function EnquiryDetailModalSubjectMessagePanel({
  colors,
  enquiry,
}: {
  colors: ThemeColors;
  enquiry: Enquiry;
}) {
  return (
    <>
      <div>
        <h3
          className="text-sm font-medium mb-2"
          style={{ color: colors.text.secondary }}
        >
          Subject
        </h3>
        <p
          className="text-lg font-semibold"
          style={{ color: colors.text.primary }}
        >
          {enquiry.subject}
        </p>
      </div>

      <div>
        <h3
          className="text-sm font-medium mb-2"
          style={{ color: colors.text.secondary }}
        >
          Customer Message
        </h3>
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: colors.background.accent }}
        >
          <p style={{ color: colors.text.primary }}>{enquiry.message}</p>
        </div>
        <p className="text-sm mt-2" style={{ color: colors.text.secondary }}>
          Sent on {new Date(enquiry.createdAt).toLocaleString()}
        </p>
      </div>
    </>
  );
}
