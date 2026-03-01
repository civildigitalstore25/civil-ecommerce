import React, { useState, useEffect } from 'react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';
import { Star } from 'lucide-react';
import { getRecentReviews, type Review } from '../../api/reviewApi';

export const TestimonialsSection: React.FC = () => {
  const { colors } = useAdminTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recent reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await getRecentReviews(21);
        setReviews(data.reviews);
        setError(null);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getInitialsAvatar = (name: string) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const bgColor = colors.interactive.primary || '#3B82F6';

    const svg = `
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="${bgColor}"/>
        <text x="24" y="28" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#ffffff">${initials}</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const getProductName = (product: Review['product']) => {
    if (typeof product === 'string') return 'Product';
    return product?.name || 'Product';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  if (isLoading) {
    return (
      <section
        id="reviews"
        className="px-4 py-16 lg:py-24 lg:px-8 transition-colors duration-200"
        style={{ background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)` }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <div style={{ color: colors.text.secondary }}>Loading reviews...</div>
        </div>
      </section>
    );
  }

  if (error || reviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  // Duplicate reviews multiple times for seamless infinite scroll
  const allReviews = [...reviews, ...reviews];

  return (
    <section
      id="reviews"
      className="py-16 lg:py-24 transition-colors duration-200 overflow-hidden"
      style={{ background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)` }}
    >
      <style>{`
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll-left ${reviews.length * 3}s linear infinite;
          will-change: transform;
        }
        
        .reviews-track:hover .animate-scroll {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full">
        <h2
          className="text-3xl lg:text-4xl font-bold text-center mb-12 lg:mb-16 transition-colors duration-200 px-4"
          style={{ color: colors.text.primary }}
        >
          What Our Customers Say
        </h2>

        {/* Scrolling Container */}
        <div className="relative reviews-track">
          <div className="flex animate-scroll gap-6">
            {allReviews.map((review, index) => (
              <div
                key={`${review._id}-${index}`}
                className="flex-shrink-0 w-80 md:w-96 rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-105"
                style={{ backgroundColor: colors.background.primary }}
              >
                {/* Stars */}
                <div className="flex justify-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
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

                {/* Product Name */}
                <p
                  className="text-xs mb-4 text-center transition-colors duration-200 font-semibold"
                  style={{ color: colors.text.secondary }}
                >
                  Reviewed on: {getProductName(review.product)}
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

        {/* Instruction Text */}
        <p 
          className="text-center mt-8 text-sm opacity-70 px-4"
          style={{ color: colors.text.secondary }}
        >
          🎯 Hover over any review to pause scrolling
        </p>
      </div>
    </section>
  );
};