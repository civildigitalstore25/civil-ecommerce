import React from 'react';
import { Instagram, Youtube, Facebook, Linkedin, Twitter, Mail, Phone, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="px-4 py-12 lg:px-8" style={{ background: '#F5F7FA', color: '#0A2A6B' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/softlogo.png"
                alt="Softzcart Logo"
                className="h-10 w-auto object-contain brightness-110"
              />
            </div>
            <p className="text-[#0A2A6B] text-sm leading-relaxed">
              Softzcart is a user-friendly website offering a vast selection of civil engineering resources, from software to educational materials. A valuable platform for professionals and students alike.
            </p>
          </div>

          {/* Quick Links */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <h4 className="font-bold mb-4" style={{ color: '#0A2A6B' }}>Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="transition-colors" style={{ color: '#0A2A6B' }} onMouseEnter={e => e.currentTarget.style.color = '#00C8FF'} onMouseLeave={e => e.currentTarget.style.color = '#0A2A6B'}>Home</a></li>
              <li><a href="#features" className="transition-colors" style={{ color: '#0A2A6B' }} onMouseEnter={e => e.currentTarget.style.color = '#00C8FF'} onMouseLeave={e => e.currentTarget.style.color = '#0A2A6B'}>Features</a></li>
              <li><a href="#apps" className="transition-colors" style={{ color: '#0A2A6B' }} onMouseEnter={e => e.currentTarget.style.color = '#00C8FF'} onMouseLeave={e => e.currentTarget.style.color = '#0A2A6B'}>Apps</a></li>
              <li><a href="#pricing" className="transition-colors" style={{ color: '#0A2A6B' }} onMouseEnter={e => e.currentTarget.style.color = '#00C8FF'} onMouseLeave={e => e.currentTarget.style.color = '#0A2A6B'}>Pricing</a></li>
              <li><a href="#faq" className="transition-colors" style={{ color: '#0A2A6B' }} onMouseEnter={e => e.currentTarget.style.color = '#00C8FF'} onMouseLeave={e => e.currentTarget.style.color = '#0A2A6B'}>FAQ</a></li>
              <li><a href="#contact" className="transition-colors" style={{ color: '#0A2A6B' }} onMouseEnter={e => e.currentTarget.style.color = '#00C8FF'} onMouseLeave={e => e.currentTarget.style.color = '#0A2A6B'}>Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <h4 className="font-bold mb-4" style={{ color: '#0A2A6B' }}>Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00C8FF]" />
                <a href="tel:+919042993986" className="hover:text-[#00C8FF] transition-colors">
                  +91 9042993986
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00C8FF]" />
                <a href="mailto:softzcart@gmail.com" className="hover:text-[#00C8FF] transition-colors break-all">
                  softzcart@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00C8FF]" />
                <span>24x7 Service Available</span>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <h4 className="font-bold mb-4" style={{ color: '#0A2A6B' }}>Follow Us</h4>
            <div className="flex flex-wrap gap-3">
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
                style={{ color: '#0A2A6B' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#00C8FF';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#0A2A6B';
                }}
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
                style={{ color: '#0A2A6B' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#00C8FF';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#0A2A6B';
                }}
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center transition-colors"
                aria-label="YouTube"
                style={{ color: '#0A2A6B' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#00C8FF';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#0A2A6B';
                }}
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
                style={{ color: '#0A2A6B' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#00C8FF';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#0A2A6B';
                }}
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
                style={{ color: '#0A2A6B' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#00C8FF';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#0A2A6B';
                }}
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-8 space-y-3 text-center" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm" style={{ color: '#0A2A6B' }}>
            © 2016 <span style={{ color: '#00C8FF', fontWeight: 'bold' }}>Softzcart</span> — All Rights Reserved
          </p>
          <p className="text-xs" style={{ color: '#0A2A6B' }}>
            This is not an official Adobe website. We are an independent reseller of Adobe products.
          </p>
        </div>
      </div>
    </footer>
  );
};