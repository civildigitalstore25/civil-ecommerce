import { Star } from "lucide-react";
import { vyaparTestimonials } from "./vyaparContent";

export function VyaparTestimonialsSection() {
  return (
    <section className="bg-[#FFFBF8] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-2xl font-bold text-[#1B1B2F] sm:text-3xl">
          What Our Users Say
        </h2>
        <p className="mt-2 flex items-center justify-center gap-1 text-sm text-gray-600">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          4.7/5 on Play Store
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {vyaparTestimonials.map(({ quote, name, role, initials }) => (
            <article
              key={name}
              className="rounded-2xl border border-red-50 bg-white p-6 text-left shadow-sm"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm italic leading-relaxed text-gray-700">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-[#ED1A3B]">
                  {initials}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#1B1B2F]">{name}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
