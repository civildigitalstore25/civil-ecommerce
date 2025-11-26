import React from 'react';
import { Check } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const features = [
    '10K AI Credits monthly',
    'All Adobe apps included',
    '2-device support',
    'Secure activation',
    'Instant delivery'
  ];

  return (
    <section id="pricing" className="bg-gray-50 px-4 py-16 lg:py-24 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12 lg:mb-16">
          Simple & Affordable Pricing
        </h2>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border-4 border-transparent bg-clip-padding relative overflow-hidden">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-3xl p-[4px] bg-gradient-to-br from-red-500 via-purple-500 to-blue-600 -z-10">
              <div className="bg-white rounded-[calc(1.5rem-4px)] w-full h-full"></div>
            </div>

            <div className="relative">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-2">
                Adobe Creative Cloud
              </h3>
              <p className="text-gray-600 text-center mb-8">1 Year Full Access</p>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl lg:text-6xl font-bold text-gray-900">₹899</span>
                  <span className="text-gray-600 text-xl">/year</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => window.open('https://imjo.in/fJQM46', '_blank')}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full shadow-md transition-all duration-200 border-0 px-8 py-4 text-lg"
              >
                Buy Instantly
              </button>

              {/* Offer Text */}
              <p className="text-center text-gray-500 text-sm mt-4">
                Limited Time Offer — Save up to 90% off official pricing!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};