import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { vyaparFaqs } from "./vyaparContent";

export function VyaparFaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-[#1B1B2F] sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-gray-600">
          Get answers to common questions about Vyapar
        </p>

        <div className="mt-10 divide-y divide-gray-100 text-left">
          {vyaparFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span
                    className={`font-medium ${isOpen ? "text-[#ED1A3B]" : "text-[#1B1B2F]"}`}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-400 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm leading-relaxed text-gray-600">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
