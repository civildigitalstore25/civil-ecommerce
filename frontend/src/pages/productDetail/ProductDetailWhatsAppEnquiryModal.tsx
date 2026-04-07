import React from "react";
import * as LucideIcons from "lucide-react";
import type { Product } from "../../api/types/productTypes";
import type { ProductDetailPlanOption } from "./purchase/types";

type Props = {
  open: boolean;
  onClose: () => void;
  colors: any;
  product: Product;
  selectedOption: ProductDetailPlanOption | undefined;
  formatPriceWithSymbol: (inr: number, usd: number) => string;
  enquiryMessage: string;
  onEnquiryMessageChange: (v: string) => void;
  isCustomMessage: boolean;
  onSetCustomMessage: (custom: boolean) => void;
  onRevertToDefaultMessage: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onSubmit: () => void;
};

export const ProductDetailWhatsAppEnquiryModal: React.FC<Props> = ({
  open,
  onClose,
  colors,
  product,
  selectedOption,
  formatPriceWithSymbol,
  enquiryMessage,
  onEnquiryMessageChange,
  isCustomMessage,
  onSetCustomMessage,
  onRevertToDefaultMessage,
  textareaRef,
  onSubmit,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full rounded-2xl p-6 shadow-2xl"
        style={{
          backgroundColor: colors.background.secondary,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Send Enquiry
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg transition-colors duration-200"
            style={{
              color: colors.text.secondary,
              backgroundColor: colors.background.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.background.accent;
              e.currentTarget.style.color = colors.interactive.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background.primary;
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            <LucideIcons.X size={24} />
          </button>
        </div>

        <div
          className="mb-6 p-4 rounded-xl"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="flex items-center gap-4">
            <img
              src={product.imageUrl || product.image}
              alt={product.name}
              className="w-16 h-16 object-contain rounded-lg"
            />
            <div>
              <h4
                className="font-bold text-lg"
                style={{ color: colors.text.primary }}
              >
                {product.name}
              </h4>
              {selectedOption && (
                <p
                  className="text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  {selectedOption.label} -{" "}
                  {formatPriceWithSymbol(
                    selectedOption.priceINR,
                    selectedOption.priceUSD,
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: colors.text.primary }}
          >
            Your Message
          </label>
          <textarea
            ref={textareaRef}
            value={enquiryMessage}
            onChange={(e) => onEnquiryMessageChange(e.target.value)}
            placeholder="Type your enquiry here..."
            rows={5}
            readOnly={!isCustomMessage}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-colors duration-200 resize-none ${!isCustomMessage ? "opacity-80 cursor-not-allowed" : ""}`}
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.interactive.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border.primary;
            }}
          />
          <div className="flex justify-end mt-2">
            {!isCustomMessage ? (
              <button
                type="button"
                onClick={() => {
                  onSetCustomMessage(true);
                  onEnquiryMessageChange("");
                }}
                className="text-sm font-medium text-blue-600"
              >
                Write custom message
              </button>
            ) : (
              <button
                type="button"
                onClick={onRevertToDefaultMessage}
                className="text-sm font-medium text-blue-600"
              >
                Use default message
              </button>
            )}
          </div>
          <p
            className="text-xs mt-2"
            style={{ color: colors.text.secondary }}
          >
            This message will be sent to our WhatsApp: +91 8807423228
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-medium transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              color: colors.text.secondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.background.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background.primary;
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 py-3 rounded-xl font-bold transition-colors duration-200 flex items-center justify-center gap-2"
            style={{
              backgroundColor: "#25D366",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#20BA5A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#25D366";
            }}
          >
            <LucideIcons.MessageCircle size={20} />
            Send via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
