import React, { useState, useMemo } from 'react';
import {
    Check, Shield, Zap, Star, Award, Lock, Unlock, Eye, Heart,
    ThumbsUp, Target, Rocket, Crown, Diamond, Sparkles,
    Monitor, Cpu, HardDrive, Keyboard, Mouse, Headphones,
    Wifi, Bluetooth, Power, Battery,
    Settings, Cog, Wrench, Package,
    File, Folder, Image, Video, Music, Download, Upload,
    Search, Filter, X, ChevronDown,
    Play, Pause, Volume2, VolumeX,
    Camera, Mic, MicOff, Radio, Tv,
    Sun, Moon, Cloud, CloudRain, Wind,
    ShoppingCart, CreditCard, DollarSign, Wallet,
    Bookmark, Flag, Tag, Tags,
    Info, AlertCircle, AlertTriangle, CheckCircle, XCircle, HelpCircle,
    Lightbulb, Brain, Key,
    Database, Server,
    Code, Terminal, Laptop, Smartphone, Tablet,
    Printer, Webcam
} from 'lucide-react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

interface IconPickerProps {
    selectedIcon: string;
    onIconSelect: (iconName: string) => void;
    placeholder?: string;
}

const POPULAR_ICONS = [
    // Features & Benefits
    { name: 'Check', icon: Check, category: 'Features' },
    { name: 'Shield', icon: Shield, category: 'Security' },
    { name: 'Zap', icon: Zap, category: 'Performance' },
    { name: 'Star', icon: Star, category: 'Quality' },
    { name: 'Award', icon: Award, category: 'Achievement' },
    { name: 'Lock', icon: Lock, category: 'Security' },
    { name: 'Unlock', icon: Unlock, category: 'Access' },
    { name: 'Eye', icon: Eye, category: 'Visibility' },
    { name: 'Heart', icon: Heart, category: 'Favorite' },
    { name: 'ThumbsUp', icon: ThumbsUp, category: 'Approval' },
    { name: 'Target', icon: Target, category: 'Precision' },
    { name: 'Rocket', icon: Rocket, category: 'Speed' },
    { name: 'Crown', icon: Crown, category: 'Premium' },
    { name: 'Diamond', icon: Diamond, category: 'Premium' },
    { name: 'Sparkles', icon: Sparkles, category: 'Enhancement' },
    { name: 'Lightbulb', icon: Lightbulb, category: 'Innovation' },
    { name: 'Brain', icon: Brain, category: 'Intelligence' },
    { name: 'Key', icon: Key, category: 'Access' },

    // Hardware & System
    { name: 'Monitor', icon: Monitor, category: 'Hardware' },
    { name: 'Cpu', icon: Cpu, category: 'Hardware' },
    { name: 'HardDrive', icon: HardDrive, category: 'Storage' },
    { name: 'Keyboard', icon: Keyboard, category: 'Input' },
    { name: 'Mouse', icon: Mouse, category: 'Input' },
    { name: 'Headphones', icon: Headphones, category: 'Audio' },
    { name: 'Webcam', icon: Webcam, category: 'Hardware' },
    { name: 'Printer', icon: Printer, category: 'Hardware' },
    { name: 'Camera', icon: Camera, category: 'Hardware' },
    { name: 'Mic', icon: Mic, category: 'Audio' },
    { name: 'MicOff', icon: MicOff, category: 'Audio' },

    // Connectivity & Power
    { name: 'Wifi', icon: Wifi, category: 'Network' },
    { name: 'Bluetooth', icon: Bluetooth, category: 'Network' },
    { name: 'Power', icon: Power, category: 'System' },
    { name: 'Battery', icon: Battery, category: 'Power' },

    // Software & Tools
    { name: 'Settings', icon: Settings, category: 'Tools' },
    { name: 'Cog', icon: Cog, category: 'Configuration' },
    { name: 'Wrench', icon: Wrench, category: 'Tools' },
    { name: 'Package', icon: Package, category: 'Software' },
    { name: 'Code', icon: Code, category: 'Development' },
    { name: 'Terminal', icon: Terminal, category: 'Development' },
    { name: 'Database', icon: Database, category: 'Data' },
    { name: 'Server', icon: Server, category: 'Infrastructure' },

    // Devices
    { name: 'Laptop', icon: Laptop, category: 'Devices' },
    { name: 'Smartphone', icon: Smartphone, category: 'Devices' },
    { name: 'Tablet', icon: Tablet, category: 'Devices' },
    { name: 'Radio', icon: Radio, category: 'Devices' },
    { name: 'Tv', icon: Tv, category: 'Devices' },

    // Files & Media
    { name: 'File', icon: File, category: 'Files' },
    { name: 'Folder', icon: Folder, category: 'Files' },
    { name: 'Image', icon: Image, category: 'Media' },
    { name: 'Video', icon: Video, category: 'Media' },
    { name: 'Music', icon: Music, category: 'Media' },

    // Navigation & Actions
    { name: 'Search', icon: Search, category: 'Actions' },
    { name: 'Filter', icon: Filter, category: 'Actions' },
    { name: 'Download', icon: Download, category: 'Actions' },
    { name: 'Upload', icon: Upload, category: 'Actions' },
    { name: 'Play', icon: Play, category: 'Media' },
    { name: 'Pause', icon: Pause, category: 'Media' },
    { name: 'Volume2', icon: Volume2, category: 'Audio' },
    { name: 'VolumeX', icon: VolumeX, category: 'Audio' },

    // Weather & Environment
    { name: 'Sun', icon: Sun, category: 'Weather' },
    { name: 'Moon', icon: Moon, category: 'Weather' },
    { name: 'Cloud', icon: Cloud, category: 'Weather' },
    { name: 'CloudRain', icon: CloudRain, category: 'Weather' },
    { name: 'Wind', icon: Wind, category: 'Weather' },

    // Commerce
    { name: 'ShoppingCart', icon: ShoppingCart, category: 'Commerce' },
    { name: 'CreditCard', icon: CreditCard, category: 'Finance' },
    { name: 'DollarSign', icon: DollarSign, category: 'Finance' },
    { name: 'Wallet', icon: Wallet, category: 'Finance' },

    // Organization
    { name: 'Bookmark', icon: Bookmark, category: 'Organization' },
    { name: 'Flag', icon: Flag, category: 'Organization' },
    { name: 'Tag', icon: Tag, category: 'Organization' },
    { name: 'Tags', icon: Tags, category: 'Organization' },

    // Status & Alerts
    { name: 'Info', icon: Info, category: 'Status' },
    { name: 'AlertCircle', icon: AlertCircle, category: 'Alert' },
    { name: 'AlertTriangle', icon: AlertTriangle, category: 'Alert' },
    { name: 'CheckCircle', icon: CheckCircle, category: 'Success' },
    { name: 'XCircle', icon: XCircle, category: 'Error' },
    { name: 'HelpCircle', icon: HelpCircle, category: 'Help' },
];

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onIconSelect, placeholder = "Select an icon" }) => {
    const { colors } = useAdminTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = useMemo(() => {
        const cats = ['All', ...Array.from(new Set(POPULAR_ICONS.map(icon => icon.category)))];
        return cats.sort();
    }, []);

    const filteredIcons = useMemo(() => {
        return POPULAR_ICONS.filter(icon => {
            const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                icon.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || icon.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const selectedIconData = POPULAR_ICONS.find(icon => icon.name === selectedIcon);
    const SelectedIconComponent = selectedIconData?.icon;

    const handleIconSelect = (iconName: string) => {
        onIconSelect(iconName);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Selected Icon Display Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200 flex items-center gap-2"
                style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary
                }}
            >
                {SelectedIconComponent ? (
                    <>
                        <SelectedIconComponent className="h-4 w-4" />
                        <span>{selectedIcon}</span>
                    </>
                ) : (
                    <span className="text-gray-500">{placeholder}</span>
                )}
                <ChevronDown className="h-4 w-4 ml-auto" />
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
                    style={{
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.primary
                    }}
                >
                    {/* Search and Filter Header */}
                    <div className="p-3 border-b" style={{ borderColor: colors.border.primary }}>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Search icons..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 px-2 py-1 text-sm border rounded focus:ring-1"
                                style={{
                                    backgroundColor: colors.background.secondary,
                                    borderColor: colors.border.primary,
                                    color: colors.text.primary
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-2 py-1 text-sm border rounded hover:bg-opacity-80"
                                style={{
                                    backgroundColor: colors.background.secondary,
                                    borderColor: colors.border.primary,
                                    color: colors.text.secondary
                                }}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-2 py-1 text-sm border rounded"
                            style={{
                                backgroundColor: colors.background.secondary,
                                borderColor: colors.border.primary,
                                color: colors.text.primary
                            }}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Icons Grid */}
                    <div className="p-2 overflow-y-auto max-h-64">
                        <div className="grid grid-cols-6 gap-1">
                            {filteredIcons.map((iconData) => {
                                const IconComponent = iconData.icon;
                                const isSelected = selectedIcon === iconData.name;

                                return (
                                    <button
                                        key={iconData.name}
                                        type="button"
                                        onClick={() => handleIconSelect(iconData.name)}
                                        className="p-2 rounded hover:bg-opacity-80 transition-colors duration-200 flex flex-col items-center gap-1"
                                        style={{
                                            backgroundColor: isSelected ? colors.interactive.primary + '20' : 'transparent',
                                            borderColor: isSelected ? colors.interactive.primary : 'transparent'
                                        }}
                                        title={iconData.name}
                                    >
                                        <IconComponent
                                            className="h-5 w-5"
                                            style={{
                                                color: isSelected ? colors.interactive.primary : colors.text.primary
                                            }}
                                        />
                                        <span
                                            className="text-xs truncate w-full text-center"
                                            style={{
                                                color: isSelected ? colors.interactive.primary : colors.text.secondary
                                            }}
                                        >
                                            {iconData.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {filteredIcons.length === 0 && (
                            <div className="text-center py-4" style={{ color: colors.text.secondary }}>
                                No icons found for "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default IconPicker;