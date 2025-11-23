import { Star } from 'lucide-react';
import { useAdminTheme } from "../../../../contexts/AdminThemeContext";

const Review = () => {
    const { colors } = useAdminTheme();

    const reviews = [
        {
            name: 'Karan Singh',
            role: 'Real Estate Agent, Bangalore',
            content: 'Keeping track of 50+ real estate leads was a nightmare. The Kanban board is a lifesaver. I know exactly who to follow up with. My closing rate has literally doubled.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
        },
        {
            name: 'Alisha M.',
            role: 'Customer Success',
            content: 'The automated chatbots feature is a lifesaver. We\'re handling 3× more inquiries without hiring extra support.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
        },
        {
            name: 'Sandeep Verma',
            role: 'Online Educator, Pune',
            content: 'Announcing new batches used to take hours of copy-pasting. Now I can send a personalized broadcast to 500+ students in two minutes. Game-changer for my coaching business.',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
        },
        {
            name: 'Vikram R.',
            role: 'Growth Strategist',
            content: 'Seamless bulk WhatsApp campaigns—Super CRM makes me look like a pro marketer!',
            rating: 5,
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
        }
    ];

    // Duplicate reviews to create seamless loop
    const extendedReviews = [...reviews, ...reviews];

    return (
        <section id="reviews" className="py-20 bg-slate-950 overflow-hidden border-white/10">
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee:hover,
                .animate-marquee:active,
                .animate-marquee:focus {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="container mx-auto px-4 md:px-6 mb-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    From WhatsApp Chaos to{' '}
                    <span style={{ color: colors.interactive.primary }}>
                        Conversion Machines
                    </span>
                </h2>
                <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                    Hear from business owners, marketers, and sales teams in Gurugram and beyond who have transformed their sales process with Super CRM.
                </p>
            </div>

            <div className="relative w-full">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>

                <div className="flex overflow-hidden">
                    <div
                        className="flex gap-8 animate-marquee"
                        style={{ width: "max-content" }}
                    >
                        {extendedReviews.map((review, index) => (
                            <div
                                key={index}
                                className="w-[350px] md:w-[450px] flex-shrink-0 bg-[#111827] p-8 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors flex flex-col cursor-pointer"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={20} 
                                            style={{ 
                                                fill: colors.interactive.primary, 
                                                color: colors.interactive.primary 
                                            }}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-300 text-lg mb-6 leading-relaxed flex-grow">
                                    "{review.content}"
                                </p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <img
                                        src={review.image}
                                        alt={review.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                                    />
                                    <div>
                                        <h4 className="text-white font-bold">{review.name}</h4>
                                        <p className="text-sm text-gray-500">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Review;

