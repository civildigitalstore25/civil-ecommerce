import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const ReturnPolicy: React.FC = () => {
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
          Return and Refund Policy
        </h1>

        {/* Last Updated */}
        <p
          className="text-sm mb-6 text-center transition-colors duration-200"
          style={{ color: colors.text.accent }}
        >
          Last updated: July 12, 2023
        </p>

        {/* Intro */}
        <p
          className="text-lg mb-6 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Thank you for shopping at <strong>Civil DigitalStore</strong>.
        </p>
        <p
          className="mb-6 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          If, for any reason, you are not completely satisfied with a purchase,
          we invite you to review our policy on refunds and returns. The
          following terms are applicable for any products that you purchased
          with us.
        </p>

        {/* Interpretation and Definitions */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Interpretation and Definitions
        </h2>
        <h3
          className="text-xl font-semibold mb-2 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Interpretation
        </h3>
        <p
          className="mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          The words of which the initial letter is capitalized have meanings
          defined under the following conditions. The following definitions
          shall have the same meaning regardless of whether they appear in
          singular or in plural.
        </p>

        <h3
          className="text-xl font-semibold mb-2 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Definitions
        </h3>
        <p
          className="mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          For the purposes of this Return and Refund Policy:
        </p>
        <ul
          className="list-disc pl-6 space-y-2 transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          <li>
            <strong>Company</strong>: Civil Engineering DigitalStore.
          </li>
          <li>
            <strong>Goods</strong>: Items offered for sale on the Service.
          </li>
          <li>
            <strong>Orders</strong>: A request by You to purchase Goods from Us.
          </li>
          <li>
            <strong>Service</strong>: Refers to the Website.
          </li>
          <li>
            <strong>Website</strong>: Civil Engineering Data, accessible from{" "}
            <a
              href="https://civildigitalstore.com/"
              className="text-violet-700 font-semibold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://civildigitalstore.com/
            </a>
          </li>
          <li>
            <strong>You</strong>: The individual or entity accessing or using
            the Service.
          </li>
        </ul>

        {/* Cancellation Rights */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Your Order Cancellation Rights
        </h2>
        <p
          className=" mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          You are entitled to cancel your order within 7 days without giving any
          reason. The deadline is 7 days from the date you received the goods or
          a third party (not the carrier) took possession.
        </p>
        <p
          className=" mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          To exercise your right of cancellation, inform us via:
        </p>
        <ul
          className="list-disc pl-6 space-y-2  transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          <li>📧 Email: civildigitalstore@gmail.com</li>
          <li>📞 Phone: 8807423228</li>
        </ul>
        <p
          className=" mb-6 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          We will reimburse you within 14 days of receiving the returned goods,
          using the same payment method with no fees.
        </p>

        {/* Conditions for Returns */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Conditions for Returns
        </h2>
        <p
          className=" mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          To be eligible for a return:
        </p>
        <ul
          className="list-disc pl-6 space-y-2  transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          <li>
            Refunds are processed within 2–3 business days after inspection.
          </li>
          <li>
            The following goods cannot be returned:
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Customized or personalized goods.</li>
              <li>Goods that deteriorate quickly or are expired.</li>
              <li>
                Unsealed goods unsuitable for return due to hygiene reasons.
              </li>
              <li>Goods inseparably mixed with other items after delivery.</li>
            </ul>
          </li>
        </ul>
        <p
          className=" mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          We reserve the right to refuse returns that don’t meet these
          conditions. Sale items are non-refundable unless required by law.
        </p>

        {/* Returning Goods */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Returning Goods
        </h2>
        <p
          className=" mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          You are responsible for the cost and risk of returning goods. Since
          this is a digital product, returns generally do not apply.
        </p>
        <p
          className=" mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          We recommend using an insured and trackable mail service. Refunds
          require proof of return delivery.
        </p>

        {/* Gifts */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Gifts
        </h2>
        <p
          className=" mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          If marked as a gift, you’ll receive a gift credit. Otherwise, refunds
          go to the original purchaser.
        </p>

        {/* Contact */}
        <h2
          className="text-2xl font-semibold mt-10 mb-4 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Contact Us
        </h2>
        <p
          className=" mb-4 leading-relaxed transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Questions about this policy?
        </p>
        <ul
          className="list-disc pl-6 space-y-2  transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          <li>📧 Email: civildigitalstore@gmail.com</li>
          <li>📞 Phone: 8807423228</li>
        </ul>
      </div>
    </div>
  );
};

export default ReturnPolicy;
