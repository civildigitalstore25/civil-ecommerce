import type { Product } from "../../../../api/types/productTypes";
import {
  BRANDS,
  BRAND_CATEGORIES,
  type ProductForm,
} from "../../../../constants/productFormConstants";
import { mergeDealAndFreeProductIntoPayload } from "./adminProductSaveDealFreeSlice";
import type { BuiltAdminProductPayload } from "./adminProductSavePayloadTypes";

export type { BuiltAdminProductPayload } from "./adminProductSavePayloadTypes";

const brands = BRANDS;
const brandCategories = BRAND_CATEGORIES;

export function buildAdminProductSavePayload(
  newProduct: ProductForm,
  status: string,
): {
  productData: BuiltAdminProductPayload;
  brandHasCategories: boolean;
  freeStartTimeNorm: string;
  freeEndTimeNorm: string;
} {
  const isDraft = status === "draft";
  const defaultName = newProduct.name || (isDraft ? `Draft Product ${Date.now()}` : "");
  const defaultImage =
    newProduct.imageUrl || (isDraft ? "https://via.placeholder.com/400x300?text=No+Image" : "");
  const defaultDescription = newProduct.longDescription || (isDraft ? "Draft description" : "");
  const defaultBrand = newProduct.brand || brands[0].value;

  const slug = `${defaultName.replace(/\s+/g, "-").toLowerCase()}${newProduct.version ? `-${newProduct.version.toString().toLowerCase()}` : ""}`;
  const brandHasCategories = (brandCategories[defaultBrand] || []).length > 0;
  const categoryValue = brandHasCategories
    ? newProduct.category || brandCategories[defaultBrand]?.[0]?.value || defaultBrand
    : defaultBrand;

  const htmlDescription = defaultDescription;
  const htmlDetailsDescription = newProduct.detailsDescription || (isDraft ? "" : "");

  const freeStartTimeNorm =
    (newProduct.freeProductStartTime || "00:00").trim() || "00:00";
  const freeEndTimeNorm =
    (newProduct.freeProductEndTime || "23:59").trim() || "23:59";

  const productData: BuiltAdminProductPayload = {
    name: defaultName,
    version: newProduct.version,
    slug,
    shortDescription: htmlDescription,
    description: htmlDescription,
    detailsDescription: htmlDetailsDescription,
    category: categoryValue,
    company: defaultBrand,
    brand: defaultBrand,
    price1:
      defaultBrand === "ebook"
        ? 0
        : newProduct.subscriptionDurations[0]?.price
          ? Number(newProduct.subscriptionDurations[0].price)
          : 0,
    price3:
      defaultBrand === "ebook"
        ? 0
        : newProduct.subscriptionDurations[1]?.price
          ? Number(newProduct.subscriptionDurations[1].price)
          : 0,
    priceLifetime:
      defaultBrand === "ebook"
        ? newProduct.hasLifetime && newProduct.lifetimePriceINR
          ? Number(newProduct.lifetimePriceINR)
          : newProduct.hasLifetime && newProduct.lifetimePrice
            ? Number(newProduct.lifetimePrice)
            : 0
        : newProduct.hasLifetime && newProduct.lifetimePriceINR
          ? Number(newProduct.lifetimePriceINR)
          : newProduct.hasLifetime && newProduct.lifetimePrice
            ? Number(newProduct.lifetimePrice)
            : 0,
    price1INR:
      defaultBrand === "ebook"
        ? 0
        : newProduct.subscriptionDurations[0]?.priceINR
          ? Number(newProduct.subscriptionDurations[0].priceINR)
          : 0,
    price1USD:
      defaultBrand === "ebook"
        ? 0
        : newProduct.subscriptionDurations[0]?.priceUSD
          ? Number(newProduct.subscriptionDurations[0].priceUSD)
          : 0,
    price3INR:
      defaultBrand === "ebook"
        ? 0
        : newProduct.subscriptionDurations[1]?.priceINR
          ? Number(newProduct.subscriptionDurations[1].priceINR)
          : 0,
    price3USD:
      defaultBrand === "ebook"
        ? 0
        : newProduct.subscriptionDurations[1]?.priceUSD
          ? Number(newProduct.subscriptionDurations[1].priceUSD)
          : 0,
    priceLifetimeINR:
      defaultBrand === "ebook"
        ? newProduct.hasLifetime && newProduct.lifetimePriceINR
          ? Number(newProduct.lifetimePriceINR)
          : 0
        : newProduct.lifetimePriceINR
          ? Number(newProduct.lifetimePriceINR)
          : 0,
    priceLifetimeUSD:
      defaultBrand === "ebook"
        ? newProduct.hasLifetime && newProduct.lifetimePriceUSD
          ? Number(newProduct.lifetimePriceUSD)
          : 0
        : newProduct.lifetimePriceUSD
          ? Number(newProduct.lifetimePriceUSD)
          : 0,
    subscriptionDurations:
      defaultBrand === "ebook"
        ? []
        : newProduct.subscriptionDurations
            .map((sub) => ({
              duration: sub.duration,
              price: sub.price ? Number(sub.price) : 0,
              priceINR: sub.priceINR ? Number(sub.priceINR) : undefined,
              priceUSD: sub.priceUSD ? Number(sub.priceUSD) : undefined,
              trialDays: sub.trialDays ? Number(sub.trialDays) : undefined,
            }))
            .filter(
              (sub) =>
                sub.price > 0 ||
                (sub.priceINR && sub.priceINR > 0) ||
                (sub.priceUSD && sub.priceUSD > 0),
            ),
    subscriptions: newProduct.subscriptions
      .map((sub) => ({
        duration: sub.duration,
        price: sub.price ? Number(sub.price) : 0,
        priceINR: sub.priceINR ? Number(sub.priceINR) : undefined,
        priceUSD: sub.priceUSD ? Number(sub.priceUSD) : undefined,
      }))
      .filter(
        (sub) =>
          sub.price > 0 ||
          (sub.priceINR && sub.priceINR > 0) ||
          (sub.priceUSD && sub.priceUSD > 0),
      ),
    hasLifetime: newProduct.hasLifetime,
    lifetimePrice:
      newProduct.hasLifetime && (newProduct.lifetimePriceINR || newProduct.lifetimePrice)
        ? Number(newProduct.lifetimePriceINR || newProduct.lifetimePrice)
        : 0,
    lifetimePriceINR:
      newProduct.hasLifetime && newProduct.lifetimePriceINR
        ? Number(newProduct.lifetimePriceINR)
        : 0,
    lifetimePriceUSD:
      newProduct.hasLifetime && newProduct.lifetimePriceUSD
        ? Number(newProduct.lifetimePriceUSD)
        : 0,
    hasMembership: newProduct.hasMembership,
    membershipPrice:
      newProduct.hasMembership && (newProduct.membershipPriceINR || newProduct.membershipPrice)
        ? Number(newProduct.membershipPriceINR || newProduct.membershipPrice)
        : 0,
    membershipPriceINR:
      newProduct.hasMembership && newProduct.membershipPriceINR
        ? Number(newProduct.membershipPriceINR)
        : 0,
    membershipPriceUSD:
      newProduct.hasMembership && newProduct.membershipPriceUSD
        ? Number(newProduct.membershipPriceUSD)
        : 0,
    strikethroughPriceINR: newProduct.strikethroughPriceINR
      ? Number(newProduct.strikethroughPriceINR)
      : 0,
    strikethroughPriceUSD: newProduct.strikethroughPriceUSD
      ? Number(newProduct.strikethroughPriceUSD)
      : 0,
    image: defaultImage,
    imageUrl: defaultImage,
    additionalImages: newProduct.additionalImages.filter((img) => img.trim() !== ""),
    videoUrl: newProduct.videoUrl,
    activationVideoUrl: newProduct.activationVideoUrl,
    driveLink: newProduct.driveLink,
    status,
    isBestSeller: newProduct.isBestSeller,
    isOutOfStock: newProduct.isOutOfStock,
    faqs: newProduct.faqs,
    keyFeatures: newProduct.keyFeatures,
    systemRequirements: newProduct.systemRequirements,
  };

  mergeDealAndFreeProductIntoPayload(
    productData,
    newProduct,
    defaultBrand,
    freeStartTimeNorm,
    freeEndTimeNorm,
  );

  return {
    productData,
    brandHasCategories,
    freeStartTimeNorm,
    freeEndTimeNorm,
  };
}

export function asProductForSave(payload: BuiltAdminProductPayload): Product {
  return payload as unknown as Product;
}
