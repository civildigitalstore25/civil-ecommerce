import type { ProductDetailPlanOption } from "./purchase/types";

/** Map selected plan id + option to cart `licenseType` (same rules as Product Detail add-to-cart / cart check). */
export function getProductDetailCartLicenseType(
  selectedLicense: string,
  selectedOption: ProductDetailPlanOption | undefined,
): "1year" | "3year" | "5minute" | "lifetime" {
  const selectedLicenseLower = selectedLicense.toLowerCase();

  if (selectedLicense === "lifetime") return "lifetime";
  if (selectedLicense === "5minute") return "5minute";
  if (selectedLicense === "free") return "1year";

  if (
    selectedLicenseLower.includes("admin-subscription-") ||
    selectedLicense === "membership"
  ) {
    if (selectedOption) {
      const duration = selectedOption.label.toLowerCase();
      if (duration.includes("5") && duration.includes("minute")) return "5minute";
      if (duration.includes("3") && duration.includes("year")) return "3year";
      if (
        (duration.includes("1") && duration.includes("year")) ||
        duration.includes("annual")
      )
        return "1year";
      return "1year";
    }
  }

  // Match default subscription IDs exactly (avoid matching admin-subscription-0 as subscription-0).
  if (selectedLicense === "yearly" || selectedLicense === "subscription-0") return "1year";
  if (selectedLicense === "3year" || selectedLicense === "subscription-1") return "3year";

  return "1year";
}
