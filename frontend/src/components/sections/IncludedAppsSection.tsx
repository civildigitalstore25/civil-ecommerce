import React from 'react';
import { AppIcon } from '../common/AppIcon';

export const IncludedAppsSection: React.FC = () => {
   const apps = [
        { name: 'Ps', label: 'Photoshop', bgColor: 'bg-blue-900', iconUrl: '/icons/Photoshop.png' },
        { name: 'Pr', label: 'Premiere Pro', bgColor: 'bg-indigo-900', iconUrl: '/icons/PremierePro.png' },
        { name: 'Ae', label: 'After Effects', bgColor: 'bg-indigo-950', iconUrl: '/icons/AfterEffects.png' },
        { name: 'Ai', label: 'Illustrator', bgColor: 'bg-orange-900', iconUrl: '/icons/Illustrator.png' },
        { name: 'Ac', label: 'Acrobat', bgColor: 'bg-red-800', iconUrl: '/icons/Acrobat.png' },
        { name: 'Lr', label: 'Lightroom', bgColor: 'bg-blue-700', iconUrl: '/icons/Lightroom.png' },
        { name: 'Id', label: 'InDesign', bgColor: 'bg-pink-900', iconUrl: '/icons/InDesign.png' },
        { name: 'Xd', label: 'Adobe XD', bgColor: 'bg-purple-900', iconUrl: '/icons/AdobeXD.png' },
        { name: 'An', label: 'Animate', bgColor: 'bg-blue-900', iconUrl: '/icons/Animate.png' },
        { name: 'Dw', label: 'Dreamweaver', bgColor: 'bg-purple-900', iconUrl: '/icons/Dreamweaver.png' },
        { name: 'Au', label: 'Audition', bgColor: 'bg-indigo-900', iconUrl: '/icons/Audition.png' },
        { name: 'Br', label: 'Bridge', bgColor: 'bg-gray-900', iconUrl: '/icons/Bridge.png' },
    ];

    return (
        <section className="bg-white px-4 py-16 lg:py-24 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12 lg:mb-16">
                    Included Adobe Apps
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
                    {apps.map((app, index) => (
                        <AppIcon
                            key={index}
                            name={app.name}
                            label={app.label}
                            bgColor={app.bgColor}
                            iconUrl={app.iconUrl}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
