import React from "react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const ReturnPolicy: React.FC = () => {
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
            Return & Refund Policy
          </h1>
          <p
            className="mt-4 text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ color: colors.text.secondary }}
          >
            Please read this policy carefully before purchasing from <strong>Softzcart</strong>. Your rights as a customer matter to us.
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
                  1. Introduction
                </h3>
                <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                  Thank you for shopping at <span className="font-medium" style={{ color: colors.interactive.primary }}>Softzcart</span>. If you are dissatisfied with your purchase, this policy explains how returns and refunds work. By placing an order, you agree to these terms.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>
                  2. Interpretation & Definitions
                </h3>
                <ul className="list-disc pl-6 space-y-2" style={{ color: colors.text.secondary }}>
                  <li><b>Company:</b> Softzcart.</li>
                  <li><b>Goods:</b> The products available for sale.</li>
                  <li><b>Orders:</b> Your purchase requests from us.</li>
                  <li>
                    <b>Website:</b>{" "}
                    <a href="https://softzcart.com/" className="underline" style={{ color: colors.interactive.primary }}>
                      softzcart.com
                    </a>
                  </li>
                  <li><b>You:</b> The customer using our service.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>
                  3. Order Cancellation Rights
                </h3>
                <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                  You have the right to cancel your order within <b>7 days</b> without giving any reason.
                </p>
                <p className="leading-relaxed mt-2" style={{ color: colors.text.secondary }}>
                  To cancel, please notify us clearly by:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1" style={{ color: colors.text.secondary }}>
                  <li>
                    Email: <span className="font-medium" style={{ color: colors.interactive.primary }}>softzcart@gmail.com</span>
                  </li>
                  <li>
                    Phone: <a href="tel:+919042993986" className="font-medium" style={{ color: colors.interactive.primary }}>+91 9042993986</a>
                  </li>
                </ul>
                <p className="leading-relaxed mt-2" style={{ color: colors.text.secondary }}>
                  Refunds will be processed within 14 days using your original payment method. No fees will be charged for reimbursement.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>
                  4. Contact Us
                </h3>
                <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                  For any questions about this Return & Refund Policy, contact us:
                </p>
                <ul className="list-disc pl-6 mt-2" style={{ color: colors.text.secondary }}>
                  <li>
                    Email: <span className="font-medium" style={{ color: colors.interactive.primary }}>softzcart@gmail.com</span>
                  </li>
                  <li>
                    Phone: <a href="tel:+919042993986" className="font-medium" style={{ color: colors.interactive.primary }}>+91 9042993986</a>
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

export default ReturnPolicy;
     