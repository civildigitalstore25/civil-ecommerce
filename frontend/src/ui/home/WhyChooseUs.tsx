import React from "react";
import { CheckCircle, Shield, Zap, Users } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const features = [
  {
    icon: CheckCircle,
    title: "100% Genuine",
    description: "Authentic licenses from authorized vendors",
    color: "text-green-700",
  },
  {
    icon: Shield,
    title: "Secure Checkout",
    description: "SSL encrypted with UPI & card payments",
    color: "text-blue-700",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "License keys within minutes of purchase",
    color: "text-purple-700",
  },
  {
    icon: Users,
    title: "24/7 Support",
    description: "Dedicated installation & licensing help",
    color: "text-orange-700",
  },
];

const WhyChooseUs: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <section
      className="w-full rounded-3xl shadow-sm py-14 px-6 md:px-20 transition-colors duration-200"
      style={{
        background: `linear-gradient(to right, ${colors.background.secondary}, ${colors.background.primary})`,
      }}
    >
      {/* Heading */}
      <div className="text-center mb-14">
        <h2
          className="text-3xl md:text-4xl font-bold transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Why Choose CivilDigitalStore?
        </h2>
        <p
          className="mt-3 text-lg transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Trusted by engineers worldwide for authentic software solutions
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-md rounded-2xl p-6"
              style={{ backgroundColor: colors.background.primary }}
            >
              <div
                className="flex items-center justify-center w-16 h-16 rounded-xl shadow-sm transition-colors duration-200"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <IconComponent
                  className="h-8 w-8"
                  style={{ color: colors.interactive.primary }}
                />
              </div>
              <h3
                className="mt-5 text-lg font-semibold transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm mt-2 max-w-[220px] transition-colors duration-200"
                style={{ color: colors.text.secondary }}
              >
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseUs;
