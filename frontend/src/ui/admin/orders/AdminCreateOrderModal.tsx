import React from "react";
import { Package, X, CheckCircle } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import CreateOrderCustomerSection from "./CreateOrderCustomerSection";
import CreateOrderItemsSection from "./CreateOrderItemsSection";
import CreateOrderNotesSummarySection from "./CreateOrderNotesSummarySection";
import type { AdminCreateOrderFormApi } from "./useAdminOrderCreateForm";

type Props = {
  colors: ThemeColors;
  theme: "light" | "dark";
  form: AdminCreateOrderFormApi;
};

const AdminCreateOrderModal: React.FC<Props> = ({ colors, theme, form }) => {
  const {
    setShowCreateForm,
    orderForm,
    setOrderForm,
    handleRemoveOrderItem,
    handleOrderItemChange,
    createOrderMutation,
    submitCreateOrder,
    validateAndAddProduct,
  } = form;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={() => setShowCreateForm(false)}
    >
      <div
        className="rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto create-order-panel"
        style={{ backgroundColor: colors.background.secondary }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          .create-order-panel input::placeholder,
          .create-order-panel textarea::placeholder {
            color: ${theme === "dark" ? "rgba(255,255,255,0.45)" : "rgba(107,114,128,0.6)"} !important;
          }
          .create-order-panel input:focus,
          .create-order-panel textarea:focus,
          .create-order-panel select:focus {
            border-color: #0068ff !important;
            box-shadow: 0 0 0 3px rgba(0, 104, 255, 0.1) !important;
          }
          .create-order-panel .product-item-card {
            transition: all 0.2s ease;
          }
          .create-order-panel .product-item-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
        `}</style>

        <div
          className="sticky top-0 z-10 p-6 border-b flex items-center justify-between"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div>
            <h3
              className="text-2xl font-bold flex items-center gap-2"
              style={{ color: colors.text.primary }}
            >
              <Package className="w-6 h-6" style={{ color: "#0068ff" }} />
              Create New Order
            </h3>
            <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
              Fill in the details below to create a new order manually
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm(false)}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-all duration-200"
            style={{ backgroundColor: colors.background.accent }}
          >
            <X className="w-6 h-6" style={{ color: colors.text.primary }} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <CreateOrderCustomerSection colors={colors} orderForm={orderForm} setOrderForm={setOrderForm} />
          <CreateOrderItemsSection
            colors={colors}
            orderForm={orderForm}
            onRemoveItem={handleRemoveOrderItem}
            onItemChange={handleOrderItemChange}
            onAddProductClick={validateAndAddProduct}
          />
          <CreateOrderNotesSummarySection colors={colors} orderForm={orderForm} setOrderForm={setOrderForm} />
        </div>

        <div
          className="sticky bottom-0 p-6 border-t flex justify-end gap-3"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <button
            type="button"
            className="px-6 py-3 rounded-xl font-medium border-2 transition-all duration-200 hover:bg-opacity-10"
            style={{
              borderColor: colors.border.primary,
              color: colors.text.primary,
              backgroundColor: "transparent",
            }}
            onClick={() => setShowCreateForm(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#0068ff", color: "#fff" }}
            onClick={submitCreateOrder}
            disabled={createOrderMutation.status === "pending"}
          >
            {createOrderMutation.status === "pending" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Creating Order...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Create Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateOrderModal;
