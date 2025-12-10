import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
}

// Static review data - Only 3 reviews
const staticReviews: Review[] = [
  {
    author_name: "Rajesh Kumar",
    rating: 5,
    text: "Excellent service! Got my software license instantly. The support team was very helpful in guiding me through the installation process.",
    relative_time_description: "2 weeks ago",
  },
  {
    author_name: "Priya Sharma",
    rating: 5,
    text: "Best place to buy genuine software at affordable prices. I purchased Microsoft Office and the activation was seamless. Highly recommended!",
    relative_time_description: "1 month ago",
  },
  {
    author_name: "Amit Patel",
    rating: 4,
    text: "Great collection of software products. Delivery was quick and customer support responded promptly to my queries. Will buy again!",
    relative_time_description: "3 weeks ago",
  },
];

const Reviews: React.FC = () => {
  const { colors } = useAdminTheme();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Auto-play carousel for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % staticReviews.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Function to generate initials avatar
  const getInitialsAvatar = (name: string) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const bgColor = colors.interactive.primary || "#3B82F6";
    const textColor = "#ffffff";

    // Create SVG data URL for initials avatar
    const svg = `
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="${bgColor}"/>
        <text x="24" y="28" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="${textColor}">${initials}</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Calculate average rating
  const averageRating =
    staticReviews.reduce((sum, review) => sum + review.rating, 0) /
    staticReviews.length;
  const totalReviews = staticReviews.length;

  return (
    <section
      id="reviews-section"
      className="w-full py-16 transition-colors duration-200"
      style={{
        background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
      }}
    >
      <div className="text-center mb-8 md:mb-12 px-4">
        <h2
          className="text-2xl md:text-4xl font-poppins font-bold transition-colors duration-200 mb-2"
          style={{
            color: colors.text.primary,
            textShadow: `0 2px 8px ${colors.background.primary}80`,
          }}
        >
          What Our Customers Say
        </h2>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 md:h-5 md:w-5 ${i < Math.floor(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span
            className="text-base md:text-lg font-poppins font-semibold transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            {averageRating.toFixed(1)}
          </span>
          <span
            className="text-xs md:text-sm font-lato transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            ({totalReviews} reviews)
          </span>
        </div>
      </div>

      {/* Desktop Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 gap-8 px-6 md:px-20">
        {staticReviews.map((review, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-md p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            style={{ backgroundColor: colors.background.primary }}
          >
            {/* Stars */}
            <div className="flex justify-center mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>

            {/* Review text */}
            <p
              className="italic mb-6 font-lato transition-colors duration-200"
              style={{ color: colors.text.secondary }}
            >
              "{review.text}"
            </p>

            {/* Profile */}
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-full border-2 transition-colors duration-200 overflow-hidden flex-shrink-0"
                style={{ borderColor: colors.interactive.primary }}
              >
                <img
                  src={getInitialsAvatar(review.author_name)}
                  alt={review.author_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4
                  className="font-poppins font-semibold transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  {review.author_name}
                </h4>
                <p
                  className="text-sm font-lato transition-colors duration-200"
                  style={{ color: colors.text.secondary }}
                >
                  {review.relative_time_description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden w-full px-4">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentReviewIndex * 100}%)`,
            }}
          >
            {staticReviews.map((review, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 px-2"
              >
                <div
                  className="rounded-xl shadow-lg p-5 flex flex-col justify-between"
                  style={{ backgroundColor: colors.background.primary }}
                >
                  {/* Stars */}
                  <div className="flex justify-center mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p
                    className="italic mb-4 text-sm text-center font-lato transition-colors duration-200"
                    style={{ color: colors.text.secondary }}
                  >
                    "{review.text}"
                  </p>

                  {/* Profile */}
                  <div className="flex items-center justify-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full border-2 transition-colors duration-200 overflow-hidden flex-shrink-0"
                      style={{ borderColor: colors.interactive.primary }}
                    >
                      <img
                        src={getInitialsAvatar(review.author_name)}
                        alt={review.author_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4
                        className="font-poppins font-semibold text-sm transition-colors duration-200"
                        style={{ color: colors.text.primary }}
                      >
                        {review.author_name}
                      </h4>
                      <p
                        className="text-xs font-lato transition-colors duration-200"
                        style={{ color: colors.text.secondary }}
                      >
                        {review.relative_time_description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {staticReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReviewIndex(index)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  currentReviewIndex === index
                    ? colors.interactive.primary
                    : colors.border.primary,
              }}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
