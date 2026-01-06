import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
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
        <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 lg:px-8 border-b h-16 sm:h-20"
            style={{ background: '#0A2A6B', borderColor: '#0A2A6B' }}>
            <nav className="max-w-7xl mx-auto flex items-center justify-between h-full">
                {/* Logo */}
                <div className="flex items-center -ml-2">
                    <img
                        src="/softlogo.png"
                        alt="Softzcart Logo"
                        className="h-10 sm:h-12 w-auto object-contain"
                    />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="transition-colors px-2 py-1 rounded-md"
                            style={{
                                color: '#fff',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'none';
                                e.currentTarget.style.color = '#fff';
                            }}
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
                        style={{
                            background: 'linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)',
                            color: '#fff',
                            border: 'none',
                        }}
                        onClick={() => window.open('https://imjo.in/fJQM46', '_blank')}
                    >
                        Buy Now Instantly
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2"
                    style={{ color: '#fff' }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
                </button>
            </nav>

            {/* Mobile Menu (renders below header) */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 shadow-lg"
                    style={{ background: '#0A2A6B', borderBottom: '2px solid #00C8FF' }}>
                    <div className="flex flex-col gap-3 p-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="transition-colors py-2 px-3 rounded-lg text-sm sm:text-base"
                                style={{ color: '#fff' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'none';
                                    e.currentTarget.style.color = '#fff';
                                }}
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
                        <Button
                            className="w-full mt-2"
                            style={{
                                background: 'linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)',
                                color: '#fff',
                                border: 'none',
                            }}
                        >Buy Now Instantly</Button>
                    </div>
                </div>
            )}
        </header>
    );
};