import React from "react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { User, Database, Share2, Clock, CreditCard, ShieldCheck } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const PrivacyPolicy: React.FC = () => {
  const { colors } = useAdminThemeStyles();
  const { theme } = useAdminTheme();
  const isLight = theme === "light";

  const muted = { color: isLight ? "#475569" : colors.text.secondary };
  const titleColor = { color: isLight ? "#0A2A6B" : colors.text.primary };
  const subHeadColor = { color: isLight ? "#1E293B" : colors.text.primary };
  const brandColor = "#0A2A6B";

  const sections = [
    {
      icon: <User size={14} strokeWidth={2.25} />,
      title: "1. Who We Are",
      body: (
        <p className="text-sm sm:text-base leading-relaxed" style={muted}>
          Our website address is:{" "}
          <a
            href="https://softzcart.com"
            className="underline font-medium"
            style={{ color: brandColor }}
          >
            https://softzcart.com
          </a>
          .
        </p>
      ),
    },
    {
      icon: <Database size={14} strokeWidth={2.25} />,
      title: "2. What Personal Data We Collect & Why",
      body: (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-1" style={subHeadColor}>Comments</h4>
            <p className="text-sm sm:text-base leading-relaxed" style={muted}>
              When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mt-2" style={muted}>
              An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service. After approval of your comment, your profile picture is visible to the public in the context of your comment.
            </p>
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-1" style={subHeadColor}>Media</h4>
            <p className="text-sm sm:text-base leading-relaxed" style={muted}>
              If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
            </p>
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-1" style={subHeadColor}>Cookies</h4>
            <p className="text-sm sm:text-base leading-relaxed" style={muted}>
              If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mt-2" style={muted}>
              If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. When you log in, we will also set up several cookies to save your login information. Login cookies last for two days; screen options cookies last for a year.
            </p>
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-1" style={subHeadColor}>Embedded Content from Other Websites</h4>
            <p className="text-sm sm:text-base leading-relaxed" style={muted}>
              Articles on this site may include embedded content (e.g. videos, images, articles). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website. These websites may collect data about you, use cookies, and embed additional third-party tracking.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: <Share2 size={14} strokeWidth={2.25} />,
      title: "3. Who We Share Your Data With",
      body: (
        <p className="text-sm sm:text-base leading-relaxed" style={muted}>
          If you request a password reset, your IP address will be included in the reset email.
        </p>
      ),
    },
    {
      icon: <Clock size={14} strokeWidth={2.25} />,
      title: "4. How Long We Retain Your Data",
      body: (
        <div className="space-y-2">
          <p className="text-sm sm:text-base leading-relaxed" style={muted}>
            If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
          </p>
          <p className="text-sm sm:text-base leading-relaxed" style={muted}>
            For users that register on our website, we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time. Website administrators can also see and edit that information.
          </p>
        </div>
      ),
    },
    {
      icon: <CreditCard size={14} strokeWidth={2.25} />,
      title: "5. Payment Information Collection",
      body: (
        <p className="text-sm sm:text-base leading-relaxed" style={muted}>
          When you make a purchase on our website, your payment is processed by <strong>Razorpay</strong>, our trusted third-party payment processor. We do <strong>NOT</strong> store your complete credit/debit card numbers, CVV, or banking credentials on our servers. All sensitive payment information is securely handled by Razorpay's PCI-DSS Level 1 compliant infrastructure.
        </p>
      ),
    },
    {
      icon: <ShieldCheck size={14} strokeWidth={2.25} />,
      title: "6. Data Security & Compliance",
      body: (
        <p className="text-sm sm:text-base leading-relaxed" style={muted}>
          We implement industry-standard security measures to protect your personal and payment information. All data transmitted between your browser and our servers is encrypted using SSL/TLS protocols. In the event of a data breach affecting your payment information, we will notify you promptly in accordance with applicable data protection laws.
        </p>
      ),
    },
  ];

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
            style={titleColor}
          >
            Privacy Policy
          </h1>
          <p
            className="mt-2 sm:mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            style={muted}
          >
            Please read this page carefully to understand how we collect, use, and protect your personal information at <strong>Softzcart</strong>.
          </p>
        </div>

        {/* Sections */}
        <div className="px-4 py-5 sm:p-8 lg:p-10 space-y-4 sm:space-y-5">
          {sections.map(({ icon, title, body }, i) => (
            <motion.div
              key={title}
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
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div
                  className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  {icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold" style={titleColor}>
                  {title}
                </h3>
              </div>
              <div>{body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
