import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface GoogleReview {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  relative_time_description: string;
}

interface ReviewResponse {
  name: string;
  rating: number;
  total: number;
  reviews: GoogleReview[];
  lastUpdated?: string;
  nextUpdate?: string;
  stale?: boolean;
  message?: string;
}

const Reviews: React.FC = () => {
  const { colors } = useAdminTheme();

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
  const [data, setData] = useState<ReviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById("google-reviews-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get<ReviewResponse>("/api/google-reviews");
        setData(res.data);
      } catch (err: any) {
        console.error("Error fetching reviews:", err);

        const errorMsg =
          err.response?.data?.message ||
          "Failed to load reviews. Please try again later.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [isVisible]); // Loading State
  if (loading) {
    return (
      <section
        id="google-reviews-section"
        className="w-full py-16 transition-colors duration-200"
        style={{
          background: `linear-gradient(to right, ${colors.background.secondary}, ${colors.background.primary})`,
        }}
      >
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            Customer Reviews
          </h2>
          <p
            className="mt-2 text-lg transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            Loading reviews...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-20">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl shadow-md p-6 flex flex-col justify-between animate-pulse"
              style={{ backgroundColor: colors.background.primary }}
            >
              <div className="flex justify-center mb-4">
                <div className="h-5 w-20 bg-gray-300 rounded"></div>
              </div>
              <div className="mb-6">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section
        id="google-reviews-section"
        className="w-full py-16 transition-colors duration-200"
        style={{
          background: `linear-gradient(to right, ${colors.background.secondary}, ${colors.background.primary})`,
        }}
      >
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            Customer Reviews
          </h2>
          <p
            className="mt-2 text-lg transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            {error}
          </p>
        </div>
      </section>
    );
  }

  // No Reviews State
  if (!data || !data.reviews || data.reviews.length === 0) {
    return (
      <section
        id="google-reviews-section"
        className="w-full py-16 transition-colors duration-200"
        style={{
          background: `linear-gradient(to right, ${colors.background.secondary}, ${colors.background.primary})`,
        }}
      >
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            Customer Reviews
          </h2>
          <p
            className="mt-2 text-lg transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            No reviews available yet.
          </p>
        </div>
      </section>
    );
  }

  // Success State
  return (
    <section
      id="google-reviews-section"
      className="w-full py-16 transition-colors duration-200"
      style={{
        background: `linear-gradient(to right, ${colors.background.secondary}, ${colors.background.primary})`,
      }}
    >
      <div className="text-center mb-12">
        <h2
          className="text-3xl md:text-4xl font-bold transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          What Our Customers Say
        </h2>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(data.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span
            className="text-lg font-semibold transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            {data.rating.toFixed(1)}
          </span>
          <span
            className="text-sm transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            ({data.total.toLocaleString()} reviews)
          </span>
        </div>

        {/* Show stale data warning */}
        {data.stale && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto">
            <p className="text-sm text-yellow-800">
              ⚠️ {data.message || "Showing cached data"}
            </p>
          </div>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-20">
        {data.reviews.slice(0, 6).map((review, index) => (
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
              className="italic mb-6 transition-colors duration-200"
              style={{ color: colors.text.secondary }}
            >
              "{review.text || "No review text provided"}"
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
                  className="font-semibold transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  {review.author_name}
                </h4>
                <p
                  className="text-sm transition-colors duration-200"
                  style={{ color: colors.text.secondary }}
                >
                  {review.relative_time_description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.lastUpdated && (
        <div className="text-center mt-8">
          <p
            className="text-xs transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </div>
      )}
    </section>
  );
};

export default Reviews;
