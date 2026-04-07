import React from "react";
import { CreditCard, DollarSign } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";

type Props = {
  product: Product;
};

export const ProductViewModalPricingSection: React.FC<Props> = ({ product }) => {
  const hasSubs = product.subscriptionDurations && product.subscriptionDurations.length > 0;

  return (
    <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: "white" }}>
      <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: "black" }}>
        <DollarSign className="w-6 h-6 mr-2" />
        Pricing Plans
      </h3>

      {hasSubs && (
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 flex items-center" style={{ color: "black" }}>
            <CreditCard className="w-5 h-5 mr-2" />
            Subscription Plans
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.subscriptionDurations!.map((sub, index) => (
              <div
                key={index}
                className="rounded-lg p-4 border"
                style={{
                  backgroundColor: "white",
                  borderColor: "gray",
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "black" }}>
                    ₹{sub.price?.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: "gray" }}>
                    {sub.duration}
                    {sub.trialDays && (
                      <div style={{ color: "gray", fontSize: "12px" }}>{sub.trialDays} Days</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasSubs && (
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3" style={{ color: "black" }}>
            License Plans
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.price1 && (
              <div
                className="rounded-lg p-4 border"
                style={{ backgroundColor: "white", borderColor: "gray" }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "black" }}>
                    ₹{product.price1.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: "gray" }}>
                    1-Year License
                  </div>
                  {product.oldPrice1 && (
                    <div className="text-sm line-through" style={{ color: "gray" }}>
                      ₹{product.oldPrice1.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
            {product.price3 && (
              <div
                className="rounded-lg p-4 border"
                style={{ backgroundColor: "white", borderColor: "gray" }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "black" }}>
                    ₹{product.price3.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: "gray" }}>
                    3-Year License
                  </div>
                  {product.oldPrice3 && (
                    <div className="text-sm line-through" style={{ color: "gray" }}>
                      ₹{product.oldPrice3.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
            {product.priceLifetime && (
              <div
                className="rounded-lg p-4 border"
                style={{ backgroundColor: "white", borderColor: "gray" }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "black" }}>
                    ₹{product.priceLifetime.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: "gray" }}>
                    Lifetime License
                  </div>
                  {product.oldPriceLifetime && (
                    <div className="text-sm line-through" style={{ color: "gray" }}>
                      ₹{product.oldPriceLifetime.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {(product.hasLifetime || product.hasMembership) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.hasLifetime && product.lifetimePrice && (
            <div
              className="rounded-lg p-4 border"
              style={{ backgroundColor: "white", borderColor: "gray" }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: "black" }}>
                  ₹{product.lifetimePrice.toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: "gray" }}>
                  Lifetime Access
                </div>
              </div>
            </div>
          )}
          {product.hasMembership && product.membershipPrice && (
            <div
              className="rounded-lg p-4 border"
              style={{ backgroundColor: "white", borderColor: "gray" }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: "black" }}>
                  ₹{product.membershipPrice.toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: "gray" }}>
                  Membership
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
