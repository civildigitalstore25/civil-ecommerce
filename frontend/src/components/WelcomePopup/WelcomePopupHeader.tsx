type WelcomePopupHeaderMode = "form" | "success";

const COPY: Record<
  WelcomePopupHeaderMode,
  { title: string; subtitle: string }
> = {
  form: {
    title: "Welcome to Our Store!",
    subtitle: "Fill this form to get discount",
  },
  success: {
    title: "Congratulations!",
    subtitle: "Your discount code is ready",
  },
};

export function WelcomePopupHeader({ mode }: { mode: WelcomePopupHeaderMode }) {
  const { title, subtitle } = COPY[mode];
  return (
    <div className="welcome-popup-header">
      <img
        src="/whitelogo.png"
        alt="Store Logo"
        className="welcome-popup-logo"
      />
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}
