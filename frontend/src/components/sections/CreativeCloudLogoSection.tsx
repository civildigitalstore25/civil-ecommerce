import React from 'react';

export const CreativeCloudLogoSection: React.FC = () => {
  return (
    <section className="bg-gray-50 px-4 py-16 lg:py-24 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-12 lg:p-20 flex items-center justify-center">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80">
            {/* Creative Cloud Icon */}
            <div className="w-full h-full rounded-[3rem] bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-2xl flex items-center justify-center p-8">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="ccGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FF0080', stopOpacity: 0.3 }} />
                    <stop offset="50%" style={{ stopColor: '#7928CA', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: '#00DFD8', stopOpacity: 0.3 }} />
                  </linearGradient>
                </defs>
                {/* Cloud shape simplified as overlapping circles */}
                <ellipse cx="70" cy="100" rx="45" ry="45" fill="white" opacity="0.9" />
                <ellipse cx="100" cy="85" rx="50" ry="50" fill="white" opacity="0.9" />
                <ellipse cx="130" cy="100" rx="45" ry="45" fill="white" opacity="0.9" />
                <rect x="45" y="100" width="110" height="35" fill="white" opacity="0.9" />
                
                {/* CC Text */}
                <text x="100" y="115" fontFamily="Arial, sans-serif" fontSize="60" fontWeight="bold" fill="#7C3AED" textAnchor="middle">
                  CC
                </text>
              </svg>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 blur-2xl opacity-20 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};