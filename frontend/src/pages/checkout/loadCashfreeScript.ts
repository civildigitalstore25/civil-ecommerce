/** Injects Cashfree JS SDK (v3). Resolves true on load, false on error. */
export function loadCashfreeScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const environment = import.meta.env.VITE_CASHFREE_ENV || "sandbox";
    const scriptSrc =
      environment === "production"
        ? "https://sdk.cashfree.com/js/v3/cashfree.js"
        : "https://sdk.cashfree.com/js/v3/cashfree.js";

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
