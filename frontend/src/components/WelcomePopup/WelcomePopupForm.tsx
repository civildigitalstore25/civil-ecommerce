import type { WelcomeLeadData } from "../../api/leadApi";
import type { WelcomePopupFieldErrors } from "./welcomePopupTypes";

interface WelcomePopupFormProps {
  formData: WelcomeLeadData;
  errors: WelcomePopupFieldErrors;
  generalError: string;
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function WelcomePopupForm({
  formData,
  errors,
  generalError,
  isSubmitting,
  onChange,
  onSubmit,
}: WelcomePopupFormProps) {
  return (
    <div className="welcome-popup-content">
      <form className="welcome-popup-form" onSubmit={onSubmit}>
        {generalError && (
          <div
            className="welcome-error-message"
            style={{ textAlign: "center", marginBottom: "10px" }}
          >
            {generalError}
          </div>
        )}

        <div className="welcome-form-group">
          <label htmlFor="name">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`welcome-form-input ${errors.name ? "error" : ""}`}
            value={formData.name}
            onChange={onChange}
            placeholder="Enter your full name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <span className="welcome-error-message">{errors.name}</span>
          )}
        </div>

        <div className="welcome-form-group">
          <label htmlFor="email">
            Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`welcome-form-input ${errors.email ? "error" : ""}`}
            value={formData.email}
            onChange={onChange}
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <span className="welcome-error-message">{errors.email}</span>
          )}
        </div>

        <div className="welcome-form-group">
          <label htmlFor="whatsappNumber">
            WhatsApp Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="whatsappNumber"
            name="whatsappNumber"
            className={`welcome-form-input ${errors.whatsappNumber ? "error" : ""}`}
            value={formData.whatsappNumber}
            onChange={onChange}
            placeholder="Enter your WhatsApp number"
            disabled={isSubmitting}
          />
          {errors.whatsappNumber && (
            <span className="welcome-error-message">
              {errors.whatsappNumber}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="welcome-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div
                className="welcome-loading-spinner"
                style={{
                  width: "20px",
                  height: "20px",
                  display: "inline-block",
                  marginRight: "8px",
                  verticalAlign: "middle",
                }}
              />
              Processing...
            </>
          ) : (
            "Submit"
          )}
        </button>

        <p className="welcome-privacy-note">
          Your information is safe with us. We respect your privacy.
        </p>
      </form>
    </div>
  );
}
