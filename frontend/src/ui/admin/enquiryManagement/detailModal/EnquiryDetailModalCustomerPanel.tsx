import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { Enquiry } from "../../../../api/enquiryApi";

export function EnquiryDetailModalCustomerPanel({
  colors,
  enquiry,
}: {
  colors: ThemeColors;
  enquiry: Enquiry;
}) {
  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: colors.background.accent,
        borderColor: colors.border.primary,
      }}
    >
      <h3
        className="text-sm font-medium mb-3"
        style={{ color: colors.text.secondary }}
      >
        Customer Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p
            className="text-xs mb-1"
            style={{ color: colors.text.secondary }}
          >
            Name
          </p>
          <p style={{ color: colors.text.primary }}>
            {enquiry.user?.fullName || "Unknown"}
          </p>
        </div>
        <div>
          <p
            className="text-xs mb-1"
            style={{ color: colors.text.secondary }}
          >
            Email
          </p>
          <p style={{ color: colors.text.primary }}>
            {enquiry.user?.email || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
