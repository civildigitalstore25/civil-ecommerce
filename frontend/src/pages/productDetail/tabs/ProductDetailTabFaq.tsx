import type { Product } from "../../../api/types/productTypes";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import { ProductDetailFAQItem } from "../ProductDetailFAQItem";

type ProductDetailTabFaqProps = {
  colors: ThemeColors;
  product: Product;
};

/** Shown on the product FAQ tab only when the admin has not added any FAQs for the product. */
const DEFAULT_FAQS: { question: string; answer: string }[] = [
  {
    question: "How long does activation take?",
    answer:
      "Most subscriptions are activated within a few hours after your payment is confirmed. In some cases, it may take up to 24 hours.",
  },
  {
    question: "How do renewals work?",
    answer:
      "We will notify you before your subscription expires. You can renew your plan to continue using the software without interruption.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Refunds follow Autodesk's official policy. Once a subscription is activated or the license is assigned, refunds may no longer be available.",
  },
  {
    question: "Do you accept card/bank transfer?",
    answer:
      "Yes. We accept bank transfers, card payments, and other approved digital payment methods.",
  },
  {
    question: "Installation help",
    answer:
      "Yes. We provide basic installation guidance. For complex issues, Autodesk's official support team can also assist you.",
  },
];

function getAdminFaqs(product: Product) {
  const list = product.faqs ?? [];
  return list.filter(
    (faq) =>
      (faq.question && faq.question.trim() !== "") ||
      (faq.answer && faq.answer.trim() !== ""),
  );
}

export function ProductDetailTabFaq({ colors, product }: ProductDetailTabFaqProps) {
  const adminFaqs = getAdminFaqs(product);
  const useDefaults = adminFaqs.length === 0;
  const faqsToShow = useDefaults ? DEFAULT_FAQS : adminFaqs;

  return (
    <div>
      <h3
        className="text-2xl font-bold mb-6"
        style={{ color: colors.text.primary }}
      >
        Frequently Asked Questions
      </h3>
      <p className="mb-8" style={{ color: colors.text.secondary }}>
        Get answers to common questions about {product.name}
      </p>

      <div className="space-y-4">
        {faqsToShow.map((faq, index) => (
          <ProductDetailFAQItem
            key={useDefaults ? faq.question : index}
            question={faq.question || ""}
            answer={faq.answer || ""}
            index={index}
            colors={colors}
          />
        ))}
      </div>
    </div>
  );
}
