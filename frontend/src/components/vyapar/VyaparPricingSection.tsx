import React from "react";
import {
  vyaparDesktopPlans,
  vyaparMobilePlans,
} from "./vyaparContent";
import { VyaparPricingCard } from "./VyaparPricingCard";

function PlanGroup({
  title,
  plans,
}: {
  title: string;
  plans: typeof vyaparDesktopPlans;
}) {
  return (
    <div className="mt-12">
      <h3 className="text-center text-xl font-bold text-[#1B1B2F]">{title}</h3>
      <div
        className="mt-6 flex flex-row gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden md:mx-auto md:grid md:max-w-4xl md:grid-cols-2 md:gap-6 md:overflow-visible"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {plans.map((plan) => (
          <VyaparPricingCard key={plan.title} plan={plan} />
        ))}
      </div>
    </div>
  );
}

export function VyaparPricingSection() {
  return (
    <section id="pricing" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-2xl font-bold text-[#1B1B2F] sm:text-3xl">
          Plans &amp; Pricing
        </h2>
        <p className="mt-2 text-gray-600">Free to start, affordable to scale.</p>

        <PlanGroup title="Desktop" plans={vyaparDesktopPlans} />
        <PlanGroup title="Mobile" plans={vyaparMobilePlans} />
      </div>
    </section>
  );
}
