import React from "react";

export const ContactPageHeader: React.FC = () => {
  return (
    <div
      className="px-4 py-7 sm:p-10 text-center"
      style={{
        background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
      }}
    >
      <h1
        className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold"
        style={{ color: "#fff" }}
      >
        Contact Us
      </h1>
      <p
        className="mx-auto max-w-xl text-sm sm:text-base opacity-90"
        style={{ color: "#fff" }}
      >
        Customer satisfaction is our top priority. Our support team is ready to help you at every step.
      </p>
    </div>
  );
};
