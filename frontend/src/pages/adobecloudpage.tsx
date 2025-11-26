import React from 'react';
import AdobeHeader from '../components/layout/AdobeHeader';
import AdobeFooter from '../components/layout/AdobeFooter';
import { HeroSection } from '../components/sections/HeroSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { AllAppsSection } from '../components/sections/AllAppsSection';
import { IncludedAppsSection } from '../components/sections/IncludedAppsSection';
import { PricingSection } from '../components/sections/PricingSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { FAQSection } from '../components/sections/FAQSection';
import { ContactSection } from '../components/sections/ContactSection';
import { ScrollToTop } from '../components/common/ScrollToTop';

const AdobeCloudPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pt-16 sm:pt-20">
            <AdobeHeader />
            <HeroSection />
            <FeaturesSection />
            <AllAppsSection />
            <IncludedAppsSection />
            {/* <CreativeCloudLogoSection /> */}
            <PricingSection />
            <TestimonialsSection />
            <FAQSection />
            <ContactSection />
            <AdobeFooter />
            <ScrollToTop />
        </div>
    );
};

export default AdobeCloudPage;