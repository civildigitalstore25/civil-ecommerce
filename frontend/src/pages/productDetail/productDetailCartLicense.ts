import type { ProductDetailPlanOption } from "./purchase/types";

/** Map selected plan id + option to cart `licenseType` (same rules as Product Detail add-to-cart / cart check). */
export function getProductDetailCartLicenseType(
  selectedLicense: string,
  selectedOption: ProductDetailPlanOption | undefined,
): "1year" | "3year" | "lifetime" {
  if (selectedLicense === "lifetime") return "lifetime";
  if (selectedLicense === "free") return "1year";
  if (selectedLicense === "yearly" || selectedLicense.includes("subscription-0")) return "1year";
  if (selectedLicense === "3year" || selectedLicense.includes("subscription-1")) return "3year";

  if (
    selectedLicense.includes("admin-subscription-") ||
    selectedLicense === "membership"
  ) {
    if (selectedOption) {
      const duration = selectedOption.label.toLowerCase();
      if (duration.includes("3") && duration.includes("year")) return "3year";
      if (
        (duration.includes("1") && duration.includes("year")) ||
        duration.includes("annual")
      )
        return "1year";
      return "1year";
    }
  }

  return "1year";
}
