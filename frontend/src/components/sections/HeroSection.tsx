import React from 'react';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
    return (
        <section id="home" className="bg-white px-4 py-12 lg:py-20 lg:px-8 border-b border-gray-100">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-6">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                        Adobe Creative Cloud —<br />
                        1 Year Plan for ₹4999
                    </h1>

                    <p className="text-gray-700 text-lg lg:text-xl">
                        Unlock all Adobe apps with AI features, 10K monthly AI credits, 2-device
                        support (Mac & Windows).
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Button onClick={() => window.open('https://imjo.in/fJQM46', '_blank')} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-md transition-all duration-200 border-0 px-6 py-2 rounded-full">Buy Instantly</Button>
                        <Button variant="secondary" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-md transition-all duration-200 border-0 px-6 py-2 rounded-full">Learn More</Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <span className="text-sm sm:text-base text-gray-700">Instant delivery</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-4 h-4 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <span className="text-sm sm:text-base text-gray-700">Trusted by 1,000+ Indian creators</span>
                        </div>
                    </div>
                </div>

                {/* Right Content - Product Image */}
                <div className="relative mt-8 lg:mt-0">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                        <div className="relative">
                            {/* Mock Browser Window */}
                            <div className="bg-gray-200 rounded-t-lg p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2">
                                <div className="flex gap-1 sm:gap-1.5">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
                                </div>
                            </div>

                            {/* Colorful Card */}
                            <div className="bg-gradient-to-br from-blue-100 via-white to-gray-100 rounded-b-lg p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-white rounded-full"></div>
                                        </div>
                                        <h3 className="text-gray-900 font-bold text-sm sm:text-base lg:text-xl">
                                            A toolset for the creative
                                        </h3>
                                    </div>

                                    {/* App Icons Grid */}
                                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2 lg:gap-3 mb-4 sm:mb-6">
                                        {[
                                            { code: 'Ps', iconUrl: '/icons/Photoshop.png' },
                                            { code: 'Ai', iconUrl: '/icons/Illustrator.png' },
                                            { code: 'Id', iconUrl: '/icons/InDesign.png' },
                                            { code: 'Pr', iconUrl: '/icons/PremierePro.png' },
                                            { code: 'Ae', iconUrl: '/icons/AfterEffects.png' },
                                            { code: 'Xd', iconUrl: '/icons/AdobeXD.png' },
                                            { code: 'Dn', iconUrl: '/icons/Dimension.png' },
                                            { code: 'An', iconUrl: '/icons/Animate.png' },
                                            { code: 'Br', iconUrl: '/icons/Bridge.png' },
                                            { code: 'Lr', iconUrl: '/icons/Lightroom.png' },
                                        ].map((app, i) => (
                                            <div
                                                key={i}
                                                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white border border-gray-200 rounded-md lg:rounded-lg flex items-center justify-center overflow-hidden shadow-sm"
                                            >
                                                <img
                                                    src={app.iconUrl}
                                                    alt={app.code}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-2 sm:gap-3">
                                        <button className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md lg:rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors shadow">
                                            Learn
                                        </button>
                                        <button className="bg-gray-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md lg:rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors shadow">
                                            Try
                                        </button>
                                    </div>
                                </div>

                                {/* Adobe CC Logo */}
                                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-200 to-blue-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white/40 backdrop-blur-sm rounded-lg sm:rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};