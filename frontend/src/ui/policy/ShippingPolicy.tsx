import React from "react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const ShippingPolicy: React.FC = () => {
  const { colors } = useAdminThemeStyles();

  return (
    <div
      className="min-h-screen py-12 px-4 pt-20 transition-colors duration-200"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div
        className="py-14 px-4 sm:py-20 sm:px-6"
        style={{
          background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
        }}
      >
        {/* Header */}
        <div className="max-w-5xl mx-auto text-center mb-14">
          <h1
            className="text-5xl font-serif font-bold"
            style={{ color: colors.text.primary }}
          >
            Shipping & Delivery Policy
          </h1>
          <p
            className="mt-4 text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ color: colors.text.secondary }}
          >
            This Shipping & Delivery Policy is part of our Terms and Conditions. Please review it carefully before placing an order at <strong>Softzcart</strong>.
          </p>
        </div>

        {/* Single Card */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="rounded-2xl shadow-md p-6 sm:p-8 border"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>
                  1. Shipping Options
                </h3>
                <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                  <strong>Free Shipping:</strong> We offer free Instant Download shipping on all orders placed through <strong style={{ color: colors.interactive.primary }}>Softzcart</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>
                  2. International Delivery
                </h3>
                <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                  Currently, we do not offer international shipping. Our services are available only within India.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>
                  3. Returns & Refunds
                </h3>
                <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                  If you have questions about returns, please review our{" "}
                  <a
                    href="https://www.softzcart.com/return-and-refund-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: colors.interactive.primary }}
                    className="font-semibold hover:underline"
                  >
                    Return and Refund Policy
                  </a>
                  .
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>
                  4. Contact Us
                </h3>
                <p className="leading-relaxed mb-4" style={{ color: colors.text.secondary }}>
                  If you have any further questions or comments about this Shipping Policy, you may contact us by:
                </p>
                <ul className="list-disc pl-6 space-y-2" style={{ color: colors.text.secondary }}>
                  <li>Phone: +91 9042993986</li>
                  <li>Email: softzcart@gmail.com</li>
                  <li>
                    <a
                      href="https://softzcart.com/contact-us/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: colors.interactive.primary }}
                      className="font-semibold hover:underline"
                    >
                      Contact Form
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
