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
      className="w-full rounded-2xl sm:rounded-3xl shadow-sm py-6 sm:py-14 px-2 sm:px-6 md:px-20 transition-colors duration-200"
      style={{
        background: `linear-gradient(to right, ${colors.background.secondary}, ${colors.background.primary})`,
      }}
    >
      {/* Heading */}
      <div className="text-center mb-4 sm:mb-14">
        <h2
          className="text-lg sm:text-3xl md:text-4xl font-poppins font-bold transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Why Choose CivilDigitalStore?
        </h2>
        <p
          className="mt-1 sm:mt-3 text-xs sm:text-lg font-lato transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Trusted by engineers worldwide for authentic software solutions
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-10 text-center">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-md rounded-lg sm:rounded-2xl p-2 sm:p-6"
              style={{ backgroundColor: colors.background.primary }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl shadow-sm transition-colors duration-200"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <IconComponent
                  className="h-5 w-5 sm:h-8 sm:w-8"
                  style={{ color: colors.interactive.primary }}
                />
              </div>
              <h3
                className="mt-2 sm:mt-5 text-[10px] sm:text-lg font-poppins font-semibold transition-colors duration-200 line-clamp-2"
                style={{ color: colors.text.primary }}
              >
                {feature.title}
              </h3>
              <p
                className="text-[8px] sm:text-sm mt-1 sm:mt-2 max-w-[220px] font-lato transition-colors duration-200 line-clamp-2"
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
