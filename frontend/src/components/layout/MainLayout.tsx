import React, { useState, useEffect } from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
// import { useLocation } from "react-router-dom"; // Removed unused import
import { ChevronRight } from "lucide-react";
import LeftSidebar from "../LeftSidebar";
import MobileBottomNav from "../MobileBottomNav/MobileBottomNav";
import CartSidebar from "../../ui/Cart/CartSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Initialize sidebar state from localStorage, default to false (closed)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    return savedState === 'true';
  });
  // const location = useLocation(); // Removed unused variable

  // Persist sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', String(isSidebarOpen));
  }, [isSidebarOpen]);

  // Set CSS variables globally so components can use CSS var-based classes
  const { colors } = useAdminTheme();
  useEffect(() => {
    try {
      const root = document.documentElement;
      root.style.setProperty('--bg-primary', colors.background.primary);
      root.style.setProperty('--bg-secondary', colors.background.secondary);
      root.style.setProperty('--text-primary', colors.text.primary);
      root.style.setProperty('--text-secondary', colors.text.secondary);
      root.style.setProperty('--border-primary', colors.border.primary);
      root.style.setProperty('--status-error', colors.status.error);
    } catch (e) {
      // ignore in SSR or environments without document
    }
  }, [colors]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Left Sidebar - Available on all pages, closed by default */}
      <LeftSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />

      {/* Floating Toggle Button - Only visible on desktop when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
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
      <MobileBottomNav onMenuToggle={toggleSidebar} />
      {/* Cart Drawer (global) */}
      <CartSidebar />
    </div>
  );
};

export default MainLayout;
