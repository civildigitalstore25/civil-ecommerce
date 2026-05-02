import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import HeroSection from "../ui/home/HeroSection";
import HomeProducts from "../ui/home/HomeProducts";
import MarqueeBanner from "../ui/home/MarqueeBanner";
import Reviews from "../ui/home/Reviews";
import WhyChooseUs from "../ui/home/WhyChooseUs";
import LatestBlogsCarousel from "../ui/home/LatestBlogsCarousel";
import BestSellingCarousel from "../ui/home/BestSellingCarousel";
import LatestArrivalsCarousel from "../ui/home/LatestArrivalsCarousel";
import FreeProductsSection from "../ui/home/FreeProductsSection";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { getHomeSEO, buildCanonicalUrl } from "../utils/seo";
import DealsPage from "./Deals";
import { useActiveDeals } from "../api/dealsApi";

const HomePage: React.FC = () => {
  const { colors } = useAdminTheme();
  const { pathname } = useLocation();
  const seoData = getHomeSEO();
  const { data: dealsData } = useActiveDeals();
  const hasDeals = (dealsData?.deals || []).length > 0;

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonicalUrl(pathname)} />
        <link rel="canonical" href={buildCanonicalUrl(pathname)} />
      </Helmet>

      <div
        className="flex flex-col min-h-screen transition-colors duration-200"
        style={{ backgroundColor: colors.background.primary }}
      >
        {/* Header */}

        {/* Main Content */}
        <main className="flex-grow pt-20">
          <section>
            <MarqueeBanner />
          </section>

          <section className="px-4 sm:px-6 lg:px-8">
            <HeroSection />
          </section>

          {/* Shop by Category - Mobile Only (commented out for now, will be used later) */}
          {/* <section
          className="px-2 sm:px-6 lg:hidden py-6 transition-colors duration-200"
          style={{
            background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
          }}
        >
          <div
            className="rounded-lg transition-colors duration-200"
            style={{
              background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
            }}
          >
            <MobileShopByCategory />
          </div>
        </section> */}

          <section className="px-4 sm:px-6 lg:px-8">
            <LatestArrivalsCarousel />
          </section>

          <section className="px-4 sm:px-6 lg:px-8">
            <HomeProducts />
          </section>

          <section className="px-4 sm:px-6 lg:px-8">
            <FreeProductsSection />
          </section>

          <section className="px-4 sm:px-6 lg:px-8">
            <BestSellingCarousel />
          </section>



          <section className="px-4 sm:px-6 lg:px-8">
            <LatestBlogsCarousel />
          </section>

          {hasDeals && (
            <section className="px-4 sm:px-6 lg:px-8">
              <DealsPage />
            </section>
          )}


          <section className="px-4 sm:px-6 lg:px-8">
            <Reviews />
          </section>
          <section className="px-4 sm:px-6 lg:px-8">
            <WhyChooseUs />
          </section>
        </main>
      </div>
    </>
  );
};

export default HomePage;
