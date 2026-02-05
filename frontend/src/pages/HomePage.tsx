import React from "react";
import { Helmet } from "react-helmet";
// import ExclusiveOffers from "../ui/home/ExclusiveOffers";
import HeroSection from "../ui/home/HeroSection";
import HomeProducts from "../ui/home/HomeProducts";
import MarqueeBanner from "../ui/home/MarqueeBanner";
import Reviews from "../ui/home/Reviews";
import WhyChooseUs from "../ui/home/WhyChooseUs";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { getHomeSEO } from "../utils/seo";

const HomePage: React.FC = () => {
  const { colors } = useAdminTheme();
  const seoData = getHomeSEO();

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <div
        className="flex flex-col min-h-screen transition-colors duration-200"
        style={{ backgroundColor: colors.background.primary }}
      >
        {/* Header */}

        {/* Main Content */}
        <main className="flex-grow pt-20">
        <section className="px-4 sm:px-6 lg:px-8">
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
          <HomeProducts />
        </section>

        {/* <section className="px-4 sm:px-6 lg:px-8">
          <ExclusiveOffers />
        </section> */}

        <section className="px-4 sm:px-6 lg:px-8">
          <WhyChooseUs />
        </section>

        <section className="px-4 sm:px-6 lg:px-8">
          <Reviews />
        </section>
      </main>
    </div>
    </>
  );
};

export default HomePage;
