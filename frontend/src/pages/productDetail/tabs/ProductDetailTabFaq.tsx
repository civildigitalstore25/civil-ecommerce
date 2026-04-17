import type { Product } from "../../../api/types/productTypes";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import { ProductDetailFAQItem } from "../ProductDetailFAQItem";

type ProductDetailTabFaqProps = {
  colors: ThemeColors;
  product: Product;
};

const DEFAULT_FAQS: { question: string; answer: string }[] = [
  {
    question: "How do I activate my license?",
    answer:
      "After purchase, you'll receive an email with your license key and activation instructions. You can also watch our activation video demo above for step-by-step guidance. The process typically takes just a few minutes and requires an internet connection for initial activation.",
  },
  {
    question: "What's the difference between Yearly and Lifetime licenses?",
    answer:
      "Yearly licenses provide access for 12 months with all updates and support included. Lifetime licenses give you permanent access with no expiration date and all future updates, making them the most cost-effective option for long-term users. Both license types include full technical support.",
  },
  {
    question: "Do you provide technical support?",
    answer:
      "Yes! We provide comprehensive technical support for all licensed users. Our support team is available via email, live chat, and phone during business hours (9 AM - 6 PM EST, Monday-Friday). We also have an extensive knowledge base and video tutorials available 24/7.",
  },
  {
    question: "Can I use this on multiple devices?",
    answer:
      "Your license allows installation on up to 3 devices for personal use, as long as you're the primary user. For commercial or team use with multiple users, please contact us for multi-user licensing options. We offer volume discounts for businesses and educational institutions.",
  },
  {
    question: "What are the system requirements?",
    answer:
      "Please check the 'Requirements' tab above for detailed system specifications. Generally, you'll need a modern operating system (Windows 10/11 or macOS 10.15+), at least 8GB RAM, and a compatible graphics card. For optimal performance, we recommend 16GB RAM and a dedicated graphics card.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes, we offer a 30-day money-back guarantee on all purchases. If you're not completely satisfied with your purchase, contact our support team within 30 days for a full refund. The software must be uninstalled from all devices to process the refund.",
  },
];

export function ProductDetailTabFaq({ colors, product }: ProductDetailTabFaqProps) {
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
        {product.faqs && product.faqs.length > 0 ? (
          product.faqs.map(
            (faq: { question?: string; answer?: string }, index: number) => (
              <ProductDetailFAQItem
                key={index}
                question={faq.question || ""}
                answer={faq.answer || ""}
                index={index}
                colors={colors}
              />
            )
          )
        ) : (
          <>
            {DEFAULT_FAQS.map((faq, index) => (
              <ProductDetailFAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                index={index}
                colors={colors}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
