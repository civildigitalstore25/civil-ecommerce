
import {
  Info,
  FileText,
  RefreshCcw,
  Package,
  Gift,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";

const sections = [
  {
    icon: Info,
    title: "Introduction",
    content: (colors: any) => (
      <p
        className="leading-relaxed"
        style={{ color: colors.text.secondary }}
      >
        Thank you for shopping at{" "}
        <span
          className="font-medium"
          style={{ color: colors.interactive.primary }}
        >
          Softzcart
        </span>
        . If you are dissatisfied with your purchase, this policy explains how
        returns and refunds work. By placing an order, you agree to these terms.
      </p>
    ),
  },
  {
    icon: FileText,
    title: "Interpretation & Definitions",
    content: (colors: any) => (
      <ul
        className="list-disc pl-6 space-y-2"
        style={{ color: colors.text.secondary }}
      >
        <li>
          <b>Company:</b> Softzcart DigitalStore.
        </li>
        <li>
          <b>Goods:</b> The products available for sale.
        </li>
        <li>
          <b>Orders:</b> Your purchase requests from us.
        </li>
        <li>
          <b>Website:</b>{" "}
          <a
            href="https://softzcart.com/"
            className="underline"
            style={{ color: colors.interactive.primary }}
          >
            softzcart.com
          </a>
        </li>
        <li>
          <b>You:</b> The customer using our service.
        </li>
      </ul>
    ),
  },
  {
    icon: RefreshCcw,
    title: "Order Cancellation Rights",
    content: (colors: any) => (
      <>
        <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
          You have the right to cancel your order within <b>7 days</b> without
          giving any reason.
        </p>
        <p
          className="leading-relaxed mt-2"
          style={{ color: colors.text.secondary }}
        >
          To cancel, please notify us clearly by:
        </p>
        <ul
          className="list-disc pl-6 mt-2 space-y-1"
          style={{ color: colors.text.secondary }}
        >
          <li>
            Email:{" "}
            <span
              className="font-medium"
              style={{ color: colors.interactive.primary }}
            >
              softzcart@gmail.com
            </span>
          </li>
          <li>
            Phone:{" "}
            <a
              href="tel:+919042993986"
              className="font-medium"
              style={{ color: colors.interactive.primary }}
            >
              +91 9042993986
            </a>
          </li>
        </ul>
        <p
          className="leading-relaxed mt-2"
          style={{ color: colors.text.secondary }}
        >
          Refunds will be processed within 14 days using your original payment
          method. No fees will be charged for reimbursement.
        </p>
      </>
    ),
  },
  {
    icon: Package,
    title: "Conditions for Returns",
    content: (colors: any) => (
      <>
        <p style={{ color: colors.text.secondary }}>
          For goods to be eligible for a return:
        </p>
        <ul
          className="list-disc pl-6 space-y-1 mt-2"
          style={{ color: colors.text.secondary }}
        >
          <li>They were purchased within the last 7 days.</li>
          <li>They are in the original packaging.</li>
        </ul>
        <p
          className="mt-3 font-semibold"
          style={{ color: colors.text.secondary }}
        >
          The following items cannot be returned:
        </p>
        <ul
          className="list-disc pl-6 space-y-1 mt-1"
          style={{ color: colors.text.secondary }}
        >
          <li>Customized goods or made-to-order products.</li>
          <li>Digital items once downloaded.</li>
          <li>
            Goods not suitable for return due to hygiene reasons and unsealed
            after delivery.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: Gift,
    title: "Gifts",
    content: (colors: any) => (
      <>
        <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
          If the goods were marked as a gift and shipped directly to you, you
          will receive a gift credit for the value of your return. Once the
          returned item is received, a gift certificate will be sent.
        </p>
        <p
          className="leading-relaxed mt-2"
          style={{ color: colors.text.secondary }}
        >
          If the goods were not marked as a gift, or shipped to the gift giver,
          the refund will be issued to the original purchaser.
        </p>
      </>
    ),
  },
  {
    icon: Mail,
    title: "Contact Us",
    content: (colors: any) => (
      <>
        <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
          For any questions about this Return & Refund Policy, contact us:
        </p>
        <ul className="list-disc pl-6 mt-2" style={{ color: colors.text.secondary }}>
          <li>
            Email:{" "}
            <span
              className="font-medium"
              style={{ color: colors.interactive.primary }}
            >
              softzcart@gmail.com
            </span>
          </li>
          <li>
            Phone:{" "}
            <a
              href="tel:+919042993986"
              className="font-medium"
              style={{ color: colors.interactive.primary }}
            >
              +91 9042993986
            </a>
          </li>
        </ul>
      </>
    ),
  },
];

export default function ReturnPolicy() {
  const { colors } = useAdminThemeStyles();

  return (
    <div
      className="min-h-screen font-sans antialiased mt-10"
      style={{
        background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
        color: colors.text.primary,
      }}
    >
      <div className="max-w-5xl mx-auto py-14 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h1
            className="text-5xl font-serif font-bold"
            style={{ color: colors.text.primary }}
          >
            Return & Refund Policy
          </h1>
          <p
            className="mt-4 max-w-2xl mx-auto text-lg"
            style={{ color: colors.text.secondary }}
          >
            Please read this policy carefully before purchasing from{" "}
            <span
              className="font-semibold"
              style={{ color: colors.interactive.primary }}
            >
              Softzcart
            </span>
            . Your rights as a customer matter to us.
          </p>
          <p className="text-sm mt-3" style={{ color: colors.text.secondary }}>
            Last updated: July 12, 2023
          </p>
        </motion.div>

        {/* Segmented cards */}
        <div className="grid gap-8">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: colors.background.accent }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: colors.interactive.primary }}
                    />
                  </div>
                  <h2
                    className="text-2xl font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {section.title}
                  </h2>
                </div>
                {section.content(colors)}
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
