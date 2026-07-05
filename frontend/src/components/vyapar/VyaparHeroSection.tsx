import { Check, Star, TrendingUp } from "lucide-react";
import { VyaparCtaButton } from "./VyaparCtaButton";

const HERO_IMAGE = "/images/vyapar-hero-reference.png";

export function VyaparHeroSection() {
  return (
    <section className="overflow-hidden bg-[#FFFBF8] px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pb-12 lg:pt-14">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
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
            <VyaparCtaButton />
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

        <div className="relative order-2 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
          <div className="absolute inset-y-6 right-0 w-[90%] rounded-[2rem] bg-gradient-to-b from-[#F5A623] to-[#ED1A3B]" />

          <div className="relative h-[280px] overflow-hidden sm:h-[340px] lg:h-[400px]">
            <span className="absolute right-4 top-2 z-20 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md sm:right-8">
              <Check className="h-3.5 w-3.5" />
              Invoice Created
            </span>

            <div className="absolute bottom-6 left-2 z-20 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg sm:left-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-blue-500 shadow-sm ring-1 ring-gray-100">
                  G
                </span>
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-semibold text-gray-700">
                    4.8 rating
                  </p>
                </div>
              </div>
            </div>

            <img
              src={HERO_IMAGE}
              alt="Vyapar billing software on laptop"
              className="absolute right-0 top-0 h-[115%] w-[165%] max-w-none object-cover object-[72%_top]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
