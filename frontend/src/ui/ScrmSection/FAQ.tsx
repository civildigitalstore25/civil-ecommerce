import { useState } from 'react';
import { Plus } from 'lucide-react';

const FAQ = () => {
    const faqs = [
        {
            question: "What is Super CRM?",
            answer: "Super CRM is a Chrome extension that adds a powerful suite of business tools directly into WhatsApp Web. It allows you to manage sales, track leads, automate conversations, and handle customer support without leaving the WhatsApp interface."
        },
        {
            question: "Is it easy to use if I'm not technical?",
            answer: "Absolutely. Super CRM is designed to be intuitive and user-friendly. If you can use WhatsApp Web, you can use Super CRM. No coding, servers, or technical expertise is required—just install the extension and start using it."
        },
        {
            question: "Can I send bulk messages to unsaved contacts?",
            answer: "Yes, the tool allows you to send bulk messages to both saved and unsaved numbers. There are no limits on the number of messages you can send."
        },
        {
            question: "Can I send messages to groups?",
            answer: "Yes. You can use the \"Group Sender\" feature to broadcast messages to multiple WhatsApp groups at once, which is perfect for community updates and announcements."
        },
        {
            question: "Can I start a chat without saving the number?",
            answer: "Yes, our tool includes a feature to start a conversation with any WhatsApp number instantly, without the need to add it to your phone's address book first."
        },
        {
            question: "What are the system requirements?",
            answer: (
                <div className="space-y-2">
                    <p>The requirements are simple and met by most modern computers:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            <span className="font-bold text-white">Operating System:</span> Windows, macOS, or Linux.
                        </li>
                        <li>
                            <span className="font-bold text-white">Browser:</span> An up-to-date version of Google Chrome, Microsoft Edge, Opera, or any other Chromium-based browser.
                        </li>
                        <li>
                            <span className="font-bold text-white">Internet:</span> A stable internet connection.
                        </li>
                        <li>
                            <span className="font-bold text-white">WhatsApp:</span> A valid WhatsApp account (either personal or Business).
                        </li>
                    </ul>
                </div>
            )
        },
        {
            question: "Is my data and privacy safe?",
            answer: "Yes, your privacy is our priority. The extension runs locally in your browser, meaning your chats, contacts, and CRM data never leave your computer. We do not have access to your information."
        },
        {
            question: "Is there a risk of my WhatsApp account getting banned?",
            answer: "Our tool is designed to operate safely by mimicking human behavior. However, misuse, such as spamming unknown numbers, violates WhatsApp's policies. We provide training on best practices for responsible use to keep your account in good standing."
        },
        {
            question: "Is there a free trial or demo available?",
            answer: "No, we do not offer a trial period for Super CRM. However, we have a money-back guarantee so you can purchase with confidence."
        },
        {
            question: "Can I resell this software?",
            answer: "Yes! Our Reseller plan gives you the right to sell the software under your own brand. Please note that while you can use your own marketing strategies, you cannot use our website content, videos, or graphics due to copyright."
        },
        {
            question: "What kind of support do you offer?",
            answer: "We provide comprehensive self-help resources, including training videos and documentation. For any issues not covered by these materials, you can contact our personal support team via call, WhatsApp or email."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-20 bg-slate-950/95 border-t border-gray-800">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-800 rounded-xl overflow-hidden bg-slate-950/95">
                            <button
                                className="w-full flex justify-between items-center p-6 hover:bg-gray-900 transition-colors text-left"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="font-bold text-white">{faq.question}</span>
                                <Plus
                                    className={`text-gray-500 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''
                                        }`}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-gray-800">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
