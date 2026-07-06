import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ScrollToTop } from "../../components/common/ScrollToTop";
import { VyaparHeader } from "../../components/vyapar/VyaparHeader";
import { VyaparHeroSection } from "../../components/vyapar/VyaparHeroSection";
import { VyaparFeaturesSection } from "../../components/vyapar/VyaparFeaturesSection";
import { VyaparPricingSection } from "../../components/vyapar/VyaparPricingSection";
import { VyaparTestimonialsSection } from "../../components/vyapar/VyaparTestimonialsSection";
import { VyaparFaqSection } from "../../components/vyapar/VyaparFaqSection";
import { VyaparFooter } from "../../components/vyapar/VyaparFooter";
import { VyaparStickyCta } from "../../components/vyapar/VyaparStickyCta";
import { VyaparRegistrationModal } from "../../components/vyapar/VyaparRegistrationModal";

export default function VyaparOfferPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Auto-open modal 1.5 s after the user lands on the Vyapar page
  useEffect(() => {
    const timer = setTimeout(openModal, 1500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>
          Vyapar – Free GST Billing &amp; Accounting Software | SoftZCart Offer
        </title>
        <meta
          name="description"
          content="Complete invoicing, accounting and billing software trusted by 1 Crore+ businesses. Get Vyapar desktop and mobile plans on SoftZCart."
        />
      </Helmet>

      <div className="min-h-screen bg-white pb-24 font-sans text-[#1B1B2F] sm:pb-28">
        <VyaparHeader />
        <VyaparHeroSection onOpenModal={openModal} />
        <VyaparFeaturesSection />
        <VyaparPricingSection />
        <VyaparTestimonialsSection />
        <VyaparFaqSection />
        <VyaparFooter />
        <VyaparStickyCta onOpenModal={openModal} />
        <ScrollToTop />
      </div>

      <VyaparRegistrationModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

