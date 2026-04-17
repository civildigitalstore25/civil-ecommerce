import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function FooterNavLink({
  to,
  children,
  footerTextPrimary,
  footerTextSecondary,
}: {
  to: string;
  children: ReactNode;
  footerTextPrimary: string;
  footerTextSecondary: string;
}) {
  return (
    <Link
      to={to}
      className="transition-colors duration-200 hover:underline"
      style={{ color: footerTextSecondary }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = footerTextPrimary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = footerTextSecondary;
      }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      {children}
    </Link>
  );
}
