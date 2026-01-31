import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import LeftSidebar from "../LeftSidebar";
import MobileBottomNav from "../MobileBottomNav/MobileBottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Sidebar is open by default on desktop, closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Routes where sidebar should be completely hidden (auth pages, special landing pages, and homepage)
  const hideSidebarRoutes = [
    "/",
    "/signin",
    "/signup",
    "/forgot-password",
    "/scrm",
    "/adobe-cloud",
  ];

  const shouldHideSidebar = hideSidebarRoutes.some(
    (route) =>
      location.pathname === route ||
      location.pathname.startsWith("/reset-password/")
  );

  // For pages without sidebar (auth pages), still show mobile nav
  if (shouldHideSidebar) {
    return (
      <>
        {/* Main Content - Add bottom padding on mobile for nav bar */}
        <div className="pb-16 lg:pb-0">
          {children}
        </div>
        {/* Mobile Bottom Navigation - Always visible */}
        <MobileBottomNav onMenuToggle={() => setIsSidebarOpen(true)} />
      </>
    );
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Left Sidebar - Visible by default, toggleable */}
      <LeftSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Floating Toggle Button - Only visible on desktop when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="
            hidden lg:flex
            fixed bottom-8 left-8
            w-12 h-12
            items-center justify-center
            rounded-full
            shadow-2xl
            hover:shadow-2xl
            hover:scale-110
            transition-all duration-300
            z-40
            bg-blue-600 hover:bg-blue-700
          "
          title="Open sidebar"
        >
          <ChevronRight className="w-6 h-6 text-white font-bold" strokeWidth={3} />
        </button>
      )}

      {/* Main Content - Adapts width based on sidebar state */}
      <main
        className={`
          flex-1 w-full transition-all duration-300 pb-16 lg:pb-0
          ${isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}
        `}
        style={{
          width: isSidebarOpen ? 'calc(100% - 320px)' : '100%',
        }}
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onMenuToggle={() => setIsSidebarOpen(true)} />
    </div>
  );
};

export default MainLayout;
