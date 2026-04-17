import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { Enquiry } from "../../../../api/enquiryApi";

export function EnquiryDetailModalProductPanel({
  colors,
  enquiry,
}: {
  colors: ThemeColors;
  enquiry: Enquiry;
}) {
  if (!enquiry.productImage && !enquiry.product?.image) {
    return null;
  }

  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: colors.background.accent,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center gap-4">
        <img
          src={enquiry.productImage || enquiry.product?.image}
          alt={enquiry.productName || enquiry.product?.name}
          className="w-20 h-20 object-contain rounded-lg"
          style={{ backgroundColor: colors.background.secondary }}
        />
        <div>
          <h3
            className="font-semibold text-lg"
            style={{ color: colors.text.primary }}
          >
            {enquiry.productName || enquiry.product?.name}
          </h3>
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            Product Enquiry
          </p>
        </div>
      </div>
    </div>
  );
}
