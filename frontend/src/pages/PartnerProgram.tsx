import React from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle,
  ClipboardCheck,
  Gift,
  Handshake,
  HelpCircle,
  Mail,
  Phone,
  Rocket,
  Send,
  Users,
} from "lucide-react";
import { useAdminThemeStyles } from "../hooks/useAdminThemeStyles";
import { useAdminTheme } from "../contexts/AdminThemeContext";

const applicationFormUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSdzCiJIUqdamM2KWNWbrhVmS5WIFikPH00P3h0cHno-5ZGZpQ/viewform";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const checklistItemClass = "flex items-start gap-2 text-sm sm:text-base";

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <li className={checklistItemClass}>
    <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#0A2A6B" }} />
    <span>{children}</span>
  </li>
);

const sections = [
  {
    num: "1",
    icon: <Handshake size={14} strokeWidth={2.25} />,
    title: "Program Overview",
    content: (
      <div className="space-y-3 text-sm sm:text-base leading-relaxed">
        <p>
          The Softzcart Partner Program is built for software resellers, IT professionals, affiliates, and business partners across India who want to grow with genuine digital licenses.
        </p>
        <p>
          We help partners offer trusted Windows, MS Office, Adobe, AutoCAD, and Antivirus software keys while earning discounts, cashback vouchers, and monthly incentives.
        </p>
      </div>
    ),
  },
  {
    num: "2",
    icon: <Gift size={14} strokeWidth={2.25} />,
    title: "Why Join",
    content: (
      <ul className="space-y-1.5">
        <CheckItem>Exclusive partner discount coupons on every order.</CheckItem>
        <CheckItem>Monthly cashback vouchers based on eligible sales.</CheckItem>
        <CheckItem>Priority partner support within 24 hours.</CheckItem>
        <CheckItem>Simple onboarding with minimal documentation.</CheckItem>
        <CheckItem>High-demand genuine software products for your customer base.</CheckItem>
      </ul>
    ),
  },
  {
    num: "3",
    icon: <ClipboardCheck size={14} strokeWidth={2.25} />,
    title: "How It Works",
    content: (
      <div className="space-y-4 text-sm sm:text-base leading-relaxed">
        <div>
          <p className="font-semibold">Submit your details</p>
          <ul className="mt-2 space-y-1.5">
            <CheckItem>Company name and address</CheckItem>
            <CheckItem>GST number, if available</CheckItem>
            <CheckItem>Contact number and email ID</CheckItem>
            <CheckItem>Aadhaar and PAN card</CheckItem>
            <CheckItem>Visiting card, GST certificate, or other address proof</CheckItem>
          </ul>
        </div>
        <p>
          Our team reviews your application and contacts you within 24 hours. Once approved, you receive a unique partner coupon code.
        </p>
        <p>
          Use your coupon code for discounts, earn cashback vouchers from monthly sales, and redeem those vouchers on Softzcart purchases.
        </p>
      </div>
    ),
  },
  {
    num: "4",
    icon: <Users size={14} strokeWidth={2.25} />,
    title: "Who Can Join",
    content: (
      <ul className="space-y-1.5">
        <CheckItem>Windows, MS Office, Adobe, and AutoCAD resellers or distributors.</CheckItem>
        <CheckItem>IT professionals and security consultants.</CheckItem>
        <CheckItem>E-commerce owners and website developers.</CheckItem>
        <CheckItem>Corporate buyers and bulk purchase teams.</CheckItem>
        <CheckItem>Freelancers, influencers, and affiliates with a software buyer network.</CheckItem>
      </ul>
    ),
  },
  {
    num: "5",
    icon: <Rocket size={14} strokeWidth={2.25} />,
    title: "Partner Benefits",
    content: (
      <ul className="space-y-1.5">
        <CheckItem>Earn more with every sale through additional cashback vouchers.</CheckItem>
        <CheckItem>Build a long-term partnership with a trusted software brand.</CheckItem>
        <CheckItem>Offer fast-moving products like Windows, MS Office, Adobe, AutoCAD, and Antivirus keys.</CheckItem>
        <CheckItem>Give customers instant activation and secure transactions.</CheckItem>
      </ul>
    ),
  },
  {
    num: "6",
    icon: <Send size={14} strokeWidth={2.25} />,
    title: "How to Apply",
    content: (
      <p className="text-sm sm:text-base leading-relaxed">
        Fill out the Partner Program application form and our team will review your details.{" "}
        <a
          href={applicationFormUrl}
          className="font-semibold underline underline-offset-4"
          style={{ color: "#0A2A6B" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply now
        </a>
      </p>
    ),
  },
  {
    num: "7",
    icon: <HelpCircle size={14} strokeWidth={2.25} />,
    title: "Frequently Asked Questions",
    content: (
      <div className="space-y-3 text-sm sm:text-base leading-relaxed">
        <p>
          <strong>How long does approval take?</strong>
          <br />
          We usually review and approve partner applications within 24 hours of submission.
        </p>
        <p>
          <strong>Is there any fee to join?</strong>
          <br />
          No, joining the Softzcart Partner Program is free.
        </p>
        <p>
          <strong>Can I refer other partners?</strong>
          <br />
          Yes, you can refer others and expand the network while earning additional incentives.
        </p>
      </div>
    ),
  },
  {
    num: "8",
    icon: <BadgeCheck size={14} strokeWidth={2.25} />,
    title: "Contact Details",
    content: (
      <div className="space-y-2 text-sm sm:text-base leading-relaxed">
        <p className="flex items-center gap-2">
          <Phone size={15} className="shrink-0" style={{ color: "#0A2A6B" }} />
          <a href="tel:+919042993986" className="underline underline-offset-4">
            +91-90429 93986
          </a>
        </p>
        <p className="flex items-center gap-2">
          <Mail size={15} className="shrink-0" style={{ color: "#0A2A6B" }} />
          <a href="mailto:softzcart@gmail.com" className="underline underline-offset-4">
            softzcart@gmail.com
          </a>
        </p>
        <p className="flex items-center gap-2">
          <BriefcaseBusiness size={15} className="shrink-0" style={{ color: "#0A2A6B" }} />
          <a
            href="https://www.softzcart.com"
            className="underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.softzcart.com
          </a>
        </p>
      </div>
    ),
  },
];

const PartnerProgram: React.FC = () => {
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
            Partner Program
          </h1>
          <p
            className="mt-2 sm:mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ color: isLight ? "#475569" : colors.text.secondary }}
          >
            Unlock exclusive benefits with Softzcart through genuine software licenses, partner discounts, cashback vouchers, and priority support.
          </p>
        </div>

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

              <div style={{ color: isLight ? "#475569" : colors.text.secondary }}>{content}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerProgram;
