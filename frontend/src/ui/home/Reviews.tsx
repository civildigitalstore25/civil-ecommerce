import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { getRecentReviews, type Review as ApiReview } from "../../api/reviewApi";

const Reviews: React.FC = () => {
  const { colors } = useAdminTheme();
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recent reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await getRecentReviews(21);
        setReviews(data.reviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

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

  if (isLoading) {
    return (
      <section
        id="reviews-section"
        className="w-full py-16 transition-colors duration-200"
        style={{
          background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
          border: 'none',
          boxShadow: 'none',
          borderRadius: 0,
        }}
      >
        <div className="text-center px-4">
          <div style={{ color: colors.text.secondary }}>Loading reviews...</div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  // Duplicate reviews multiple times for seamless infinite scroll
  const allReviews = [...reviews, ...reviews];

  return (
    <section
      id="reviews-section"
      className="w-full py-16 transition-colors duration-200 overflow-hidden"
      style={{
        background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
        border: 'none',
        boxShadow: 'none',
        borderRadius: 0,
      }}
    >
      <style>{`
        @keyframes scroll-reviews {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-reviews {
          animation: scroll-reviews ${reviews.length * 3}s linear infinite;
          will-change: transform;
        }
        
        .reviews-track:hover .animate-scroll-reviews {
          animation-play-state: paused;
        }
      `}</style>

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
      </div>

      {/* Continuous Scrolling Container */}
      <div className="relative reviews-track w-full">
        <div className="flex animate-scroll-reviews gap-6">
          {allReviews.map((review, index) => (
            <div
              key={`${review._id}-${index}`}
              className="flex-shrink-0 w-80 md:w-96 rounded-2xl shadow-md p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:scale-105"
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
                className="italic mb-4 font-lato transition-colors duration-200 line-clamp-4 text-center"
                style={{ color: colors.text.secondary }}
              >
                "{review.comment}"
              </p>

              {/* Profile */}
              <div className="flex items-center justify-center space-x-4">
                <div
                  className="w-12 h-12 rounded-full border-2 transition-colors duration-200 overflow-hidden flex-shrink-0"
                  style={{ borderColor: colors.interactive.primary }}
                >
                  <img
                    src={getInitialsAvatar(review.user?.fullName || review.anonymousName || 'Anonymous')}
                    alt={review.user?.fullName || review.anonymousName || 'Anonymous'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4
                    className="font-poppins font-semibold transition-colors duration-200"
                    style={{ color: colors.text.primary }}
                  >
                    {review.user?.fullName || review.anonymousName || 'Anonymous'}
                  </h4>
                  <p
                    className="text-sm font-lato transition-colors duration-200"
                    style={{ color: colors.text.secondary }}
                  >
                    {formatTimeAgo(review.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Overlays for fade effect */}
        <div
          className="absolute top-0 left-0 bottom-0 w-32 md:w-48 pointer-events-none z-10"
          style={{
            background: `linear-gradient(to right, ${colors.background.primary} 0%, ${colors.background.primary} 30%, transparent 100%)`
          }}
        />
        <div
          className="absolute top-0 right-0 bottom-0 w-32 md:w-48 pointer-events-none z-10"
          style={{
            background: `linear-gradient(to left, ${colors.background.primary} 0%, ${colors.background.primary} 30%, transparent 100%)`
          }}
        />
      </div>
    </section>
  );
};

export default Reviews;
