import React from "react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { CheckCircle, Cookie, FileText, Link2, Frame, ShieldAlert, AlertTriangle, CreditCard, RefreshCw } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const sections = [
  {
    num: "1",
    icon: <Cookie size={14} strokeWidth={2.25} />,
    title: "Cookies",
    content: (
      <p className="text-sm sm:text-base leading-relaxed">
        By using our website, you consent to the use of cookies in accordance with our Privacy Policy. Cookies help improve user experience and enable certain site functionalities.
      </p>
    ),
  },
  {
    num: "2",
    icon: <FileText size={14} strokeWidth={2.25} />,
    title: "License",
    content: (
      <>
        <p className="text-sm sm:text-base leading-relaxed mb-3">
          Unless otherwise stated, <strong>Softzcart</strong> owns the intellectual property rights for all material on this site. You may use it for personal purposes only under these restrictions:
        </p>
        <ul className="space-y-1.5">
          {["No republishing of content", "No selling or sublicensing", "No reproduction or duplication", "No redistribution without permission"].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm sm:text-base">
              <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#0A2A6B" }} />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "3",
    icon: <Link2 size={14} strokeWidth={2.25} />,
    title: "Hyperlinking to Our Content",
    content: (
      <>
        <p className="text-sm sm:text-base leading-relaxed mb-3">
          The following organizations may link to our website without prior approval:
        </p>
        <ul className="space-y-1.5">
          {["Government agencies", "Search engines", "News organizations", "Online directories"].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm sm:text-base">
              <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#0A2A6B" }} />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "4",
    icon: <Frame size={14} strokeWidth={2.25} />,
    title: "iFrames",
    content: (
      <p className="text-sm sm:text-base leading-relaxed">
        Without written approval, you may not create frames around our web pages that alter the appearance or presentation of our website.
      </p>
    ),
  },
  {
    num: "5",
    icon: <ShieldAlert size={14} strokeWidth={2.25} />,
    title: "Content Liability",
    content: (
      <p className="text-sm sm:text-base leading-relaxed">
        We are not responsible for any content that appears on your website. You agree to defend and protect us against any claims arising from your site.
      </p>
    ),
  },
  {
    num: "6",
    icon: <AlertTriangle size={14} strokeWidth={2.25} />,
    title: "Disclaimer",
    content: (
      <>
        <p className="text-sm sm:text-base leading-relaxed mb-3">
          To the fullest extent permitted by law, we exclude all warranties and conditions relating to this website. Nothing in this disclaimer will:
        </p>
        <ul className="space-y-1.5">
          {["Limit liability for death or personal injury", "Limit liability for fraud or misrepresentation", "Exclude liabilities that cannot be excluded by law"].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm sm:text-base">
              <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#0A2A6B" }} />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: "7",
    icon: <CreditCard size={14} strokeWidth={2.25} />,
    title: "Payment Processing",
    content: (
      <div className="space-y-3">
        <p className="text-sm sm:text-base leading-relaxed">
          We use <strong>Razorpay</strong> as our trusted payment gateway partner for processing all online transactions. By making a purchase, you agree to Razorpay's Terms of Service and Privacy Policy.
        </p>
        <div className="space-y-2 text-sm sm:text-base">
          <p><strong>Payment Methods:</strong> We accept credit cards, debit cards, net banking, UPI, and various digital wallets through Razorpay's secure payment infrastructure.</p>
          <p><strong>Transaction Security:</strong> All payment information is processed through Razorpay's PCI-DSS compliant platform. We do not store your complete card details on our servers.</p>
          <p><strong>Payment Confirmation:</strong> You will receive a payment confirmation via email once your transaction is successfully processed.</p>
        </div>
      </div>
    ),
  },
  {
    num: "8",
    icon: <RefreshCw size={14} strokeWidth={2.25} />,
    title: "Refunds & Cancellations",
    content: (
      <>
        <p className="text-sm sm:text-base leading-relaxed mb-3">
          Refund processing is handled in accordance with our Return & Refund Policy. Approved refunds will be credited to your original payment method:
        </p>
        <ul className="space-y-1.5">
          {[
            "Refunds typically process within 5–7 business days",
            "Credit timeline depends on your bank or card issuer",
            "You will receive email notifications about refund status",
            "Failed transactions are automatically reversed within 5–7 business days",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm sm:text-base">
              <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#0A2A6B" }} />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
];

const TermsAndConditions: React.FC = () => {
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
            Terms & Conditions
          </h1>
          <p
            className="mt-2 sm:mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ color: isLight ? "#475569" : colors.text.secondary }}
          >
            Welcome to <strong>Softzcart</strong>! Please read these Terms & Conditions carefully before using our website.
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
              <div style={{ color: isLight ? "#475569" : colors.text.secondary }}>
                {content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
