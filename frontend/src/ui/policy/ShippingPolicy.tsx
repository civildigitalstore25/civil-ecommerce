import React from "react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { Truck, Globe, RefreshCw, Phone, CheckCircle } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ShippingPolicy: React.FC = () => {
  const { colors } = useAdminThemeStyles();
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const muted = { color: isLight ? "#475569" : colors.text.secondary };
  const titleColor = { color: isLight ? "#0A2A6B" : colors.text.primary };
  const brandColor = "#0A2A6B";

  const sections = [
    {
      icon: <Truck size={14} strokeWidth={2.25} />,
      title: "1. Shipping Options",
      body: (
        <p className="text-sm sm:text-base leading-relaxed" style={muted}>
          <strong>Free Shipping:</strong> We offer free Instant Download shipping on all orders placed through <strong>Softzcart</strong>.
        </p>
      ),
    },
    {
      icon: <Globe size={14} strokeWidth={2.25} />,
      title: "2. International Delivery",
      body: (
        <p className="text-sm sm:text-base leading-relaxed" style={muted}>
          Currently, we do not offer international shipping. Our services are available only within India.
        </p>
      ),
    },
    {
      icon: <RefreshCw size={14} strokeWidth={2.25} />,
      title: "3. Returns & Refunds",
      body: (
        <p className="text-sm sm:text-base leading-relaxed" style={muted}>
          If you have questions about returns, please review our{" "}
          <a
            href="https://www.softzcart.com/return-and-refund-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
            style={{ color: brandColor }}
          >
            Return and Refund Policy
          </a>
          .
        </p>
      ),
    },
    {
      icon: <Phone size={14} strokeWidth={2.25} />,
      title: "4. Contact Us",
      body: (
        <div className="space-y-2.5">
          <p className="text-sm sm:text-base leading-relaxed" style={muted}>
            If you have any further questions about this Shipping Policy, contact us by:
          </p>
          <ul className="space-y-1.5">
            {[
              {
                label: "Phone",
                node: (
                  <a href="tel:+919042993986" className="underline font-medium" style={{ color: brandColor }}>
                    +91 9042993986
                  </a>
                ),
              },
              {
                label: "Email",
                node: (
                  <a href="mailto:softzcart@gmail.com" className="underline font-medium" style={{ color: brandColor }}>
                    softzcart@gmail.com
                  </a>
                ),
              },
              {
                label: "Contact Form",
                node: (
                  <a
                    href="https://softzcart.com/contact-us/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                    style={{ color: brandColor }}
                  >
                    Contact Form
                  </a>
                ),
              },
            ].map(({ label, node }) => (
              <li key={label} className="flex items-center gap-2 text-sm sm:text-base" style={muted}>
                <CheckCircle size={14} className="shrink-0" style={{ color: brandColor }} />
                <span>{label}: {node}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

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
            style={titleColor}
          >
            Shipping & Delivery Policy
          </h1>
          <p
            className="mt-2 sm:mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            style={muted}
          >
            This Shipping & Delivery Policy is part of our Terms and Conditions. Please review it carefully before placing an order at <strong>Softzcart</strong>.
          </p>
        </div>

        {/* Sections */}
        <div className="px-4 py-5 sm:p-8 lg:p-10 space-y-4 sm:space-y-5">
          {sections.map(({ icon, title, body }, i) => (
            <motion.div
              key={title}
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
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div
                  className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  {icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold" style={titleColor}>
                  {title}
                </h3>
              </div>
              <div>{body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
