/** Desktop carousel animation duration scales with how many reviews are in the track. */
export function ReviewsMarqueeKeyframes({
  reviewCount,
}: {
  reviewCount: number;
}) {
  return (
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
          animation: scroll-reviews ${reviewCount * 3}s linear infinite;
          will-change: transform;
        }

        .reviews-track:hover .animate-scroll-reviews {
          animation-play-state: paused;
        }
      `}</style>
  );
}
