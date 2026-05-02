import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { buildCanonicalUrl } from "../../utils/seo";
import type { ThemeColors, ThemeMode } from "../../contexts/AdminThemeContext";

interface ContactSeoShape {
  title: string;
  description: string;
  keywords: string;
}

interface ContactPageLayoutProps {
  seoData: ContactSeoShape;
  colors: ThemeColors;
  theme: ThemeMode;
  children: ReactNode;
}

export function ContactPageLayout({
  seoData,
  colors,
  theme,
  children,
}: ContactPageLayoutProps) {
  const { pathname } = useLocation();
  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={buildCanonicalUrl(pathname)} />
      </Helmet>
      <div
        className="min-h-[calc(100vh-120px)] p-6 md:p-10 pt-20 relative mt-20"
        style={{
          backgroundColor:
            theme === "light" ? "#F5F7FA" : colors.background.primary,
        }}
      >
        <div
          className="mx-auto max-w-6xl rounded-xl shadow-xl overflow-hidden"
          style={{
            backgroundColor:
              theme === "light" ? "#fff" : colors.background.secondary,
            border: `1px solid ${
              theme === "light" ? "#E2E8F0" : colors.border.primary
            }`,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
