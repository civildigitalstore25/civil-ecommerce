import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const TermsAndConditions: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <div
      className="min-h-screen py-12 px-4 transition-colors duration-200"
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
          Terms and Conditions
        </h1>

        {/* Intro */}
        <p
          className="text-lg mb-6 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Welcome to <strong>Civil DigitalStore</strong>! These terms and
          conditions outline the rules and regulations for the use of Civil
          DigitalStore Website, located at{" "}
          <a
            href="https://civildigitalstore.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline transition-colors duration-200"
            style={{ color: colors.interactive.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.interactive.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.interactive.primary;
            }}
          >
            https://civildigitalstore.com/
          </a>
          .
        </p>

        <p
          className="mb-6 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          By accessing this website, we assume you accept these terms and
          conditions. Do not continue to use Civil DigitalStore if you do not
          agree with all the terms and conditions stated on this page.
        </p>

        {/* Cookies */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Cookies
        </h2>
        <p
          className="mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          We employ the use of cookies. By accessing Civil DigitalStore, you
          agree to use cookies in accordance with our{" "}
          <strong>Privacy Policy</strong>. Most interactive websites use cookies
          to retrieve user details for each visit.
        </p>

        {/* License */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          License
        </h2>
        <p
          className="mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Unless otherwise stated, Civil DigitalStore and/or its licensors own
          the intellectual property rights for all material on this website. All
          rights are reserved. You may access this for your personal use subject
          to restrictions set in these terms.
        </p>
        <ul
          className="list-disc pl-6 space-y-2 transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          <li>Do not republish material from Civil DigitalStore</li>
          <li>Do not sell, rent or sub-license material</li>
          <li>Do not reproduce, duplicate or copy material</li>
          <li>Do not redistribute content without permission</li>
        </ul>

        {/* Hyperlinking */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Hyperlinking to our Content
        </h2>
        <p
          className="mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          The following organizations may link to our Website without prior
          written approval:
        </p>
        <ul
          className="list-disc pl-6 space-y-2 transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          <li>Government agencies</li>
          <li>Search engines</li>
          <li>News organizations</li>
          <li>Online directory distributors</li>
        </ul>

        {/* iFrames */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          iFrames
        </h2>
        <p
          className="mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Without prior approval and written permission, you may not create
          frames around our Webpages that alter the visual presentation or
          appearance of our Website.
        </p>

        {/* Content Liability */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Content Liability
        </h2>
        <p
          className="mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          We shall not be held responsible for any content that appears on your
          website. You agree to protect and defend us against all claims that
          arise on your site.
        </p>

        {/* Disclaimer */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Disclaimer
        </h2>
        <p
          className="mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          To the maximum extent permitted by law, we exclude all
          representations, warranties, and conditions relating to our website
          and the use of this website. Nothing in this disclaimer will:
        </p>
        <ul
          className="list-disc pl-6 space-y-2 transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          <li>Limit or exclude liability for death or personal injury</li>
          <li>
            Limit or exclude liability for fraud or fraudulent misrepresentation
          </li>
          <li>
            Exclude any liabilities that may not be excluded under applicable
            law
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TermsAndConditions;
