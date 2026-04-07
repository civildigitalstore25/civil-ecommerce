import { ChevronDown, ChevronUp, Package } from "lucide-react";
import type { ThemeColors } from "../../contexts/AdminThemeContext";
import type { Enquiry } from "../../api/enquiryApi";
import {
  getUserEnquiryStatusColor,
  getUserEnquiryStatusLabel,
  UserEnquiryStatusIcon,
} from "./userEnquiryStatusUi";

type UserEnquiryCardProps = {
  enquiry: Enquiry;
  colors: ThemeColors;
  replyExpanded: boolean;
  onToggleReply: () => void;
};

export function UserEnquiryCard({
  enquiry,
  colors,
  replyExpanded,
  onToggleReply,
}: UserEnquiryCardProps) {
  const statusColor = getUserEnquiryStatusColor(enquiry.status, colors);

  return (
    <div
      className="rounded-2xl p-4 md:p-6 border transition-all duration-200 hover:shadow-lg"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block">
              <UserEnquiryStatusIcon status={enquiry.status} colors={colors} />
            </span>
            <span
              className="text-xs md:text-sm font-medium px-2 py-1 rounded-full"
              style={{
                color: statusColor,
                backgroundColor: colors.background.primary,
                border: `1px solid ${statusColor}`,
              }}
            >
              {getUserEnquiryStatusLabel(enquiry.status)}
            </span>
          </div>
          {enquiry.adminReply && (
            <button
              type="button"
              onClick={onToggleReply}
              className="flex items-center gap-1 text-xs md:text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: colors.status.success }}
            >
              {replyExpanded ? (
                <ChevronUp className="w-3 h-3 md:w-4 md:h-4" />
              ) : (
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
              )}
              <span className="hidden sm:inline">Softzcart </span>Reply
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {(enquiry.productImage || enquiry.product?.image) && (
            <div
              className="hidden sm:block w-16 h-16 md:w-20 md:h-20 rounded-lg flex-shrink-0"
              style={{ backgroundColor: colors.background.accent }}
            >
              <img
                src={enquiry.productImage || enquiry.product?.image}
                alt={enquiry.productName || enquiry.product?.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3
              className="text-base md:text-lg lg:text-xl font-semibold mb-1 truncate"
              style={{ color: colors.text.primary }}
            >
              {enquiry.subject}
            </h3>
            {(enquiry.productName || enquiry.product?.name) && (
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <Package
                  className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0"
                  style={{ color: colors.text.secondary }}
                />
                <span
                  className="truncate"
                  style={{ color: colors.text.secondary }}
                >
                  {enquiry.productName || enquiry.product?.name}
                </span>
              </div>
            )}
          </div>
        </div>

        <p
          className="text-sm md:text-base leading-relaxed"
          style={{ color: colors.text.secondary }}
        >
          {enquiry.message.length > 150
            ? `${enquiry.message.substring(0, 150)}...`
            : enquiry.message}
        </p>

        <div className="text-xs md:text-sm">
          <span style={{ color: colors.text.secondary }}>
            {new Date(enquiry.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {enquiry.adminReply && replyExpanded && (
          <div
            className="mt-2 p-3 md:p-4 rounded-lg border-l-4"
            style={{
              backgroundColor: colors.background.accent,
              borderColor: colors.status.success,
            }}
          >
            <p
              className="text-sm md:text-base"
              style={{ color: colors.text.primary }}
            >
              {enquiry.adminReply}
            </p>
            {enquiry.repliedAt && (
              <p
                className="text-xs md:text-sm mt-2"
                style={{ color: colors.text.secondary }}
              >
                Replied on {new Date(enquiry.repliedAt).toLocaleString()}
                {enquiry.repliedBy?.fullName &&
                  ` by ${enquiry.repliedBy.fullName}`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
