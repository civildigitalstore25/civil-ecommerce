import React from 'react';
import { AppIcon } from '../common/AppIcon';
import { Button } from '../common/Button';

export const AllAppsSection: React.FC = () => {
    return (
        <section id="apps" className="bg-gray-50 px-4 py-16 lg:py-24 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-16">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-4 sm:space-y-6">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
                                Adobe Creative Cloud<br />
                                All Apps.
                            </h2>

                            <p className="text-gray-600 text-lg">
                                A collection of 20+ desktop and mobile apps and services.
                            </p>

                            {/* App Icons Grid */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 mb-6">
                                {[
                                    { code: 'Ps', iconUrl: '/icons/Photoshop.png', label: 'Photoshop' },
                                    { code: 'Ai', iconUrl: '/icons/Illustrator.png', label: 'Illustrator' },
                                    { code: 'Id', iconUrl: '/icons/InDesign.png', label: 'InDesign' },
                                    { code: 'Pr', iconUrl: '/icons/PremierePro.png', label: 'Premiere Pro' },
                                    { code: 'Ae', iconUrl: '/icons/AfterEffects.png', label: 'After Effects' },
                                    { code: 'Xd', iconUrl: '/icons/AdobeXD.png', label: 'XD' },
                                    { code: 'Dn', iconUrl: '/icons/Dimension.png', label: 'Dimension' },
                                    { code: 'An', iconUrl: '/icons/Animate.png', label: 'Animate' },
                                    { code: 'Br', iconUrl: '/icons/Bridge.png', label: 'Bridge' },
                                    { code: 'Lr', iconUrl: '/icons/Lightroom.png', label: 'Lightroom' },
                                ].map((app, i) => (
                                    <AppIcon
                                        key={i}
                                        name={app.code}
                                        label={app.label}
                                        bgColor="bg-white"
                                        iconUrl={app.iconUrl}
                                        sizeClass="w-10 h-10 sm:w-12 sm:h-12"
                                    />
                                ))}
                            </div>

                            {/* Platform Support */}
                            <div className="pt-4 sm:pt-6 space-y-3">
                                <p className="text-gray-900 font-semibold text-xs sm:text-sm">
                                    Commercial License
                                </p>
                                <div className="flex items-center gap-3 sm:gap-6 text-gray-900">
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                                    </svg>
                                    <div className="w-px h-6 sm:h-8 bg-gray-300"></div>
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,12V6.75L9,5.43V11.91L3,12M20,3V11.75L10,11.9V5.21L20,3M3,13L9,13.09V19.9L3,18.75V13M20,13.25V22L10,20.09V13.1L20,13.25Z" />
                                    </svg>
                                    <div className="w-px h-6 sm:h-8 bg-gray-300"></div>
                                    <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
                                    </svg>
                                </div>
                                <Button
                                    onClick={() => window.open('https://imjo.in/fJQM46', '_blank')}
                                    className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full shadow-md transition-all duration-200 border-0 px-8 py-3 w-full sm:w-auto text-base sm:text-lg"
                                >
                                    Buy Instantly
                                </Button>
                            </div>
                        </div>

                        {/* Right Content - Badge */}
                        <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
                            <div className="relative">
                                {/* Badge */}
                                <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80">
                                    {/* Star Badge Background */}
                                    <svg viewBox="0 0 200 200" className="w-full h-full">
                                        <defs>
                                            <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: '#FCD34D', stopOpacity: 1 }} />
                                                <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
                                            </linearGradient>
                                        </defs>
                                        {/* Star shape */}
                                        <path
                                            d="M100,20 L110,70 L160,70 L120,100 L135,150 L100,120 L65,150 L80,100 L40,70 L90,70 Z"
                                            fill="url(#badgeGradient)"
                                            stroke="#D97706"
                                            strokeWidth="2"
                                        />
                                    </svg>

                                    {/* Badge Content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">100%</div>
                                        <div className="bg-gray-700 text-white px-3 sm:px-4 lg:px-6 py-1 sm:py-2 text-xs sm:text-sm lg:text-lg font-bold tracking-wide mb-1">
                                            SATISFACTION
                                        </div>
                                        <div className="bg-yellow-500 text-gray-900 px-3 sm:px-4 lg:px-6 py-1 sm:py-2 text-xs sm:text-sm lg:text-lg font-bold tracking-wide">
                                            GUARANTEE
                                        </div>
                                        <div className="text-lg sm:text-xl lg:text-2xl mt-1 sm:mt-2">★★★</div>
                                    </div>

                                    {/* Ribbon */}
                                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                        <div className="w-8 h-16 bg-gray-600 transform skew-x-12 shadow-lg"></div>
                                        <div className="w-8 h-16 bg-gray-700 transform -skew-x-12 shadow-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};