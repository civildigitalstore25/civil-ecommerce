import { useState, useEffect, useMemo } from "react";
import type { Product } from "../../api/types/productTypes";

export function useProductDetailDealFree(product: Product | undefined) {
  const [isActiveDeal, setIsActiveDeal] = useState(false);

  useEffect(() => {
    if (product && product.isDeal && product.dealStartDate && product.dealEndDate) {
      const now = new Date();
      const start = new Date(product.dealStartDate);
      const end = new Date(product.dealEndDate);
      setIsActiveDeal(now >= start && now <= end);
    } else {
      setIsActiveDeal(false);
    }
  }, [product]);

  const freeOfferSchedule = useMemo(() => {
    if (!product?.isFreeProduct || !product.freeProductStartDate || !product.freeProductEndDate) {
      return null;
    }

    const start = new Date(product.freeProductStartDate);
    const end = new Date(product.freeProductEndDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const now = Date.now();
    const startMs = start.getTime();
    const endMs = end.getTime();

    let status: "upcoming" | "active" | "ended" = "active";
    if (now < startMs) status = "upcoming";
    else if (now > endMs) status = "ended";

    return { start, end, status };
  }, [product]);

  const isActiveFreeProduct = freeOfferSchedule?.status === "active";

  return { isActiveDeal, freeOfferSchedule, isActiveFreeProduct };
}
