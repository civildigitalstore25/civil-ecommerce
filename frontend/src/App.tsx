import { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "posthog-js/react";
import { CartProvider } from "./contexts/CartContext";
import { AdminThemeProvider } from "./contexts/AdminThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import Header from "./components/Header/Header";
import MainLayout from "./components/layout/MainLayout";
import WelcomePopup from "./components/WelcomePopup/WelcomePopup";
import Footer from "./components/Footer/Footer";
import { usePageTracking } from "./hooks/usePageTracking";
import { AppRoutes } from "./app/AppRoutes";
import { useAppWelcomePopup } from "./app/useAppWelcomePopup";

const queryClient = new QueryClient();

const hideHeaderRoutes = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/scrm",
  "/adobe-cloud",
];

function AppLayout() {
  const location = useLocation();
  usePageTracking();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  const shouldHideHeader = hideHeaderRoutes.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith("/reset-password/"),
  );

  const { showWelcomePopup, handleCloseWelcomePopup } = useAppWelcomePopup(
    location.pathname,
  );

  return (
    <>
      {!shouldHideHeader && <Header />}
      {showWelcomePopup && <WelcomePopup onClose={handleCloseWelcomePopup} />}
      <MainLayout>
        <AppRoutes />
        {!shouldHideHeader && <Footer />}
      </MainLayout>
    </>
  );
}

function App() {
  return (
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{ api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST }}
    >
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AdminThemeProvider>
            <CurrencyProvider>
              <CartProvider>
                <Router>
                  <AppLayout />
                </Router>
              </CartProvider>
            </CurrencyProvider>
          </AdminThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </PostHogProvider>
  );
}

export default App;
