import { useState, useEffect } from "react";

function isLoggedIn(): boolean {
  try {
    return !!localStorage.getItem("token");
  } catch {
    return false;
  }
}

export function useAppWelcomePopup(pathname: string) {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("welcomePopupDismissed");
  }, []);

  useEffect(() => {
    const hasSubmitted = localStorage.getItem("welcomePopupCompleted");
    const hasDismissed = sessionStorage.getItem("welcomePopupDismissed");
    const userIsLoggedIn = isLoggedIn();
    const isOnLandingPage = pathname === "/";

    if (!userIsLoggedIn && !hasSubmitted && !hasDismissed && isOnLandingPage) {
      const timer = setTimeout(() => setShowWelcomePopup(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleCloseWelcomePopup = () => {
    setShowWelcomePopup(false);
    sessionStorage.setItem("welcomePopupDismissed", "true");
  };

  return { showWelcomePopup, handleCloseWelcomePopup };
}
