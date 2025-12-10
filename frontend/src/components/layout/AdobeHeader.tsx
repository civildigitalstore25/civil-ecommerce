import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../common/Button';

const AdobeHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const navLinks = [
        { label: 'Home', href: '#home' },
        { label: 'Features', href: '#features' },
        { label: 'Apps', href: '#apps' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Reviews', href: '#reviews' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contact', href: '#contact' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white px-3 sm:px-4 lg:px-8 border-b border-gray-200 h-16 sm:h-20 shadow-sm">
            <nav className="max-w-7xl mx-auto flex items-center justify-between h-full">
                {/* Logo */}
                <div className="flex items-center -ml-2">
                    <a href="/" aria-label="Home">
                        <img
                            src="/softlogo.png"
                            alt="Civil Digital Store Logo"
                            className="h-10 sm:h-12 w-auto object-contain"
                        />
                    </a>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.querySelector(link.href);
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden lg:block">
                    <Button
                        onClick={() => window.open('https://imjo.in/fJQM46', '_blank')}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-md transition-all duration-200 border-0 px-6 py-2 rounded-full"
                    >
                        Buy Now Instantly
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-gray-800 p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
                </button>
            </nav>

            {/* Mobile Menu (renders below header) */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
                    <div className="flex flex-col gap-3 p-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-gray-800 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-100 text-sm sm:text-base font-medium"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.querySelector(link.href);
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                    setIsMenuOpen(false);
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                        <Button className="w-full mt-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-md transition-all duration-200 border-0 px-6 py-2 rounded-full">Buy Now Instantly</Button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default AdobeHeader;
