import { Check, X } from "lucide-react";
import type { VyaparPlan } from "./vyaparContent";

interface VyaparPricingCardProps {
  plan: VyaparPlan;
}

export function VyaparPricingCard({ plan }: VyaparPricingCardProps) {
  return (
    <article
      className={`relative flex flex-col rounded-2xl border p-6 w-[85%] min-w-[85%] shrink-0 snap-center md:w-auto md:min-w-0 md:shrink md:snap-align-none ${
        plan.highlighted
          ? "border-red-100 bg-gradient-to-b from-[#FFF5F0] to-white shadow-md"
          : "border-gray-100 bg-white shadow-sm"
      }`}
    >
      {plan.saveBadge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#ED1A3B] to-[#F5A623] px-3 py-1 text-xs font-bold text-white">
          {plan.saveBadge}
        </span>
      )}

      <h4 className="text-lg font-bold text-[#1B1B2F]">{plan.title}</h4>
      <p className="mt-2">
        <span className="text-3xl font-extrabold text-[#ED1A3B]">
          {plan.price}
        </span>
        <span className="text-sm text-gray-500">{plan.period}</span>
      </p>

      <ul className="mt-6 flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li
            key={feature.text}
            className={`flex items-start gap-2 text-sm ${
              feature.included ? "text-gray-700" : "text-gray-400"
            }`}
          >
            {feature.included ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ED1A3B]" />
            ) : (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
            )}
            {feature.text}
          </li>
        ))}
      </ul>
    </article>
  );
}
