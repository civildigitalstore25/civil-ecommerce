import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./contexts/CartContext";
import { AdminThemeProvider } from "./contexts/AdminThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import Header from "./components/Header/Header";
import Products from "./ui/admin/products/Products";
import AdminDashboard from "./ui/admin/AdminDashboard";
import SignupPage from "./pages/auth/SignupPage";
import SigninPage from "./pages/auth/SigninPage";
import AuthCallbackPage from "./pages/auth/AuthCallbackPage";
import ProfilePage from "./ui/profile/ProfilePage";
import { Orders, Categories, Companies, Dashboard } from "./ui/admin";
import BrandCategoryListing from "./pages/BrandCategoryListing";
import BrandSubcategoriesPage from "./pages/BrandSubcategoriesPage";
import AllProductsPage from "./pages/AllProductsPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import AuthGuard from "./components/Auth/AuthGuard";
import PublicRoute from "./components/Auth/PublicRoute";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import PasswordResetPage from "./pages/auth/PasswordResetPage";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";
import Disclaimer from "./ui/policy/Disclaimer";
import ReturnPolicy from "./ui/policy/ReturnPolicy";
import TermsAndConditions from "./ui/policy/TermsAndConditions";
import PrivacyPolicy from "./ui/policy/PrivacyPolicy";
import ShippingPolicy from "./ui/policy/ShippingPolicy";
import ContactPage from "./pages/ContactPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentCallback from "./ui/payment/PaymentCallback";
import MyOrdersPage from "./pages/MyOrdersPage";
import SCrm from "./components/SCrm";
import AdobeCloudPage from "./pages/adobecloudpage";
import AboutPage from "./pages/AboutPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminAdminsPage from "./pages/SuperAdminAdminsPage";

import AdminMenu from "./components/AdminMenu";
import SuperAdminCreateAdminPage from "./pages/SuperAdminCreateAdminPage";

const queryClient = new QueryClient();

function AppLayout() {
  const location = useLocation();

  // Define routes where you don't want the Header
  const hideHeaderRoutes = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/scrm",
    "/adobe-cloud",
  ];

  const shouldHideHeader = hideHeaderRoutes.some(
    (route) =>
      location.pathname === route ||
      location.pathname.startsWith("/reset-password/"),
  );

  return (
    <>
      {!shouldHideHeader && <Header />}
      {/* Removed AdminMenu component as per request - no create admin menu needed below header */}
      <Routes>
          {/* Superadmin routes */}
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/admins" element={<SuperAdminAdminsPage />} />
          <Route path="/superadmin/create-admin" element={<SuperAdminCreateAdminPage />} />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SigninPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <PasswordResetPage />
            </PublicRoute>
          }
        />

        {/* Auth callback (public) */}
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* SCRM Landing Page */}
        <Route path="/scrm" element={<SCrm />} />
        <Route path="/adobe-cloud" element={<AdobeCloudPage />} />
        <Route path="/about-us" element={<AboutPage />} />

        {/* Home page is public */}
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <ProfilePage />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AuthGuard>
              <Products />
            </AuthGuard>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AuthGuard>
              <Orders />
            </AuthGuard>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AuthGuard>
              <Categories />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <AuthGuard>
              <Companies />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/products"
          element={
              <AllProductsPage />
          }
        />
        <Route
          path="/category"
          element={
              <BrandCategoryListing />
          }
        />
        <Route
          path="/product/:slug"
          element={
            <ProductDetail />
          }
        />
        <Route
          path="/cart"
          element={
            <AuthGuard>
              <CartPage />
            </AuthGuard>
          }
        />
        <Route
          path="/autodesk"
          element={
              <BrandSubcategoriesPage />
          }
        />
        <Route
          path="/microsoft"
          element={
              <BrandSubcategoriesPage />
          }
        />
        <Route
          path="/adobe"
          element={
              <BrandSubcategoriesPage />
          }
        />
        <Route
          path="/antivirus"
          element={
              <BrandSubcategoriesPage />
          }
        />

        <Route
          path="/checkout"
          element={
            <AuthGuard>
              <CheckoutPage />
            </AuthGuard>
          }
        />
        <Route
          path="/my-orders"
          element={
            <AuthGuard>
              <MyOrdersPage />
            </AuthGuard>
          }
        />
        <Route path="/contact" element={<ContactPage />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
      </Routes>
      {!shouldHideHeader && <Footer />}
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
