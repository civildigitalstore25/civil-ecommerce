import React, { useState } from "react";
import { useAdminTheme } from "../../../../contexts/AdminThemeContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "Demo Video", href: "#demo" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQs", href: "#faq" },
];

const HeaderSection: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { colors } = useAdminTheme();

  const handleNavClick = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      id="top"
      className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-800/50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); window.location.href = "/"; }} 
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <img 
              src="/whitelogo.png" 
              alt="Logo" 
              className="h-10 w-auto sm:h-12 object-contain" 
              style={{ cursor: 'pointer' }}
            />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ 
                color: colors.text.primary,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.interactive.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "white";
              }}
            >
              {item.label}
            </button>
          ))}

          <button 
            className="rounded-xl px-4 py-2 font-semibold text-slate-900 transition hover:-translate-y-0.5"
            style={{ backgroundColor: colors.text.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.interactive.primaryHover || colors.interactive.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.interactive.primary;
            }}
          >
            Get Started
          </button>
        </nav>

        <button
          className="rounded-full border border-white/20 p-2 text-white lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-4 py-4 text-white lg:hidden">
          <div className="flex flex-col items-center gap-10 py-10 px-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-center text-lg text-white/80"
              >
                {item.label}
              </button>
            ))}
            <button 
              className="rounded-full px-8 py-3 text-base font-semibold text-slate-900"
              style={{ backgroundColor: colors.interactive.primary }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderSection;

