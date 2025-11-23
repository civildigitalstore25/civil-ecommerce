import React from "react";
import HeaderSection from "./components/Header";
import HeroSection from "./components/Hero";
import FAQ from "./sections/FAQ";
import Pricing from "./sections/Pricing";
import Review from "./sections/Reviews";
import DemoVideoSection from "./sections/DemoVideo";
import BonusesSection from "./sections/Bonuses";
import Features from "./sections/Features";
import StickyCTAButton from "./components/StickyCTA";

const SCrm: React.FC = () => (
  <div className="min-h-screen bg-black text-white pb-24">
    <HeaderSection />
    <HeroSection />
    <DemoVideoSection />
    <BonusesSection />
    <Pricing />
    <Features />
    <Review />
    <FAQ />
    <StickyCTAButton />
  </div>
);

export default SCrm;
