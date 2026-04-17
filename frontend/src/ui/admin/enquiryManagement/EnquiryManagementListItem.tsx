import { Package } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { Enquiry } from "../../../api/enquiryApi";
import { EnquiryStatusIcon, enquiryStatusColor } from "./enquiryStatusDisplay";

type Props = {
  colors: ThemeColors;
  enquiry: Enquiry;
  onSelect: (enquiry: Enquiry) => void;
};

export function EnquiryManagementListItem({
  colors,
  enquiry,
  onSelect,
}: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(enquiry);
        }
      }}
      className="rounded-xl p-6 border transition-all duration-200 hover:shadow-lg cursor-pointer"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
      onClick={() => onSelect(enquiry)}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {(enquiry.productImage || enquiry.product?.image) && (
          <div
            className="w-24 h-24 rounded-lg flex-shrink-0"
            style={{ backgroundColor: colors.background.accent }}
          >
            <img
              src={enquiry.productImage || enquiry.product?.image}
              alt={enquiry.productName || enquiry.product?.name}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3
                className="text-xl font-semibold mb-1"
                style={{ color: colors.text.primary }}
              >
                {enquiry.subject}
              </h3>
              <div className="flex items-center gap-4 text-sm mb-2">
                <span style={{ color: colors.text.secondary }}>
                  From: {enquiry.user?.fullName || "Unknown User"}
                </span>
                <span style={{ color: colors.text.secondary }}>
                  {enquiry.user?.email}
                </span>
              </div>
              {(enquiry.productName || enquiry.product?.name) && (
                <div className="flex items-center gap-2 text-sm">
                  <Package
                    className="w-4 h-4"
                    style={{ color: colors.text.secondary }}
                  />
                  <span style={{ color: colors.text.secondary }}>
                    {enquiry.productName || enquiry.product?.name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <EnquiryStatusIcon status={enquiry.status} colors={colors} />
              <span
                className="text-sm font-medium capitalize"
                style={{ color: enquiryStatusColor(enquiry.status, colors) }}
              >
                {enquiry.status}
              </span>
            </div>
          </div>

          <p
            className="mb-4 line-clamp-2"
            style={{ color: colors.text.secondary }}
          >
            {enquiry.message}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <span style={{ color: colors.text.secondary }}>
              {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {enquiry.adminReply && (
              <span
                className="font-medium"
                style={{ color: colors.status.success }}
              >
                ✓ Reply sent
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
