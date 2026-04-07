import React from "react";

type Props = {
  theme: string;
  colors: any;
};

export const ContactPageIntro: React.FC<Props> = ({ theme, colors }) => {
  return (
    <div className="p-10 pb-5">
      <div
        className="rounded-lg p-6"
        style={{
          backgroundColor: theme === "light" ? "#F8FAFC" : colors.background.primary,
          border: `1px solid ${theme === "light" ? "#E2E8F0" : colors.border.primary}`,
        }}
      >
        <p
          className="text-base leading-relaxed mb-4"
          style={{ color: theme === "light" ? "#1E293B" : colors.text.primary }}
        >
          At SoftZcart, customer satisfaction is our top priority. Whether you have a question about a product, need assistance with activation, want to check your order status, or have any feedback, our support team is ready to help you at every step.
        </p>
        <p
          className="text-base leading-relaxed"
          style={{ color: theme === "light" ? "#1E293B" : colors.text.primary }}
        >
          We understand how important genuine digital software is for your work, studies, and security. Our dedicated support team is committed to providing quick responses, expert guidance, and a personalized experience.
        </p>
      </div>
    </div>
  );
};
