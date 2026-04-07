import type { ProductForm } from "../../../../constants/productFormConstants";
import type { BuiltAdminProductPayload } from "./adminProductSavePayloadTypes";

export function mergeDealAndFreeProductIntoPayload(
  productData: BuiltAdminProductPayload,
  newProduct: ProductForm,
  defaultBrand: string,
  freeStartTimeNorm: string,
  freeEndTimeNorm: string,
): void {
  Object.assign(productData, {
    isDeal: newProduct.isDeal || false,
    dealStartDate:
      newProduct.isDeal && newProduct.dealStartDate && newProduct.dealStartTime
        ? new Date(`${newProduct.dealStartDate}T${newProduct.dealStartTime}`)
        : null,
    dealEndDate:
      newProduct.isDeal && newProduct.dealEndDate && newProduct.dealEndTime
        ? new Date(`${newProduct.dealEndDate}T${newProduct.dealEndTime}`)
        : null,
    dealPrice1INR:
      newProduct.isDeal && defaultBrand === "ebook" && newProduct.dealEbookPriceINR
        ? Number(newProduct.dealEbookPriceINR)
        : 0,
    dealPrice1USD:
      newProduct.isDeal && defaultBrand === "ebook" && newProduct.dealEbookPriceUSD
        ? Number(newProduct.dealEbookPriceUSD)
        : 0,
    dealPriceLifetimeINR:
      newProduct.isDeal &&
      ((defaultBrand === "ebook" && newProduct.dealEbookPriceINR) ||
        (defaultBrand !== "ebook" && newProduct.dealLifetimePriceINR))
        ? Number(
            defaultBrand === "ebook"
              ? newProduct.dealEbookPriceINR
              : newProduct.dealLifetimePriceINR,
          )
        : 0,
    dealPriceLifetimeUSD:
      newProduct.isDeal &&
      ((defaultBrand === "ebook" && newProduct.dealEbookPriceUSD) ||
        (defaultBrand !== "ebook" && newProduct.dealLifetimePriceUSD))
        ? Number(
            defaultBrand === "ebook"
              ? newProduct.dealEbookPriceUSD
              : newProduct.dealLifetimePriceUSD,
          )
        : 0,
    dealMembershipPriceINR:
      newProduct.isDeal && defaultBrand !== "ebook" && newProduct.dealMembershipPriceINR
        ? Number(newProduct.dealMembershipPriceINR)
        : 0,
    dealMembershipPriceUSD:
      newProduct.isDeal && defaultBrand !== "ebook" && newProduct.dealMembershipPriceUSD
        ? Number(newProduct.dealMembershipPriceUSD)
        : 0,
    dealSubscriptionDurations:
      newProduct.isDeal &&
      defaultBrand !== "ebook" &&
      newProduct.dealSubscriptionDurations.length > 0
        ? newProduct.dealSubscriptionDurations
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
            )
        : [],
    dealSubscriptions:
      newProduct.isDeal && defaultBrand !== "ebook" && newProduct.dealSubscriptions.length > 0
        ? newProduct.dealSubscriptions
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
            )
        : [],
    isFreeProduct: newProduct.isFreeProduct || false,
    freeProductStartDate:
      newProduct.isFreeProduct && newProduct.freeProductStartDate
        ? new Date(`${newProduct.freeProductStartDate}T${freeStartTimeNorm}`)
        : null,
    freeProductEndDate:
      newProduct.isFreeProduct && newProduct.freeProductEndDate
        ? new Date(`${newProduct.freeProductEndDate}T${freeEndTimeNorm}`)
        : null,
  });
}
