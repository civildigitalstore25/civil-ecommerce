import React from "react";
import { Star } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
}

// Static review data
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
  {
    author_name: "Sneha Reddy",
    rating: 5,
    text: "Trustworthy seller with genuine products. I was skeptical at first but the product key worked perfectly. Thanks for the amazing service!",
    relative_time_description: "1 week ago",
  },
  {
    author_name: "Vikram Singh",
    rating: 5,
    text: "Outstanding experience! Bought AutoCAD for my firm and got excellent after-sales support. Very professional and reliable.",
    relative_time_description: "2 months ago",
  },
  {
    author_name: "Ananya Iyer",
    rating: 4,
    text: "Good prices and genuine software licenses. The checkout process was smooth and I received my product key within minutes.",
    relative_time_description: "3 weeks ago",
  },
  {
    author_name: "Karthik Menon",
    rating: 5,
    text: "Impressive collection of design software! Purchased Adobe Creative Suite and the entire process was hassle-free. Definitely coming back!",
    relative_time_description: "1 month ago",
  },
  {
    author_name: "Divya Nair",
    rating: 5,
    text: "Excellent customer service and genuine products. They helped me choose the right antivirus for my needs. Very satisfied with the purchase!",
    relative_time_description: "2 weeks ago",
  },
  {
    author_name: "Arjun Kapoor",
    rating: 4,
    text: "Reliable platform for software purchases. Fast delivery and authentic licenses. The prices are competitive compared to other sellers.",
    relative_time_description: "1 week ago",
  },
  {
    author_name: "Meera Desai",
    rating: 5,
    text: "Fantastic service! Bought Windows 11 Pro and the installation guide provided was very helpful. Will definitely recommend to friends and family!",
    relative_time_description: "4 weeks ago",
  },
];

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
                className={`h-5 w-5 ${i < Math.floor(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span
            className="text-lg font-semibold transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            {averageRating.toFixed(1)}
          </span>
          <span
            className="text-sm transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            ({totalReviews} reviews)
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-20">
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
              className="italic mb-6 transition-colors duration-200"
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
    </section>
  );
};

export default Reviews;
