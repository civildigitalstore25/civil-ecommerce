import React from "react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { Info, Link2, BriefcaseBusiness, ShieldOff } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const sections = [
  {
    num: "0",
    icon: <Info size={14} strokeWidth={2.25} />,
    title: "General Disclaimer",
    body: (
      <p className="text-sm sm:text-base leading-relaxed">
        The information provided by <strong>Softzcart</strong> ("we," "us," or "our") on this website is for general informational purposes only. All information is provided in good faith; however, we make no representation or warranty of any kind regarding accuracy, adequacy, validity, reliability, or completeness.
      </p>
    ),
  },
  {
    num: "1",
    icon: <Link2 size={14} strokeWidth={2.25} />,
    title: "External Links Disclaimer",
    body: (
      <p className="text-sm sm:text-base leading-relaxed">
        This website may contain (or you may be sent through the site) links to other websites. We do not investigate, monitor, or check such external links for accuracy or reliability. We are not responsible for any third-party websites.
      </p>
    ),
  },
  {
    num: "2",
    icon: <BriefcaseBusiness size={14} strokeWidth={2.25} />,
    title: "Professional Disclaimer",
    body: (
      <p className="text-sm sm:text-base leading-relaxed">
        The site cannot and does not contain legal, financial, or engineering advice. Any information provided is for general informational and educational purposes only and should not be relied upon as a substitute for professional advice.
      </p>
    ),
  },
  {
    num: "3",
    icon: <ShieldOff size={14} strokeWidth={2.25} />,
    title: "Limitation of Liability",
    body: (
      <p className="text-sm sm:text-base leading-relaxed">
        Under no circumstances shall we be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with the use of this site.
      </p>
    ),
  },
];

const Disclaimer: React.FC = () => {
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
            Disclaimer
          </h1>
          <p
            className="mt-2 sm:mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ color: isLight ? "#475569" : colors.text.secondary }}
          >
            Please read this page carefully to understand the limitations, scope, and responsibilities regarding the information provided on{" "}
            <strong>Softzcart</strong>.
          </p>
        </div>

        {/* Sections */}
        <div className="px-4 py-5 sm:p-8 lg:p-10 space-y-4 sm:space-y-5">
          {sections.map(({ num, icon, title, body }, i) => (
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
                  {num !== "0" ? `${num}. ` : ""}{title}
                </h3>
              </div>

              {/* Body */}
              <div style={{ color: isLight ? "#475569" : colors.text.secondary }}>
                {body}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
