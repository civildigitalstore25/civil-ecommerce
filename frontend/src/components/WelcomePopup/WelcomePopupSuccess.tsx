import { formatWelcomeCouponValidUntil } from "./welcomePopupFormat";

interface WelcomePopupSuccessProps {
  email: string;
  discountCode: string;
  discountValue: number;
  validUntil: Date | null;
  isCopied: boolean;
  onCopyCode: () => void;
  onShopNow: () => void;
}

export function WelcomePopupSuccess({
  email,
  discountCode,
  discountValue,
  validUntil,
  isCopied,
  onCopyCode,
  onShopNow,
}: WelcomePopupSuccessProps) {
  return (
    <div className="welcome-popup-content">
      <div className="welcome-success-content">
        <p className="welcome-success-message">
          We&apos;ve sent this code to your email at <strong>{email}</strong>
        </p>

        <div className="welcome-coupon-display">
          <div className="welcome-coupon-label">Your Discount Code</div>
          <div className="welcome-coupon-code-wrapper">
            <div className="welcome-coupon-code">{discountCode}</div>
            <button
              type="button"
              className={`welcome-copy-btn ${isCopied ? "copied" : ""}`}
              onClick={onCopyCode}
            >
              {isCopied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div className="welcome-discount-badge">{discountValue}% OFF</div>
          <div className="welcome-coupon-info">
            <p style={{ margin: "5px 0" }}>
              ✅ Valid until:{" "}
              <strong>{formatWelcomeCouponValidUntil(validUntil)}</strong>
            </p>
            <p style={{ margin: "5px 0" }}>✅ One-time use only</p>
            <p style={{ margin: "5px 0" }}>✅ Apply at checkout</p>
          </div>
        </div>

        <button
          type="button"
          className="welcome-shop-now-btn"
          onClick={onShopNow}
        >
          Start Shopping Now 🛍️
        </button>
      </div>
    </div>
  );
}
