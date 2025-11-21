import React, { useState } from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "Demo Video", href: "#demo" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#review" },
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
      className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-slate-950 text-2xl font-black"
            style={{
              background: `linear-gradient(to bottom right, ${colors.interactive.primary}, ${colors.interactive.primaryHover || colors.interactive.primary})`
            }}
          >
            ⚡
          </div>
          <div>
            <p 
              className="text-xs uppercase tracking-[0.35em]"
              style={{ color: colors.interactive.primary }}
            >
              Super CRM
            </p>
            <p className="text-xl font-semibold text-white">
              WhatsApp Growth Suite
            </p>
          </div>
        </div>

      <nav className="hidden items-center gap-6 text-sm text-white/80 lg:flex">
  {navItems.map((item) => (
    <button
      key={item.label}
      onClick={() => handleNavClick(item.href)}
      className="transition"
      style={{ color: "white" }}
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
            style={{ backgroundColor: colors.interactive.primary }}
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

