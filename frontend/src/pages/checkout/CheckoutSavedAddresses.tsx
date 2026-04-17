import React from "react";
import type { BillingAddress } from "../../api/billingAddressApi";

type Props = {
  savedAddresses: BillingAddress[];
  selectedAddressId: string | null;
  colors: any;
  onSelectAddress: (address: BillingAddress) => void;
  onDeleteAddress: (addressId: string) => void;
};

export const CheckoutSavedAddresses: React.FC<Props> = ({
  savedAddresses,
  selectedAddressId,
  colors,
  onSelectAddress,
  onDeleteAddress,
}) => {
  if (savedAddresses.length === 0) return null;

  return (
    <div
      className="rounded-xl p-4 md:p-6 border"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: colors.text.primary }}
      >
        📋 Saved Billing Details
      </h3>
      <p
        className="text-sm mb-4"
        style={{ color: colors.text.secondary }}
      >
        Select from your previously used billing details or enter new ones below
      </p>
      <div className="space-y-3">
        {savedAddresses.map((address) => (
          <div
            key={address._id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedAddressId === address._id
                ? "shadow-md"
                : "hover:shadow-sm"
            }`}
            style={{
              backgroundColor: colors.background.primary,
              borderColor:
                selectedAddressId === address._id
                  ? colors.interactive.primary
                  : colors.border.secondary,
            }}
            onClick={() => onSelectAddress(address)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedAddressId === address._id
                        ? "border-transparent"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        selectedAddressId === address._id
                          ? colors.interactive.primary
                          : "transparent",
                      borderColor:
                        selectedAddressId === address._id
                          ? colors.interactive.primary
                          : colors.border.primary,
                    }}
                  >
                    {selectedAddressId === address._id && (
                      <svg
                        className="w-3 h-3"
                        fill="white"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className="font-semibold text-sm md:text-base"
                    style={{ color: colors.text.primary }}
                  >
                    {address.name}
                  </span>
                </div>
                <div
                  className="text-xs md:text-sm space-y-1 ml-7"
                  style={{ color: colors.text.secondary }}
                >
                  <p>📧 {address.email}</p>
                  <p>
                    📱 {address.countryCode} {address.whatsapp}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteAddress(address._id);
                }}
                className="ml-2 p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                style={{
                  color: colors.status.error,
                }}
                title="Delete address"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
