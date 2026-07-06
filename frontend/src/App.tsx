import { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostHogProvider } from "./components/providers/PostHogProvider";
import { CartProvider } from "./contexts/CartContext";
import { AdminThemeProvider } from "./contexts/AdminThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import Header from "./components/Header/Header";
import MainLayout from "./components/layout/MainLayout";
import Footer from "./components/Footer/Footer";
import { usePageTracking } from "./hooks/usePageTracking";
import { AppRoutes } from "./app/AppRoutes";

const queryClient = new QueryClient();

const hideHeaderRoutes = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/scrm",
  "/adobe-cloud",
  "/vyapar",
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

  return (
    <>
      {!shouldHideHeader && <Header />}
      <MainLayout>
        <AppRoutes />
        {!shouldHideHeader && <Footer />}
      </MainLayout>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <PostHogProvider>
          <AdminThemeProvider>
            <CurrencyProvider>
              <CartProvider>
                <Router>
                  <AppLayout />
                </Router>
              </CartProvider>
            </CurrencyProvider>
          </AdminThemeProvider>
        </PostHogProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
