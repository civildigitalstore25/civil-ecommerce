import type { Banner } from "../../../../types/Banner";

export function createEmptyBannerForm(): Banner {
  return {
    title: "",
    description: "",
    ctaButtonText: "Shop Now",
    ctaButtonLink: "",
    startDate: "",
    endDate: "",
    position: "Home Page Only",
    bannerType: "Normal",
    priority: 1,
    status: "Active",
    backgroundColor: "",
    textColor: "",
  };
}

export function bannerToFormState(banner: Banner): Banner {
  return {
    ...banner,
    startDate: banner.startDate
      ? new Date(banner.startDate).toISOString().split("T")[0]
      : "",
    endDate: banner.endDate
      ? new Date(banner.endDate).toISOString().split("T")[0]
      : "",
  };
}
