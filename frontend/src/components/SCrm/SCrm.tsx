import React from "react";
import HeaderSection from "../../ui/ScrmSection/HeaderSection";
import HeroSection from "../../ui/ScrmSection/HeroSection";
import FAQ from "../../ui/ScrmSection/FAQ";
import DemoVideoSection from "./DemoVideoSection";
// import Pricing from "../../ui/ScrmSection/Pricing";

const SCrm: React.FC = () => (
  <div className="min-h-screen bg-black text-white">
    <HeaderSection />
    <HeroSection />
    <DemoVideoSection />
    {/* <Pricing /> */}
    <FAQ />
  </div>
);

export default SCrm;
