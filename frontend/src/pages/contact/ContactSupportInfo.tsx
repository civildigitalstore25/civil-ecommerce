import React from "react";

type Props = {
  theme: string;
  colors: any;
};

export const ContactSupportInfo: React.FC<Props> = ({ theme, colors }) => {
  return (
    <div className="lg:col-span-2 p-10">
      {/* Support Availability */}
      <div
        className="rounded-lg p-5 w-full"
        style={{
          backgroundColor: theme === "light" ? "#F0F9FF" : colors.background.secondary,
          border: `2px solid ${theme === "light" ? "#0EA5E9" : colors.border.primary}`,
        }}
      >
        <h3
          className="text-lg font-bold mb-3"
          style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
        >
          Support Availability
        </h3>
        <p className="text-sm mb-2" style={{ color: theme === "light" ? "#1E293B" : colors.text.primary }}>
          Our support team operates 24×7 to assist you with your queries and orders.
        </p>
        <ul className="text-sm space-y-1 ml-4" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
          <li className="list-disc">Standard queries are answered 24×7</li>
          <li className="list-disc">Urgent issues are monitored and responded to even outside these hours</li>
        </ul>
        <p className="text-sm mt-3 font-semibold" style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>
          Whether day or night, our team ensures that no important query goes unanswered.
        </p>
      </div>

      {/* Common Support Topics */}
      <div
        className="rounded-lg p-5 w-full mt-6"
        style={{
          backgroundColor: theme === "light" ? "#FFF7ED" : colors.background.secondary,
          border: `2px solid ${theme === "light" ? "#FB923C" : colors.border.primary}`,
        }}
      >
        <h3
          className="text-lg font-bold mb-3"
          style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
        >
          Common Support Topics
        </h3>
        <ul className="text-sm space-y-2 ml-4" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
          <li className="list-disc">Assistance with software activation or installation</li>
          <li className="list-disc">Non-receipt of license key within the standard delivery timeframe</li>
          <li className="list-disc">Clarifications regarding product versions (OEM, Retail, Volume, etc.)</li>
          <li className="list-disc">Requests for GST-compliant invoices</li>
          <li className="list-disc">Help with re-activation or lost license keys</li>
          <li className="list-disc">Business inquiries, partnerships, or general feedback</li>
        </ul>
      </div>

      {/* Stay Connected */}
      <div
        className="rounded-lg p-5 w-full mt-6"
        style={{
          backgroundColor: theme === "light" ? "#F0FDF4" : colors.background.secondary,
          border: `2px solid ${theme === "light" ? "#4ADE80" : colors.border.primary}`,
        }}
      >
        <h3
          className="text-lg font-bold mb-3"
          style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
        >
          Stay Connected
        </h3>
        <p className="text-sm mb-3" style={{ color: theme === "light" ? "#1E293B" : colors.text.primary }}>
          Stay updated with the latest offers, new product launches, and software tips:
        </p>
        <ul className="text-sm space-y-1 ml-4" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
          <li className="list-disc">Subscribe to our newsletter</li>
          <li className="list-disc">Save our customer support number for fast assistance</li>
        </ul>
        <p className="text-sm mt-3 font-semibold" style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>
          We are here to ensure you have a smooth, safe, and reliable digital buying experience.
        </p>
      </div>
    </div>
  );
};
