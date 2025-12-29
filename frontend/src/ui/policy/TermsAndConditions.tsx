import React from "react";
import { motion } from "framer-motion";
import {
  Cookie,
  FileText,
  Link,
  Layout,
  Shield,
  AlertCircle,
  CreditCard,
  Lock,
  Banknote,
} from "lucide-react";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";


const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const TermsAndConditions: React.FC = () => {
  const { colors } = useAdminThemeStyles();

  return (
    <div
      className="py-14 px-4 sm:py-20 sm:px-6 mt-7"
      style={{ backgroundColor: colors.background.secondary }}
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
          Welcome to{" "}
          <strong style={{ color: colors.interactive.primary }}>
            Softzcart
          </strong>
          ! Please read these Terms & Conditions carefully before using our
          website{" "}
          <a
            href="https://softzcart.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.interactive.primary }}
            className="font-semibold hover:underline"
          >
            https://softzcart.com/
          </a>
          .
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid gap-8">
        {/* Cookies */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <Cookie
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Cookies
            </h2>
          </div>
          <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
            By using our website, you consent to the use of cookies in
            accordance with our Privacy Policy. Cookies help improve user
            experience and enable certain site functionalities.
          </p>
        </motion.div>

        {/* License */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <FileText
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              License
            </h2>
          </div>
          <p
            className="leading-relaxed mb-4"
            style={{ color: colors.text.secondary }}
          >
            Unless otherwise stated,{" "}
            <strong style={{ color: colors.interactive.primary }}>
              Softzcart
            </strong>{" "}
            owns the intellectual property rights for all material on this site.
            You may use it for personal purposes only under these restrictions:
          </p>
          <ul className="list-disc pl-6 space-y-2" style={{ color: colors.text.secondary }}>
            <li>No republishing of content</li>
            <li>No selling or sublicensing</li>
            <li>No reproduction or duplication</li>
            <li>No redistribution without permission</li>
          </ul>
        </motion.div>

        {/* Hyperlinking */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <Link
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Hyperlinking to Our Content
            </h2>
          </div>
          <p
            className="leading-relaxed mb-4"
            style={{ color: colors.text.secondary }}
          >
            The following organizations may link to our website without prior
            approval:
          </p>
          <ul className="list-disc pl-6 space-y-2" style={{ color: colors.text.secondary }}>
            <li>Government agencies</li>
            <li>Search engines</li>
            <li>News organizations</li>
            <li>Online directories</li>
          </ul>
        </motion.div>

        {/* iFrames */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <Layout
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              iFrames
            </h2>
          </div>
          <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
            Without written approval, you may not create frames around our web
            pages that alter the appearance or presentation of our website.
          </p>
        </motion.div>

        {/* Content Liability */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <Shield
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Content Liability
            </h2>
          </div>
          <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
            We are not responsible for any content that appears on your website.
            You agree to defend and protect us against any claims arising from
            your site.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <AlertCircle
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Disclaimer
            </h2>
          </div>
          <p
            className="leading-relaxed mb-4"
            style={{ color: colors.text.secondary }}
          >
            To the fullest extent permitted by law, we exclude all warranties and
            conditions relating to this website. Nothing in this disclaimer will:
          </p>
          <ul className="list-disc pl-6 space-y-2" style={{ color: colors.text.secondary }}>
            <li>Limit liability for death or personal injury</li>
            <li>Limit liability for fraud or misrepresentation</li>
            <li>Exclude liabilities that cannot be excluded by law</li>
          </ul>
        </motion.div>

        {/* Payment Gateway Terms - Razorpay */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <CreditCard
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Payment Processing
            </h2>
          </div>
          <p
            className="leading-relaxed mb-4"
            style={{ color: colors.text.secondary }}
          >
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
        </motion.div>

        {/* Transaction Security */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <Lock
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Transaction Security & Data Protection
            </h2>
          </div>
          <p
            className="leading-relaxed mb-4"
            style={{ color: colors.text.secondary }}
          >
            Your payment security is our top priority. All transactions are encrypted and processed through industry-standard security protocols:
          </p>
          <ul className="list-disc pl-6 space-y-2" style={{ color: colors.text.secondary }}>
            <li>256-bit SSL encryption for all payment pages</li>
            <li>PCI DSS Level 1 compliance through Razorpay</li>
            <li>Two-factor authentication for added security</li>
            <li>Fraud detection and prevention mechanisms</li>
            <li>Secure tokenization of payment information</li>
          </ul>
        </motion.div>

        {/* Refunds and Cancellations */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6, delay: 0.9 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-2 rounded-full"
              style={{ backgroundColor: colors.background.secondary }}
            >
              <Banknote
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Refunds & Cancellations
            </h2>
          </div>
          <p
            className="leading-relaxed mb-4"
            style={{ color: colors.text.secondary }}
          >
            Refund processing is handled in accordance with our Return & Refund Policy. Approved refunds will be processed through Razorpay and credited to your original payment method:
          </p>
          <ul className="list-disc pl-6 space-y-2" style={{ color: colors.text.secondary }}>
            <li>Refunds typically process within 5-7 business days</li>
            <li>The time for credit to appear in your account depends on your bank or card issuer</li>
            <li>You will receive email notifications about refund status</li>
            <li>Failed transactions are automatically reversed within 5-7 business days</li>
          </ul>
        </motion.div>
      </div>

      {/* Footer Notice */}
      <div
        className="mt-12 text-center text-sm"
        style={{ color: colors.text.secondary }}
      >
        Last updated: <strong>December 2025</strong> • Subject to change anytime
        <br />
        <span className="mt-2 inline-block">
          Payment processing powered by{" "}
          <strong style={{ color: colors.interactive.primary }}>Razorpay</strong> •
          Merchant Agreement accepted on December 14, 2025
        </span>
      </div>
    </div>
  );
};

export default TermsAndConditions;
