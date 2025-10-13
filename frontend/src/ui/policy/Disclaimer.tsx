import React from "react";
import { motion } from "framer-motion";
import { Link, BookOpen, Shield, AlertTriangle } from "lucide-react";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Disclaimer: React.FC = () => {
  const { colors } = useAdminThemeStyles();

  return (
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
          Disclaimer
        </h1>
        <p
          className="mt-4 text-lg max-w-3xl mx-auto leading-relaxed"
          style={{ color: colors.text.secondary }}
        >
          Please read this page carefully to understand the limitations, scope, and
          responsibilities regarding the information provided on{" "}
          <strong>Civil DigitalStore</strong>.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid gap-8">
        {/* Intro */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
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
          <p className="leading-relaxed text-lg">
            The information provided by <strong>Civil DigitalStore</strong> 
            (“we,” “us,” or “our”) on this website is for general informational 
            purposes only. All information is provided in good faith; however, 
            we make no representation or warranty of any kind regarding accuracy, 
            adequacy, validity, reliability, or completeness.
          </p>
        </motion.div>

        {/* External Links */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
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
              style={{ backgroundColor: colors.background.accent }}
            >
              <Link className="w-7 h-7" style={{ color: colors.interactive.primary }} />
            </div>
            <h2 style={{ color: colors.text.primary }} className="text-2xl font-semibold">
              External Links Disclaimer
            </h2>
          </div>
          <p className="leading-relaxed">
            This website may contain (or you may be sent through the site) links 
            to other websites. We do not investigate, monitor, or check such 
            external links for accuracy or reliability. We are not responsible 
            for any third-party websites.
          </p>
        </motion.div>

        {/* Professional Disclaimer */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
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
              style={{ backgroundColor: colors.background.accent }}
            >
              <BookOpen className="w-7 h-7" style={{ color: colors.interactive.primary }} />
            </div>
            <h2 style={{ color: colors.text.primary }} className="text-2xl font-semibold">
              Professional Disclaimer
            </h2>
          </div>
          <p className="leading-relaxed">
            The site cannot and does not contain legal, financial, or engineering 
            advice. Any information provided is for general informational and 
            educational purposes only and should not be relied upon as a substitute 
            for professional advice.
          </p>
        </motion.div>

        {/* Limitation of Liability */}
        <motion.div
          className="rounded-2xl shadow-md p-8 border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
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
              style={{ backgroundColor: colors.background.accent }}
            >
              <Shield className="w-7 h-7" style={{ color: colors.interactive.primary }} />
            </div>
            <h2 style={{ color: colors.text.primary }} className="text-2xl font-semibold">
              Limitation of Liability
            </h2>
          </div>
          <p className="leading-relaxed">
            Under no circumstances shall we be liable for any direct, indirect, 
            incidental, consequential, or special damages arising out of or in 
            any way connected with the use of this site.
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <div
        className="mt-12 text-center text-sm flex items-center justify-center gap-1"
        style={{ color: colors.text.secondary }}
      >
        <AlertTriangle className="w-5 h-5" style={{ color: colors.status.warning }} />
        <span>This disclaimer is subject to change without notice.</span>
      </div>
    </div>
  );
};

export default Disclaimer;
