import Swal from "sweetalert2";

export const showCouponSuccess = (couponData: any, discountAmount: number) => {
  Swal.fire({
    icon: "success",
    title: "Coupon Applied Successfully!",
    html: `
      <div style="text-align: left; margin-top: 10px;">
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="color: #065f46; font-size: 16px;">Coupon Code:</strong>
            <span style="font-family: monospace; background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; font-weight: bold;">${couponData.code}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #065f46;">Offer:</span>
            <span style="color: #065f46; font-weight: 600;">${couponData.name}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #065f46;">Discount:</span>
            <span style="color: #10b981; font-weight: bold; font-size: 18px;">
              ${couponData.discountType === 'Percentage' ? `${couponData.discountValue}%` : `₹${couponData.discountValue}`}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #065f46;">You Save:</span>
            <span style="color: #10b981; font-weight: bold; font-size: 18px;">₹${discountAmount.toFixed(2)}</span>
          </div>
          ${couponData.eligibleSubtotal != null ? `
          <div style="margin-top: 8px; font-size: 13px; color: #047857;">
            Applied to selected product(s) in your cart.
          </div>
          ` : ''}
        </div>
      </div>
    `,
    confirmButtonText: "Continue",
    confirmButtonColor: "#10b981",
    timer: 5000,
    timerProgressBar: true,
  });
};

export const showCouponError = (errorMessage: string, code: string) => {
  let icon: "error" | "warning" | "info" = "error";
  let title = "Coupon Invalid";
  let iconColor = "#ef4444";
  let bgColor = "#fef2f2";
  let borderColor = "#ef4444";

  if (errorMessage.includes("usage limit reached") || errorMessage.includes("validity expired")) {
    icon = "warning";
    title = "Coupon Limit Reached";
    iconColor = "#f59e0b";
    bgColor = "#fffbeb";
    borderColor = "#f59e0b";
  } else if (errorMessage.includes("expired")) {
    icon = "info";
    title = "Coupon Expired";
    iconColor = "#3b82f6";
    bgColor = "#eff6ff";
    borderColor = "#3b82f6";
  } else if (errorMessage.includes("not yet valid")) {
    icon = "info";
    title = "Coupon Not Yet Active";
    iconColor = "#8b5cf6";
    bgColor = "#f5f3ff";
    borderColor = "#8b5cf6";
  } else if (errorMessage.includes("no longer active") || errorMessage.includes("Inactive")) {
    icon = "warning";
    title = "Coupon Validity Expired";
    iconColor = "#f59e0b";
    bgColor = "#fffbeb";
    borderColor = "#f59e0b";
  }

  Swal.fire({
    icon: icon,
    title: title,
    html: `
      <div style="text-align: left; margin-top: 10px;">
        <div style="background: ${bgColor}; padding: 15px; border-radius: 8px; border-left: 4px solid ${borderColor}; margin-bottom: 15px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <span style="font-size: 24px;">${icon === "error" ? "❌" : icon === "warning" ? "⚠️" : "ℹ️"}</span>
            <strong style="color: ${iconColor === "#ef4444" ? "#991b1b" : iconColor === "#f59e0b" ? "#92400e" : "#1e40af"}; font-size: 16px;">${errorMessage}</strong>
          </div>
          ${code ? `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; border-radius: 6px;">
            <span style="color: #6b7280;">Entered Code:</span>
            <span style="font-family: monospace; background: #e5e7eb; color: #374151; padding: 4px 12px; border-radius: 6px; font-weight: bold;">${code}</span>
          </div>
          ` : ""}
        </div>
        <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; text-align: center; font-size: 14px; color: #4b5563;">
          💡 <strong>Tip:</strong> Check the coupon code and try again, or browse our active offers.
        </div>
      </div>
    `,
    confirmButtonText: "Try Another Code",
    confirmButtonColor: iconColor,
    showCancelButton: true,
    cancelButtonText: "Close",
    cancelButtonColor: "#6b7280",
  });
};

export const showCouponMissingError = () => {
  Swal.fire({
    icon: "warning",
    title: "Missing Coupon Code",
    html: `
      <div style="text-align: left; margin-top: 10px;">
        <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 15px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">⚠️</span>
            <strong style="color: #92400e; font-size: 16px;">Please enter a coupon code</strong>
          </div>
        </div>
        <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; text-align: center; font-size: 14px; color: #4b5563;">
          💡 Enter your coupon code in the field above to apply discount.
        </div>
      </div>
    `,
    confirmButtonText: "OK",
    confirmButtonColor: "#f59e0b",
  });
};

export const showCouponConnectionError = (onRetry?: () => void) => {
  Swal.fire({
    icon: "error",
    title: "Connection Error",
    html: `
      <div style="text-align: left; margin-top: 10px;">
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 15px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <span style="font-size: 24px;">🔌</span>
            <strong style="color: #991b1b; font-size: 16px;">Unable to validate coupon</strong>
          </div>
          <p style="color: #7f1d1d; margin: 0;">Please check your internet connection and try again.</p>
        </div>
        <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; text-align: center; font-size: 14px; color: #4b5563;">
          🔄 If the problem persists, please refresh the page or contact support.
        </div>
      </div>
    `,
    confirmButtonText: "Retry",
    confirmButtonColor: "#ef4444",
    showCancelButton: true,
    cancelButtonText: "Close",
    cancelButtonColor: "#6b7280",
  }).then((result) => {
    if (result.isConfirmed && onRetry) {
      onRetry();
    }
  });
};
