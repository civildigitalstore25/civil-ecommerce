import { Routes, Route, Navigate } from "react-router-dom";
import Products from "../ui/admin/products/Products";
import AdminDashboard from "../ui/admin/AdminDashboard";
import SignupPage from "../pages/auth/SignupPage";
import SigninPage from "../pages/auth/SigninPage";
import AuthCallbackPage from "../pages/auth/AuthCallbackPage";
import ProfilePage from "../ui/profile/ProfilePage";
import { Orders, Categories, Companies, Dashboard } from "../ui/admin";
import BrandCategoryListing from "../pages/BrandCategoryListing";
import BrandSubcategoriesPage from "../pages/BrandSubcategoriesPage";
import AllProductsPage from "../pages/AllProductsPage";
import ProductDetail from "../pages/ProductDetail";
import CartPage from "../pages/CartPage";
import AuthGuard from "../components/Auth/AuthGuard";
import PublicRoute from "../components/Auth/PublicRoute";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import PasswordResetPage from "../pages/auth/PasswordResetPage";
import HomePage from "../pages/HomePage";
import Disclaimer from "../ui/policy/Disclaimer";
import ReturnPolicy from "../ui/policy/ReturnPolicy";
import TermsAndConditions from "../ui/policy/TermsAndConditions";
import PrivacyPolicy from "../ui/policy/PrivacyPolicy";
import ShippingPolicy from "../ui/policy/ShippingPolicy";
import ContactPage from "../pages/ContactPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentCallback from "../ui/payment/PaymentCallback";
import PaymentStatusPage from "../pages/PaymentStatusPage";
import MyOrdersPage from "../pages/MyOrdersPage";
import UserEnquiriesPage from "../pages/userEnquiries/UserEnquiriesPage";
import SCrm from "../components/SCrm";
import AdobeCloudPage from "../pages/adobecloudpage";
import AboutPage from "../pages/AboutPage";
import HowToPurchase from "../pages/HowToPurchase";
import PaymentMethod from "../pages/PaymentMethod";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import SuperAdminAdminsPage from "../pages/SuperAdminAdminsPage";
import SuperAdminCreateAdminPage from "../pages/SuperAdminCreateAdminPage";
import MenuManagement from "../components/admins/MenuManagement";
import SitemapPage from "../pages/SitemapPage";
import DealsPage from "../pages/Deals";
import BlogListPage from "../pages/BlogListPage";
import BlogDetailPage from "../pages/BlogDetailPage";
import AdminBlogList from "../pages/AdminBlogList";
import AdminBlogForm from "../pages/AdminBlogForm";
import PartnerProgram from "../pages/PartnerProgram";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/superadmin" element={<SuperAdminDashboard />} />
      <Route path="/superadmin/admins" element={<SuperAdminAdminsPage />} />
      <Route path="/superadmin/create-admin" element={<SuperAdminCreateAdminPage />} />

      <Route
        path="/admin/menus"
        element={
          <AuthGuard>
            <MenuManagement />
          </AuthGuard>
        }
      />
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

      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/scrm" element={<SCrm />} />
      <Route path="/adobe-cloud" element={<AdobeCloudPage />} />
      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/" element={<HomePage />} />

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
      <Route path="/products" element={<AllProductsPage />} />
      <Route path="/category" element={<BrandCategoryListing />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route
        path="/cart"
        element={
          <AuthGuard>
            <CartPage />
          </AuthGuard>
        }
      />
      <Route path="/autodesk" element={<BrandSubcategoriesPage />} />
      <Route path="/microsoft" element={<BrandSubcategoriesPage />} />
      <Route path="/adobe" element={<BrandSubcategoriesPage />} />
      <Route path="/antivirus" element={<BrandSubcategoriesPage />} />
      <Route path="/projects" element={<BrandSubcategoriesPage />} />
      <Route path="/brand/:brand/:category" element={<BrandCategoryListing />} />
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
      <Route
        path="/my-enquiries"
        element={
          <AuthGuard>
            <UserEnquiriesPage />
          </AuthGuard>
        }
      />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/deals" element={<DealsPage />} />
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route
        path="/admin/blogs"
        element={
          <AuthGuard>
            <AdminBlogList />
          </AuthGuard>
        }
      />
      <Route
        path="/admin/blogs/create"
        element={
          <AuthGuard>
            <AdminBlogForm />
          </AuthGuard>
        }
      />
      <Route
        path="/admin/blogs/edit/:id"
        element={
          <AuthGuard>
            <AdminBlogForm />
          </AuthGuard>
        }
      />
      <Route path="/how-to-purchase" element={<HowToPurchase />} />
      <Route path="/payment-method" element={<PaymentMethod />} />
      <Route path="/sitemap" element={<SitemapPage />} />
      <Route path="/payment-status" element={<PaymentStatusPage />} />
      <Route path="/payment/callback" element={<PaymentCallback />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="/return-policy" element={<ReturnPolicy />} />
      <Route path="/shipping-policy" element={<ShippingPolicy />} />
      <Route path="/partner-program" element={<PartnerProgram />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}
