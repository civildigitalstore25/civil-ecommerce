import { vyaparFeatures } from "./vyaparContent";

export function VyaparFeaturesSection() {
  return (
    <section id="solutions" className="bg-[#FFFBF8] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-2xl font-bold text-[#1B1B2F] sm:text-3xl">
          1 Crore+ Customers trust Vyapar
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
          Join millions of satisfied businesses across India who rely on Vyapar
          for their billing, inventory, and accounting needs.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vyaparFeatures.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-red-50 bg-white p-6 text-left shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-[#ED1A3B]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-[#1B1B2F]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
