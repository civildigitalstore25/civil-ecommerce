import type { Product } from "../../../../api/types/productTypes";
import {
  BRANDS,
  BRAND_CATEGORIES,
  DEFAULT_PRODUCT_FORM,
  type ProductForm,
} from "../../../../constants/productFormConstants";
import { localDateAndTimeFromValue } from "./productFormLocalDateTime";

const brands = BRANDS;
const brandCategories = BRAND_CATEGORIES;

export function createEmptyProductFormForNew(): ProductForm {
  const defaultBrand = brands[0].value;
  const availableCategories = brandCategories[defaultBrand] || [];
  return {
    ...DEFAULT_PRODUCT_FORM,
    brand: defaultBrand,
    category: availableCategories.length > 0 ? availableCategories[0].value : "",
  };
}

export function mapProductToProductForm(product: Product): ProductForm {
  const productBrand = product.brand || product.company || brands[0].value;
  const availableCategories = brandCategories[productBrand] || [];

  const dealStart = product.dealStartDate
    ? localDateAndTimeFromValue(product.dealStartDate)
    : { date: "", time: "" };
  const dealEnd = product.dealEndDate
    ? localDateAndTimeFromValue(product.dealEndDate)
    : { date: "", time: "" };

  const freeStart = product.freeProductStartDate
    ? localDateAndTimeFromValue(product.freeProductStartDate)
    : { date: "", time: "" };
  const freeEnd = product.freeProductEndDate
    ? localDateAndTimeFromValue(product.freeProductEndDate)
    : { date: "", time: "" };

  return {
    name: product.name || "",
    version: product.version || "",
    longDescription: product.description || product.shortDescription || "",
    detailsDescription: product.detailsDescription || "",
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    seoKeywords: product.seoKeywords || "",
    category:
      product.category ||
      (availableCategories.length > 0 ? availableCategories[0].value : ""),
    brand: productBrand,
    subscriptionDurations:
      product.subscriptionDurations && product.subscriptionDurations.length > 0
        ? product.subscriptionDurations.map((sub) => ({
            duration: sub.duration,
            price: sub.price?.toString() || "",
            priceINR: sub.priceINR?.toString() || "",
            priceUSD: sub.priceUSD?.toString() || "",
            trialDays: sub.trialDays?.toString() || "",
          }))
        : [
            {
              duration: "1 Year",
              price: product.price1?.toString() || "",
              priceINR: product.price1INR?.toString() || "",
              priceUSD: product.price1USD?.toString() || "",
            },
            ...(product.price3
              ? [
                  {
                    duration: "3 Year",
                    price: product.price3.toString(),
                    priceINR: product.price3INR?.toString() || "",
                    priceUSD: product.price3USD?.toString() || "",
                  },
                ]
              : []),
          ],
    ebookPriceINR: product.price1INR?.toString() || product.price1?.toString() || "",
    ebookPriceUSD: product.price1USD?.toString() || "",
    subscriptions:
      product.subscriptions && product.subscriptions.length > 0
        ? product.subscriptions.map((sub) => ({
            duration: sub.duration,
            price: sub.price?.toString() || "",
            priceINR: sub.priceINR?.toString() || "",
            priceUSD: sub.priceUSD?.toString() || "",
          }))
        : [
            {
              duration: "Monthly",
              price: "",
              priceINR: "",
              priceUSD: "",
            },
          ],
    hasLifetime:
      product.hasLifetime ||
      !!product.priceLifetime ||
      !!product.lifetimePrice ||
      (productBrand === "ebook" &&
        (!!product.price1INR || !!product.price1)),
    lifetimePrice:
      product.lifetimePrice?.toString() ||
      product.priceLifetime?.toString() ||
      (productBrand === "ebook"
        ? product.price1INR?.toString() || product.price1?.toString() || ""
        : ""),
    lifetimePriceINR:
      product.lifetimePriceINR?.toString() ||
      product.priceLifetimeINR?.toString() ||
      (productBrand === "ebook"
        ? product.price1INR?.toString() || product.price1?.toString() || ""
        : ""),
    lifetimePriceUSD:
      product.lifetimePriceUSD?.toString() ||
      product.priceLifetimeUSD?.toString() ||
      (productBrand === "ebook" ? product.price1USD?.toString() || "" : ""),
    hasMembership: product.hasMembership || !!product.membershipPrice,
    membershipPrice: product.membershipPrice?.toString() || "",
    membershipPriceINR: product.membershipPriceINR?.toString() || "",
    membershipPriceUSD: product.membershipPriceUSD?.toString() || "",
    strikethroughPriceINR: product.strikethroughPriceINR?.toString() || "",
    strikethroughPriceUSD: product.strikethroughPriceUSD?.toString() || "",
    imageUrl: product.imageUrl || product.image || "",
    additionalImages:
      product.additionalImages && product.additionalImages.length > 0
        ? product.additionalImages
        : [""],
    videoUrl: product.videoUrl || "",
    activationVideoUrl: product.activationVideoUrl || "",
    driveLink: product.driveLink || "",
    status: product.status || "active",
    isBestSeller: product.isBestSeller || false,
    isOutOfStock: product.isOutOfStock || false,
    faqs: product.faqs || [],
    keyFeatures: product.keyFeatures || [],
    systemRequirements: product.systemRequirements || [],
    isDeal: product.isDeal || false,
    dealStartDate: dealStart.date,
    dealStartTime: dealStart.time,
    dealEndDate: dealEnd.date,
    dealEndTime: dealEnd.time,
    dealEbookPriceINR: product.dealPrice1INR?.toString() || "",
    dealEbookPriceUSD: product.dealPrice1USD?.toString() || "",
    dealLifetimePriceINR: product.dealPriceLifetimeINR?.toString() || "",
    dealLifetimePriceUSD: product.dealPriceLifetimeUSD?.toString() || "",
    dealMembershipPriceINR: product.dealMembershipPriceINR?.toString() || "",
    dealMembershipPriceUSD: product.dealMembershipPriceUSD?.toString() || "",
    dealSubscriptionDurations:
      product.dealSubscriptionDurations && product.dealSubscriptionDurations.length > 0
        ? product.dealSubscriptionDurations.map((sub) => ({
            duration: sub.duration,
            price: sub.price?.toString() || "",
            priceINR: sub.priceINR?.toString() || "",
            priceUSD: sub.priceUSD?.toString() || "",
          }))
        : [],
    dealSubscriptions:
      product.dealSubscriptions && product.dealSubscriptions.length > 0
        ? product.dealSubscriptions.map((sub) => ({
            duration: sub.duration,
            price: sub.price?.toString() || "",
            priceINR: sub.priceINR?.toString() || "",
            priceUSD: sub.priceUSD?.toString() || "",
          }))
        : [],
    isFreeProduct: product.isFreeProduct || false,
    freeProductStartDate: freeStart.date,
    freeProductStartTime: freeStart.time,
    freeProductEndDate: freeEnd.date,
    freeProductEndTime: freeEnd.time,
  };
}
