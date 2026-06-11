import React from "react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../hooks/useAdminThemeStyles";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { PAYMENT_METHOD } from "../constants/siteContent";
import { Helmet } from "react-helmet-async";
import { CreditCard, Landmark, Smartphone, Wallet, CalendarClock, BarChart2, ArrowLeftRight, ShieldCheck, CheckCircle } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const methodIcons = [
  <CreditCard size={14} strokeWidth={2.25} />,
  <Landmark size={14} strokeWidth={2.25} />,
  <Smartphone size={14} strokeWidth={2.25} />,
  <Wallet size={14} strokeWidth={2.25} />,
  <CalendarClock size={14} strokeWidth={2.25} />,
  <BarChart2 size={14} strokeWidth={2.25} />,
  <ArrowLeftRight size={14} strokeWidth={2.25} />,
];

const PaymentMethod: React.FC = () => {
  const { colors } = useAdminThemeStyles();
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const muted = { color: isLight ? "#475569" : colors.text.secondary };
  const titleColor = { color: isLight ? "#0A2A6B" : colors.text.primary };
  const brandColor = "#0A2A6B";

  return (
    <div
      className="min-h-screen px-3 py-4 sm:p-6 md:p-10 pt-16 sm:pt-20 relative mt-16 sm:mt-20 transition-colors duration-200"
      style={{ backgroundColor: isLight ? "#F5F7FA" : colors.background.primary }}
    >
      <Helmet>
        <title>{PAYMENT_METHOD.title}</title>
        <meta name="description" content={PAYMENT_METHOD.intro} />
      </Helmet>

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
            {PAYMENT_METHOD.title}
          </h1>
          <p
            className="mt-2 sm:mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            style={muted}
          >
            {PAYMENT_METHOD.intro}
          </p>
        </div>

        {/* Method Cards */}
        <div className="px-4 py-5 sm:p-8 lg:p-10 space-y-4 sm:space-y-5">
          {PAYMENT_METHOD.methods.map((m, idx) => (
            <motion.div
              key={idx}
              className="rounded-lg border p-4 sm:p-5"
              style={{
                backgroundColor: isLight ? "#F8FAFC" : colors.background.primary,
                borderColor: isLight ? "#E2E8F0" : colors.border.primary,
              }}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div
                  className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  {methodIcons[idx] ?? <CheckCircle size={14} strokeWidth={2.25} />}
                </div>
                <h3 className="text-sm sm:text-base font-semibold" style={titleColor}>
                  {m.title}
                </h3>
              </div>
              <ul className="space-y-1.5">
                {m.bullets.map((b, bi) => (
                  <li key={bi} className="flex items-start gap-2 text-sm sm:text-base" style={muted}>
                    <CheckCircle size={13} className="mt-0.5 shrink-0" style={{ color: brandColor }} />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Security Card */}
          <motion.div
            className="rounded-lg border p-4 sm:p-5"
            style={{
              backgroundColor: isLight ? "#F0F9FF" : colors.background.primary,
              borderColor: isLight ? "#BAE6FD" : colors.border.primary,
            }}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.4, delay: 0.35 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <div
                className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: brandColor }}
              >
                <ShieldCheck size={14} strokeWidth={2.25} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold" style={titleColor}>
                Security & Compliance
              </h3>
            </div>
            <p className="text-sm sm:text-base leading-relaxed mb-3" style={muted}>
              {PAYMENT_METHOD.security}
            </p>
            <p className="text-xs sm:text-sm" style={muted}>
              Need help? Contact:{" "}
              <a href={`mailto:${PAYMENT_METHOD.support.email}`} className="underline font-medium" style={{ color: brandColor }}>
                {PAYMENT_METHOD.support.email}
              </a>
              {" · "}
              <a href={`tel:${PAYMENT_METHOD.support.phone.replace(/\s|-/g, "")}`} className="underline font-medium" style={{ color: brandColor }}>
                {PAYMENT_METHOD.support.phone}
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
