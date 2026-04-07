export function BannerCarouselDecorations() {
  return (
    <>
      <div
        className="absolute inset-0 animate-rotate-slow z-0"
        style={{
          background: `repeating-conic-gradient(from 0deg, rgba(255,255,255,0.15) 0deg, rgba(255,255,255,0.15) 3deg, transparent 3deg, transparent 15deg)`,
        }}
      />

      <svg
        className="absolute top-0 left-0 w-1/5 h-auto z-10 opacity-80"
        viewBox="0 0 200 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g transform="translate(200,0) scale(-1,1)">
          <path
            d="M0,0 C50,30 150,-10 200,30 L200,0 L0,0 Z"
            fill="url(#topCurveGradient)"
          />
        </g>
        <defs>
          <linearGradient id="topCurveGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        className="absolute bottom-0 right-0 w-1/5 h-auto z-10 opacity-80"
        viewBox="0 0 200 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <g transform="translate(200,0) scale(-1,1)">
          <path
            d="M200,100 C150,60 50,110 0,60 L0,100 L200,100 Z"
            fill="url(#bottomCurveGradient)"
          />
        </g>
        <defs>
          <linearGradient
            id="bottomCurveGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.15" />
          </linearGradient>
        </defs>
      </svg>

      <div
        className="absolute top-14 left-1/4 w-3 h-3 text-black/20 animate-float"
        aria-hidden
      >
        <svg viewBox="0 0 10 10" fill="currentColor">
          <polygon points="5,0 6,3 10,5 6,7 5,10 4,7 0,5 4,3" />
        </svg>
      </div>
      <div
        className="absolute top-16 right-14 w-4 h-4 text-black/25 animate-float-delay"
        aria-hidden
      >
        <svg viewBox="0 0 10 10" fill="currentColor">
          <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" />
        </svg>
      </div>
      <div
        className="absolute bottom-16 left-1/3 w-3 h-3 text-black/15 animate-float"
        aria-hidden
      >
        <svg viewBox="0 0 10 10" fill="currentColor">
          <polygon points="5,0 6,3 10,5 6,7 5,10 4,7 0,5 4,3" />
        </svg>
      </div>
      <div
        className="absolute bottom-12 right-16 rotate-12 w-10 h-2 bg-black/20 rounded animate-float"
        aria-hidden
      />
    </>
  );
}
