import React from "react";
import HeaderSection from "./components/Header";
import HeroSection from "./components/Hero";
import FAQ from "./sections/FAQ";
import Pricing from "./sections/Pricing";
import Review from "./sections/Reviews";
import DemoVideoSection from "./sections/DemoVideo";
import BonusesSection from "./sections/Bonuses";
import Features from "./sections/Features";

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
  </div>
);

export default SCrm;
