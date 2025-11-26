import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                // force white background and dark text (use Tailwind important modifier) so global button styles don't make it dark
                className="w-full !bg-white rounded-xl flex items-center justify-between px-6 py-5 text-left group "
            >
                <span className="font-semibold !text-gray-900 text-base pr-4 group-hover:!text-gray-700 transition-colors">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-700 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            {isOpen && (
                <div className="px-6 pb-5 animate-fadeIn bg-white rounded-b-xl">
                    <p className="!text-gray-600 leading-relaxed text-[15px]">{answer}</p>
                </div>
            )}
        </div>
    );
};