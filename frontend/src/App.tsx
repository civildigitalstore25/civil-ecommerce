import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  );
}

export default App;
