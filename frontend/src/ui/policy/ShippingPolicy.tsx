import React from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Globe,
  RotateCcw,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";


const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const ShippingPolicy: React.FC = () => {
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
          Shipping & Delivery Policy
        </h1>
        <p className="mt-3 text-sm" style={{ color: colors.text.secondary }}>
          Last updated: July 10, 2023
        </p>
        <p
          className="mt-6 text-lg max-w-3xl mx-auto leading-relaxed"
          style={{ color: colors.text.secondary }}
        >
          This Shipping & Delivery Policy is part of our{" "}
          <a
            href="https://www.softzcart.com/terms-and-conditions/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.interactive.primary }}
            className="font-semibold hover:underline"
          >
            Terms and Conditions
          </a>
          . Please review it carefully before placing an order.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid gap-8">
        {/* Shipping Options */}
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
              <Truck
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Shipping Options
            </h2>
          </div>
          <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
            <strong>Free Shipping:</strong> We offer free Instant Download
            shipping on all orders placed through{" "}
            <strong style={{ color: colors.interactive.primary }}>
              Softzcart
            </strong>
            .
          </p>
        </motion.div>

        {/* International Delivery */}
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
              <Globe
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              International Delivery
            </h2>
          </div>
          <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
            Currently, we do not offer international shipping. Our services are
            available only within India.
          </p>
        </motion.div>

        {/* Returns & Refunds */}
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
              <RotateCcw
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Returns & Refunds
            </h2>
          </div>
          <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
            If you have questions about returns, please review our{" "}
            <a
              href="https://www.softzcart.com/return-and-refund-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: colors.interactive.primary }}
              className="font-semibold hover:underline"
            >
              Return and Refund Policy
            </a>
            .
          </p>
        </motion.div>

        {/* Contact Info */}
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
              <MessageSquare
                className="w-7 h-7"
                style={{ color: colors.interactive.primary }}
              />
            </div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Contact Us
            </h2>
          </div>
          <p
            className="leading-relaxed mb-4"
            style={{ color: colors.text.secondary }}
          >
            If you have any further questions or comments about this Shipping
            Policy, you may contact us by:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li
              className="flex items-center gap-2"
              style={{ color: colors.text.secondary }}
            >
              <Phone
                className="w-4 h-4"
                style={{ color: colors.interactive.primary }}
              />{" "}
              +91 9042993986
            </li>
            <li
              className="flex items-center gap-2"
              style={{ color: colors.text.secondary }}
            >
              <Mail
                className="w-4 h-4"
                style={{ color: colors.interactive.primary }}
              />{" "}
              softzcart@gmail.com
            </li>
            <li
              className="flex items-center gap-2"
              style={{ color: colors.text.secondary }}
            >
              <MessageSquare
                className="w-4 h-4"
                style={{ color: colors.interactive.primary }}
              />
              <a
                href="https://softzcart.com/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.interactive.primary }}
                className="font-semibold hover:underline"
              >
                Contact Form
              </a>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Footer Notice */}
      <div
        className="mt-12 text-center text-sm"
        style={{ color: colors.text.secondary }}
      >
        This Shipping Policy is subject to change without prior notice.
      </div>
    </div>
  );
};

export default ShippingPolicy;
