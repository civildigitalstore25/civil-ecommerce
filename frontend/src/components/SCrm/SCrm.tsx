import React from "react";
import HeaderSection from "../../ui/ScrmSection/HeaderSection";
import HeroSection from "../../ui/ScrmSection/HeroSection";
import FAQ from "../../ui/ScrmSection/FAQ";
import Pricing from "../../ui/ScrmSection/Pricing";
import Review from "../../ui/ScrmSection/Review";
import DemoVideoSection from "./DemoVideoSection";


const SCrm: React.FC = () => (
  <div className="min-h-screen bg-black text-white">
    <HeaderSection />
    <HeroSection />
    <DemoVideoSection />
    <Pricing />
     <Review />
    <FAQ />
  </div>
);

export default SCrm;
