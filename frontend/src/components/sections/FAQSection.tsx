import React from 'react';
import { FAQItem } from '../common/FAQItem';

export const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: 'Is this an official Adobe license?',
      answer: 'We provide genuine Adobe Creative Cloud licenses through authorized reseller partnerships. All licenses are legitimate and fully functional with access to all Adobe apps and services.'
    },
    {
      question: 'How do I receive my license?',
      answer: 'After payment confirmation, you will receive your license details instantly via WhatsApp. The activation process is simple and our support team will guide you through every step.'
    },
    {
      question: 'Can I use it on both Mac and Windows?',
      answer: 'Yes! Your license supports 2 devices and works on both Mac and Windows. You can switch between devices as needed and use the same account on both platforms simultaneously.'
    },
    {
      question: 'Do I get AI credits every month?',
      answer: 'Yes, you receive 10,000 Firefly AI credits every month which renew automatically. These credits can be used across all Adobe AI-powered tools including Photoshop, Illustrator, and Firefly.'
    },
    {
      question: 'Is support included?',
      answer: 'Absolutely! We provide 24/7 WhatsApp support for any activation issues, technical queries, or general questions. Our dedicated team is always ready to help you.'
    }
  ];

  return (
    <section id="faq" className="bg-white px-4 py-16 lg:py-20 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl lg:text-[40px] font-bold text-gray-900 text-center mb-12 lg:mb-14">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};