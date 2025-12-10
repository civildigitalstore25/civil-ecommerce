import React from "react";
import { useNavigate } from "react-router-dom";
import FormButton from "../../components/Button/FormButton";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

type Offer = {
  id: string | number;
  title: string;
  desc: string;
  img?: string; // optional; uses generic placeholder if not provided
  to?: string;
};

const defaultOffers: Offer[] = [
  {
    id: 1,
    title: "Exclusive offers on MS Office Packages",
    desc: "Genuine Office suite licenses at unbeatable prices.",

    to: "/products",
  },
  {
    id: 2,
    title: "Elementor Pro at just ₹449",
    desc: "Build beautiful websites with premium Elementor Pro.",

    to: "/products",
  },
];

const MinimalOffers: React.FC<{ offers?: Offer[] }> = ({
  offers = defaultOffers,
}) => {
  const navigate = useNavigate();
  const { colors } = useAdminTheme();

  return (
    <section
      className="w-full rounded-2xl md:rounded-3xl shadow-sm py-6 md:py-14 px-2 md:px-6 lg:px-20 transition-colors duration-200"
      style={{
        background: colors.background.primary,
      }}
    >
      <div className="max-w-7xl mx-auto px-2 md:px-6">
        {/* Heading */}
        <div className="text-center mb-4 md:mb-10">
          <h2
            className="text-xl md:text-3xl lg:text-4xl font-bold transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            Exclusive Offers 
          </h2>
          <p
            className="mt-1 md:mt-3 text-xs md:text-lg transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            Limited-time deals — clean, simple and attention grabbing.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-2 md:gap-8">
          {offers.map((o) => (
            <div
              key={o.id}
              className="group relative backdrop-blur-sm rounded-lg md:rounded-2xl p-2 md:p-6 flex flex-col justify-between overflow-hidden border transition-all duration-500 hover:scale-[1.02]"
              style={{
                background: colors.background.secondary,
                borderColor: colors.border.primary,
                boxShadow: `0 0 25px ${colors.interactive.primary}20`,
              }}
            >
              {/* content */}
              <div className="relative z-10 flex flex-col md:flex-row items-start gap-2 md:gap-4">
                {/* image (optional) */}
                <div
                  className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                  style={{ background: colors.background.primary }}
                >
                  <svg
                    className="w-6 h-6 md:w-10 md:h-10 transition-colors duration-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    style={{ color: colors.interactive.primary }}
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="4"
                      fill="currentColor"
                      opacity="0.12"
                    />
                    <path
                      d="M7 12h10M7 8h6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <h3
                    className="text-xs md:text-lg font-semibold transition-colors duration-200 line-clamp-2"
                    style={{ color: colors.text.primary }}
                  >
                    {o.title}
                  </h3>
                  <p
                    className="text-[9px] md:text-sm mt-0.5 md:mt-1 transition-colors duration-200 line-clamp-2"
                    style={{ color: colors.text.secondary }}
                  >
                    {o.desc}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="relative z-10 mt-2 md:mt-6">
                <FormButton
                  onClick={() => navigate(o.to || "/products")}
                  className="w-full relative overflow-hidden font-medium py-1 md:py-2 rounded-md md:rounded-lg text-[10px] md:text-base transition-all duration-300 hover:scale-105"
                  style={{
                    background: colors.interactive.primary,
                    color: colors.text.inverse,
                    boxShadow: `0 0 20px ${colors.interactive.primary}60`,
                    border: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = colors.interactive.primaryHover;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = colors.interactive.primary;
                  }}
                >
                  <span className="relative z-10">View Offer</span>
                  {/* shine effect */}
                  <span
                    className="absolute left-[-40%] top-0 w-1/2 h-full transform skew-x-[-20deg] opacity-0 group-hover:opacity-80 transition-all duration-500"
                    style={{ backgroundColor: `${colors.background.primary}20` }}
                  />
                </FormButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MinimalOffers;
