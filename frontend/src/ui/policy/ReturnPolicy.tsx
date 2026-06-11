import React from "react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { Info, BookOpen, XCircle, Phone, CheckCircle } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const sections = [
  {
    num: "1",
    icon: <Info size={14} strokeWidth={2.25} />,
    title: "Introduction",
    content: (colors: any, isLight: boolean) => (
      <p className="text-sm sm:text-base leading-relaxed" style={{ color: isLight ? "#475569" : colors.text.secondary }}>
        Thank you for shopping at <strong>Softzcart</strong>. If you are dissatisfied with your purchase, this policy explains how returns and refunds work. By placing an order, you agree to these terms.
      </p>
    ),
  },
  {
    num: "2",
    icon: <BookOpen size={14} strokeWidth={2.25} />,
    title: "Interpretation & Definitions",
    content: (colors: any, isLight: boolean) => (
      <ul className="space-y-2" style={{ color: isLight ? "#475569" : colors.text.secondary }}>
        {[
          { label: "Company", val: "Softzcart." },
          { label: "Goods", val: "The products available for sale." },
          { label: "Orders", val: "Your purchase requests from us." },
          { label: "Website", val: null },
          { label: "You", val: "The customer using our service." },
        ].map(({ label, val }) => (
          <li key={label} className="flex items-start gap-2 text-sm sm:text-base">
            <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#0A2A6B" }} />
            <span>
              <strong>{label}:</strong>{" "}
              {label === "Website" ? (
                <a
                  href="https://softzcart.com/"
                  className="underline font-medium"
                  style={{ color: "#0A2A6B" }}
                >
                  softzcart.com
                </a>
              ) : (
                val
              )}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    num: "3",
    icon: <XCircle size={14} strokeWidth={2.25} />,
    title: "Order Cancellation Rights",
    content: (colors: any, isLight: boolean) => {
      const muted = { color: isLight ? "#475569" : colors.text.secondary };
      return (
        <div className="space-y-2.5">
          <p className="text-sm sm:text-base leading-relaxed" style={muted}>
            You have the right to cancel your order within <strong>7 days</strong> without giving any reason.
          </p>
          <p className="text-sm sm:text-base leading-relaxed" style={muted}>
            To cancel, please notify us clearly by:
          </p>
          <ul className="space-y-1.5">
            {[
              {
                label: "Email",
                node: (
                  <a href="mailto:softzcart@gmail.com" className="underline font-medium" style={{ color: "#0A2A6B" }}>
                    softzcart@gmail.com
                  </a>
                ),
              },
              {
                label: "Phone",
                node: (
                  <a href="tel:+919042993986" className="font-medium underline" style={{ color: "#0A2A6B" }}>
                    +91 9042993986
                  </a>
                ),
              },
            ].map(({ label, node }) => (
              <li key={label} className="flex items-center gap-2 text-sm sm:text-base" style={muted}>
                <CheckCircle size={14} className="shrink-0" style={{ color: "#0A2A6B" }} />
                <span>{label}: {node}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm sm:text-base leading-relaxed" style={muted}>
            Refunds will be processed within <strong>14 days</strong> using your original payment method. No fees will be charged for reimbursement.
          </p>
        </div>
      );
    },
  },
  {
    num: "4",
    icon: <Phone size={14} strokeWidth={2.25} />,
    title: "Contact Us",
    content: (colors: any, isLight: boolean) => {
      const muted = { color: isLight ? "#475569" : colors.text.secondary };
      return (
        <div className="space-y-2.5">
          <p className="text-sm sm:text-base leading-relaxed" style={muted}>
            For any questions about this Return & Refund Policy, contact us:
          </p>
          <ul className="space-y-1.5">
            {[
              {
                label: "Email",
                node: (
                  <a href="mailto:softzcart@gmail.com" className="underline font-medium" style={{ color: "#0A2A6B" }}>
                    softzcart@gmail.com
                  </a>
                ),
              },
              {
                label: "Phone",
                node: (
                  <a href="tel:+919042993986" className="font-medium underline" style={{ color: "#0A2A6B" }}>
                    +91 9042993986
                  </a>
                ),
              },
            ].map(({ label, node }) => (
              <li key={label} className="flex items-center gap-2 text-sm sm:text-base" style={muted}>
                <CheckCircle size={14} className="shrink-0" style={{ color: "#0A2A6B" }} />
                <span>{label}: {node}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    },
  },
];

const ReturnPolicy: React.FC = () => {
  const { colors } = useAdminThemeStyles();
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  return (
    <div
      className="min-h-screen px-3 py-4 sm:p-6 md:p-10 pt-16 sm:pt-20 relative mt-16 sm:mt-20 transition-colors duration-200"
      style={{ backgroundColor: isLight ? "#F5F7FA" : colors.background.primary }}
    >
      <div
        className="mx-auto max-w-5xl rounded-xl shadow-xl overflow-hidden"
        style={{
          backgroundColor: isLight ? "#fff" : colors.background.secondary,
          border: `1px solid ${isLight ? "#E2E8F0" : colors.border.primary}`,
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-7 sm:p-10 text-center"
          style={{
            backgroundColor: isLight ? "#F8FAFC" : colors.background.secondary,
            borderBottom: `1px solid ${isLight ? "#E2E8F0" : colors.border.primary}`,
          }}
        >
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
            style={{ color: isLight ? "#0A2A6B" : colors.text.primary }}
          >
            Return & Refund Policy
          </h1>
          <p
            className="mt-2 sm:mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ color: isLight ? "#475569" : colors.text.secondary }}
          >
            Please read this policy carefully before purchasing from <strong>Softzcart</strong>. Your rights as a customer matter to us.
          </p>
        </div>

        {/* Sections */}
        <div className="px-4 py-5 sm:p-8 lg:p-10 space-y-4 sm:space-y-5">
          {sections.map(({ num, icon, title, content }, i) => (
            <motion.div
              key={num}
              className="rounded-lg border p-4 sm:p-5"
              style={{
                backgroundColor: isLight ? "#F8FAFC" : colors.background.primary,
                borderColor: isLight ? "#E2E8F0" : colors.border.primary,
              }}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              {/* Section Title */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div
                  className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: "#0A2A6B" }}
                >
                  {icon}
                </div>
                <h3
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: isLight ? "#0A2A6B" : colors.text.primary }}
                >
                  {num}. {title}
                </h3>
              </div>

              {/* Section Body */}
              <div>
                {content(colors, isLight)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
