import { Mail } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { Enquiry } from "../../../api/enquiryApi";
import { EnquiryManagementListItem } from "./EnquiryManagementListItem";

type Props = {
  colors: ThemeColors;
  loading: boolean;
  enquiries: Enquiry[];
  filterStatus: string;
  onSelectEnquiry: (enquiry: Enquiry) => void;
};

export function EnquiryManagementList({
  colors,
  loading,
  enquiries,
  filterStatus,
  onSelectEnquiry,
}: Props) {
  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-20 rounded-xl"
        style={{
          backgroundColor: colors.background.secondary,
          color: colors.text.secondary,
        }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.interactive.primary }}
          />
          <p>Loading enquiries...</p>
        </div>
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div
        className="rounded-xl p-12 text-center"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <Mail
          className="w-16 h-16 mx-auto mb-4 opacity-50"
          style={{ color: colors.text.secondary }}
        />
        <h3
          className="text-xl font-semibold mb-2"
          style={{ color: colors.text.primary }}
        >
          No enquiries found
        </h3>
        <p style={{ color: colors.text.secondary }}>
          {filterStatus !== "all"
            ? `No ${filterStatus} enquiries at the moment`
            : "No enquiries have been submitted yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {enquiries.map((enquiry) => (
        <EnquiryManagementListItem
          key={enquiry._id}
          colors={colors}
          enquiry={enquiry}
          onSelect={onSelectEnquiry}
        />
      ))}
    </div>
  );
}
