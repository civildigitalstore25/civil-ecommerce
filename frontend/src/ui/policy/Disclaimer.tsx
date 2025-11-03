import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const Disclaimer: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <div
      className="min-h-screen py-12 px-4 pt-20 transition-colors duration-200"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div
        className="max-w-4xl mx-auto rounded-2xl shadow-lg p-8 md:p-12 transition-colors duration-200"
        style={{ backgroundColor: colors.background.primary }}
      >
        {/* Title */}
        <h1
          className="text-4xl font-extrabold mb-8 text-center transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Disclaimer
        </h1>

        {/* Intro */}
        <p
          className="text-lg mb-6 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          The information provided by <strong>Civil DigitalStore</strong> (“we,”
          “us,” or “our”) on this website is for general informational purposes
          only. All information is provided in good faith; however, we make no
          representation or warranty of any kind regarding accuracy, adequacy,
          validity, reliability, or completeness.
        </p>

        {/* External Links Disclaimer */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          External Links Disclaimer
        </h2>
        <p
          className="mb-6 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          This website may contain (or you may be sent through the site) links
          to other websites. We do not investigate, monitor, or check such
          external links for accuracy or reliability. We are not responsible for
          any third-party websites.
        </p>

        {/* Professional Disclaimer */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Professional Disclaimer
        </h2>
        <p
          className="mb-6 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          The site cannot and does not contain legal, financial, or engineering
          advice. Any information provided is for general informational and
          educational purposes only and should not be relied upon as a
          substitute for professional advice.
        </p>

        {/* Limitation of Liability */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Limitation of Liability
        </h2>
        <p
          className="mb-6 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Under no circumstances shall we be liable for any direct, indirect,
          incidental, consequential, or special damages arising out of or in any
          way connected with the use of this site.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
