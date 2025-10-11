// import React, { useEffect, useState } from "react";
// import axios from "axios";

// interface Review {
//   author_name: string;
//   profile_photo_url: string;
//   rating: number;
//   text: string;
//   relative_time_description: string;
// }

// interface ReviewResponse {
//   name: string;
//   rating: number;
//   total: number;
//   reviews: Review[];
//   lastUpdated?: string;
//   nextUpdate?: string;
//   stale?: boolean;
//   message?: string;
// }

// interface ErrorResponse {
//   error: string;
//   message: string;
// }

// const GoogleReviews: React.FC = () => {
//   const [data, setData] = useState<ReviewResponse | null>(null);
//   const [loading, setLoading] = useState(false); // Changed to false
//   const [error, setError] = useState<string | null>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Only fetch when component becomes visible (intersection observer)
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !isVisible) {
//           setIsVisible(true);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     const element = document.getElementById('google-reviews-section');
//     if (element) {
//       observer.observe(element);
//     }

//     return () => {
//       if (element) {
//         observer.unobserve(element);
//       }
//     };
//   }, [isVisible]);

//   useEffect(() => {
//     if (!isVisible) return;

//     const fetchReviews = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Update with your actual backend URL
//         const res = await axios.get<ReviewResponse>(
//           "/api/reviews" // Use relative URL or env variable
//         );
        
//         setData(res.data);
//       } catch (err: any) {
//         console.error("Error fetching reviews:", err);
        
//         const errorMsg = err.response?.data?.message || 
//                         "Failed to load reviews. Please try again later.";
//         setError(errorMsg);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, [isVisible]);

//   // Loading State
//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto py-10">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//           <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//           <div className="space-y-3">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="border border-gray-200 rounded-xl p-4">
//                 <div className="flex items-center gap-3 mb-2">
//                   <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//                   <div className="flex-1">
//                     <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/6"></div>
//                   </div>
//                 </div>
//                 <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
//                 <div className="h-3 bg-gray-200 rounded w-5/6"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error State
//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto py-10">
//         <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//           <svg 
//             className="w-12 h-12 text-red-500 mx-auto mb-3" 
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             <path 
//               strokeLinecap="round" 
//               strokeLinejoin="round" 
//               strokeWidth={2} 
//               d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
//             />
//           </svg>
//           <h3 className="text-xl font-semibold text-red-800 mb-2">
//             Unable to Load Reviews
//           </h3>
//           <p className="text-red-600">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // No Reviews State
//   if (!data || data.reviews.length === 0) {
//     return (
//       <div className="max-w-4xl mx-auto py-10">
//         <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
//           <p className="text-gray-600">No reviews available yet.</p>
//         </div>
//       </div>
//     );
//   }

//   // Success State
//   return (
//     <div className="max-w-4xl mx-auto py-10 px-4">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold mb-2">{data.name}</h2>
//         <div className="flex items-center gap-2 text-gray-600">
//           <span className="text-2xl">⭐</span>
//           <span className="text-lg font-semibold">{data.rating.toFixed(1)}</span>
//           <span className="text-gray-500">
//             ({data.total.toLocaleString()} reviews)
//           </span>
//         </div>
        
//         {/* Show stale data warning */}
//         {data.stale && (
//           <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//             <p className="text-sm text-yellow-800">
//               ⚠️ {data.message || "Showing cached data"}
//             </p>
//           </div>
//         )}
//       </div>

//       <div className="grid gap-6">
//         {data.reviews.map((review, index) => (
//           <div
//             key={index}
//             className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition"
//           >
//             <div className="flex items-center gap-3 mb-3">
//               <img
//                 src={review.profile_photo_url}
//                 alt={review.author_name}
//                 className="w-12 h-12 rounded-full object-cover"
//                 onError={(e) => {
//                   // Fallback for broken images
//                   e.currentTarget.src = "https://via.placeholder.com/48";
//                 }}
//               />
//               <div>
//                 <p className="font-semibold text-gray-900">
//                   {review.author_name}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   {review.relative_time_description}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center mb-3">
//               {[...Array(5)].map((_, i) => (
//                 <span key={i} className="text-lg">
//                   {i < review.rating ? "⭐" : "☆"}
//                 </span>
//               ))}
//             </div>
            
//             <p className="text-gray-700 leading-relaxed">{review.text}</p>
//           </div>
//         ))}
//       </div>

//       {data.lastUpdated && (
//         <div className="text-center mt-8 space-y-1">
//           <p className="text-xs text-gray-400">
//             Last updated: {new Date(data.lastUpdated).toLocaleString()}
//           </p>
//           {data.nextUpdate && !data.stale && (
//             <p className="text-xs text-gray-400">
//               Next update: {new Date(data.nextUpdate).toLocaleString()}
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default GoogleReviews;

import React from "react";
import { Star } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const reviews = [
  {
    text: "Got AutoCAD 2024 from CivilDigitalStore. 100% genuine license and instant delivery. Excellent support!",
    name: "Rajesh Kumar",
    role: "Senior Civil Engineer at L&T Construction",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    text: "Purchased Tekla Structures. The software is authentic and the pricing is very competitive.",
    name: "Priya Sharma",
    role: "Structural Engineer at Tata Projects",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    text: "Amazing experience! Got Revit 2024 with lifetime license. Highly recommended for professionals.",
    name: "Arun Patel",
    role: "Architect at DLF",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
  },

];

const Reviews: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <section
      className="w-full py-16 transition-colors duration-200"
      style={{
        background: `linear-gradient(to right, ${colors.background.secondary}, ${colors.background.primary})`
      }}
    >
      <div className="text-center mb-12">
        <h2
          className="text-3xl md:text-4xl font-bold transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          What Our Customers Say
        </h2>
        <p
          className="mt-2 text-lg transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Join thousands of satisfied customers who trust our software solutions
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-20">
        {reviews.map((review, index) => (
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
                  className="h-5 w-5 text-yellow-500 fill-yellow-500"
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
              <img
                src={review.image}
                alt={review.name}
                className="w-12 h-12 rounded-full border-2 transition-colors duration-200"
                style={{ borderColor: colors.interactive.primary }}
              />
              <div>
                <h4
                  className="font-semibold transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  {review.name}
                </h4>
                <p
                  className="text-sm transition-colors duration-200"
                  style={{ color: colors.text.secondary }}
                >
                  {review.role}
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
