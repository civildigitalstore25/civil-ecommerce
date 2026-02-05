import React from "react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const TermsAndConditions: React.FC = () => {
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
            Terms & Conditions
          </h1>
          <p
            className="mt-4 text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ color: colors.text.secondary }}
          >
            Welcome to <strong>Softzcart</strong>! Please read these Terms & Conditions carefully before using our website.
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
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>1. Cookies</h3>
                <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                  By using our website, you consent to the use of cookies in accordance with our Privacy Policy. Cookies help improve user experience and enable certain site functionalities.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>2. License</h3>
                <p className="leading-relaxed mb-4" style={{ color: colors.text.secondary }}>
                  Unless otherwise stated, <strong>Softzcart</strong> owns the intellectual property rights for all material on this site. You may use it for personal purposes only under these restrictions:
                </p>
                <ul className="list-disc pl-6 space-y-2" style={{ color: colors.text.secondary }}>
                  <li>No republishing of content</li>
                  <li>No selling or sublicensing</li>
                  <li>No reproduction or duplication</li>
                  <li>No redistribution without permission</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>3. Hyperlinking to Our Content</h3>
                <p className="leading-relaxed mb-4" style={{ color: colors.text.secondary }}>
                  The following organizations may link to our website without prior approval:
                </p>
                <ul className="list-disc pl-6 space-y-2" style={{ color: colors.text.secondary }}>
                  <li>Government agencies</li>
                  <li>Search engines</li>
                  <li>News organizations</li>
                  <li>Online directories</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>4. iFrames</h3>
                <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                  Without written approval, you may not create frames around our web pages that alter the appearance or presentation of our website.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>5. Content Liability</h3>
                <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                  We are not responsible for any content that appears on your website. You agree to defend and protect us against any claims arising from your site.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>6. Disclaimer</h3>
                <p className="leading-relaxed mb-4" style={{ color: colors.text.secondary }}>
                  To the fullest extent permitted by law, we exclude all warranties and conditions relating to this website. Nothing in this disclaimer will:
                </p>
                <ul className="list-disc pl-6 space-y-2" style={{ color: colors.text.secondary }}>
                  <li>Limit liability for death or personal injury</li>
                  <li>Limit liability for fraud or misrepresentation</li>
                  <li>Exclude liabilities that cannot be excluded by law</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>7. Payment Processing</h3>
                <p className="leading-relaxed mb-4" style={{ color: colors.text.secondary }}>
                  We use <strong style={{ color: colors.interactive.primary }}>Razorpay</strong> as our trusted payment gateway partner for processing all online transactions. By making a purchase on our website, you agree to Razorpay's Terms of Service and Privacy Policy.
                </p>
                <div className="space-y-3" style={{ color: colors.text.secondary }}>
                  <p>
                    <strong style={{ color: colors.text.primary }}>Payment Methods:</strong> We accept credit cards, debit cards, net banking, UPI, and various digital wallets through Razorpay's secure payment infrastructure.
                  </p>
                  <p>
                    <strong style={{ color: colors.text.primary }}>Transaction Security:</strong> All payment information is processed through Razorpay's PCI-DSS compliant platform. We do not store your complete card details on our servers.
                  </p>
                  <p>
                    <strong style={{ color: colors.text.primary }}>Payment Confirmation:</strong> You will receive a payment confirmation via email once your transaction is successfully processed.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>8. Refunds & Cancellations</h3>
                <p className="leading-relaxed mb-4" style={{ color: colors.text.secondary }}>
                  Refund processing is handled in accordance with our Return & Refund Policy. Approved refunds will be processed through Razorpay and credited to your original payment method:
                </p>
                <ul className="list-disc pl-6 space-y-2" style={{ color: colors.text.secondary }}>
                  <li>Refunds typically process within 5-7 business days</li>
                  <li>The time for credit to appear in your account depends on your bank or card issuer</li>
                  <li>You will receive email notifications about refund status</li>
                  <li>Failed transactions are automatically reversed within 5-7 business days</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
