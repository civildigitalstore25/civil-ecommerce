import { Check, Star, TrendingUp } from "lucide-react";
import { VyaparCtaButton } from "./VyaparCtaButton";

const HERO_IMAGE = "/images/vaypar-hero.png";

interface VyaparHeroSectionProps {
  onOpenModal?: () => void;
}

export function VyaparHeroSection({ onOpenModal }: VyaparHeroSectionProps) {
  return (
    <section className="overflow-hidden bg-[#FFFBF8] px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pb-12 lg:pt-14">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-12">

        {/* -- Left: Text content -- */}
        <div className="order-1 lg:order-1">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#FFF3EC] px-4 py-1.5 text-xs font-medium text-gray-700">
            <TrendingUp className="h-3.5 w-3.5 text-[#ED1A3B]" />
            Trusted by 1 Crore+ Businesses
          </div>

          <h1 className="text-[2rem] font-extrabold leading-[1.15] text-[#1B1B2F] sm:text-5xl lg:text-[3.25rem]">
            Complete Invoicing, Accounting and{" "}
            <span className="bg-gradient-to-r from-[#F5A623] via-[#F07830] to-[#ED1A3B] bg-clip-text text-transparent">
              Billing Software
            </span>
          </h1>

          <div className="mt-8 block">
            <VyaparCtaButton onClick={onOpenModal} />
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Free on Android
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Trusted by Local Business
            </span>
          </div>
        </div>

        {/* -- Right: Image panel -- */}
        <div className="relative order-2 mx-auto flex w-full items-end justify-center pt-8 lg:order-2 lg:pt-0">

          {/* Orange-red gradient background card */}
          <div
            className="absolute bottom-0 right-0 h-[78%] w-[85%] rounded-[2rem]"
            style={{
              background: "linear-gradient(155deg, #F5A623 0%, #ED1A3B 100%)",
            }}
          />

          {/* Invoice Created badge — top-right */}
          <span className="absolute right-4 top-[8%] z-20 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg sm:right-8">
            <Check className="h-3.5 w-3.5" />
            Invoice Created
          </span>

          {/* Google rating card — bottom-left */}
          <div className="absolute bottom-4 left-2 z-20 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xl sm:bottom-6 sm:left-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-xl font-black text-blue-600 shadow ring-2 ring-gray-100">
                G
              </span>
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-0.5 text-xs font-semibold text-gray-700">4.8 rating</p>
              </div>
            </div>
          </div>

          {/* Hero image — full person + laptop, object-contain so nothing is cropped */}
          <img
            src={HERO_IMAGE}
            alt="Vyapar billing software on laptop"
            className="relative z-10 h-auto w-full max-w-[420px] object-contain object-bottom drop-shadow-2xl lg:max-w-[520px]"
            style={{ maxHeight: "440px" }}
          />
        </div>

      </div>
    </section>
  );
}
