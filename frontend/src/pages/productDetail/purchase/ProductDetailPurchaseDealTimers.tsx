import React from "react";
import { CountdownTimer } from "../../../components/CountdownTimer/CountdownTimer";
import type { ProductDetailPurchaseDealTimersProps } from "./types";

export const ProductDetailPurchaseDealTimers: React.FC<
  ProductDetailPurchaseDealTimersProps
> = ({ isActiveDeal, product, freeOfferSchedule, colors }) => {
  return (
    <>
      {isActiveDeal && product.dealEndDate && (
        <div className="mt-4">
          <CountdownTimer
            dealEndDate={new Date(product.dealEndDate)}
            colors={colors}
            variant="featured"
          />
        </div>
      )}
      {freeOfferSchedule?.status === "active" && (
        <div className="mt-4">
          <CountdownTimer
            dealEndDate={freeOfferSchedule.end}
            colors={colors}
            variant="featured"
          />
        </div>
      )}
    </>
  );
};
