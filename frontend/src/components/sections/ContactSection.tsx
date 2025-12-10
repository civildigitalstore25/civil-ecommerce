import React from 'react';
import { Send, Mail, Phone } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="bg-white px-4 py-12 sm:py-16 lg:py-24 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12 lg:mb-16">
          Contact Softzcart
        </h2>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-900 font-medium mb-2 text-sm sm:text-base">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-900 font-medium mb-2 text-sm sm:text-base">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-900 font-medium mb-2 text-sm sm:text-base">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 bg-white text-sm sm:text-base"
                  placeholder="Enter your message"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full shadow-md transition-all duration-200 border-0 px-8 py-3 text-base sm:text-lg flex items-center justify-center gap-2"
              >
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 space-y-5 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Connect With Us</h3>

            <div className="flex items-start gap-3 text-gray-700">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Call Us 24/7</p>
                <a href="tel:+919042993986" className="text-blue-600 hover:text-blue-700 text-sm sm:text-base">
                  +91 9042993986
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-gray-700">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Email Us</p>
                <a href="mailto:softzcart@gmail.com" className="text-blue-600 hover:text-blue-700 break-all text-sm sm:text-base">
                  softzcart@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-gray-700">
              <Send className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Alternative Email</p>
                <a href="mailto:softzcart@gmail.com" className="text-blue-600 hover:text-blue-700 break-all text-sm sm:text-base">
                  softzcart@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">📍 Location</p>
              <p className="text-gray-900 font-medium text-sm sm:text-base">Thanjavur, Tamil Nadu, India</p>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};