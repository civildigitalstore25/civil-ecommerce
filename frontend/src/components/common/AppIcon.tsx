import React from 'react';

interface AppIconProps {
    name: string;
    label: string;
    bgColor: string;
    textColor?: string;
    /** optional absolute URL to an icon image (PNG/SVG). If provided, image will be shown instead of the name initials */
    iconUrl?: string;
    /** optional size classes to control icon square size, defaults to w-20 h-20 */
    sizeClass?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
    name,
    label,
    bgColor,
    textColor = 'text-white',
    iconUrl,
    sizeClass = 'w-20 h-20'
}) => {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className={`${bgColor} ${sizeClass} rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform overflow-hidden`}>
                {iconUrl ? (
                    <img
                        src={iconUrl}
                        alt={`${label} icon`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className={`${textColor} font-bold text-2xl`}>{name}</span>
                )}
            </div>
            <span className="text-gray-900 text-sm font-medium">{label}</span>
        </div>
    );
};