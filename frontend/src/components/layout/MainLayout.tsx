import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LeftSidebar from "../LeftSidebar";
import MobileBottomNav from "../MobileBottomNav/MobileBottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Routes where sidebar should be hidden
  const hideSidebarRoutes = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/admin-dashboard",
    "/admin/products",
    "/profile",
    "/checkout",
    "/payment",
    "/scrm",
    "/adobe-cloud",
    "/superadmin",
  ];

  const shouldHideSidebar = hideSidebarRoutes.some(
    (route) =>
      location.pathname === route ||
      location.pathname.startsWith("/reset-password/") ||
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/checkout") ||
      location.pathname.startsWith("/payment") ||
      location.pathname.startsWith("/superadmin")
  );

  if (shouldHideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Toggleable on both mobile and desktop */}
      <LeftSidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(false)}
      />

      {/* Main Content - Add bottom padding on mobile for nav bar */}
      <main className="flex-1 w-full lg:w-auto transition-all duration-300 pb-16 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onMenuToggle={() => setIsSidebarOpen(true)} />
    </div>
  );
};

export default MainLayout;
