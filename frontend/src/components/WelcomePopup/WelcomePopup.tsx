import React from "react";
import "./WelcomePopup.css";
import { useWelcomePopup } from "./useWelcomePopup";
import { WelcomePopupHeader } from "./WelcomePopupHeader";
import { WelcomePopupForm } from "./WelcomePopupForm";
import { WelcomePopupSuccess } from "./WelcomePopupSuccess";

interface WelcomePopupProps {
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
  const w = useWelcomePopup(onClose);

  return (
    <div className="welcome-popup-overlay" onClick={w.handleOverlayClick}>
      <div className="welcome-popup">
        {!w.isSuccess && (
          <button
            type="button"
            className="welcome-popup-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        )}

        {!w.isSuccess ? (
          <>
            <WelcomePopupHeader mode="form" />
            <WelcomePopupForm
              formData={w.formData}
              errors={w.errors}
              generalError={w.generalError}
              isSubmitting={w.isSubmitting}
              onChange={w.handleChange}
              onSubmit={w.handleSubmit}
            />
          </>
        ) : (
          <>
            <WelcomePopupHeader mode="success" />
            <WelcomePopupSuccess
              email={w.formData.email}
              discountCode={w.discountCode}
              discountValue={w.discountValue}
              validUntil={w.validUntil}
              isCopied={w.isCopied}
              onCopyCode={w.handleCopyCode}
              onShopNow={w.handleShopNow}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomePopup;
