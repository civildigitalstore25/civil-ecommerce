
import { Check } from 'lucide-react';
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const Pricing = () => {
    const { colors } = useAdminTheme();

    const plans = [
        {
            name: 'Monthly Plan',
            originalPrice: '₹999',
            price: '₹499',
            period: 'per month',
            tagline: 'Less than the price of a Pizza!',
            subtext: (
                <p className="text-sm text-gray-400 mt-2">
                    Cost per month: <span className="text-white font-bold">₹499.00</span>
                </p>
            ),
            features: [
                '1 User License',
                "Full CRM Dashboard",
                "Chatbot & Automation",
                "Regular Updates & Support"
            ],
            buttonText: 'Get Started Now',
            badge: 'Flexible Plan',
            badgeClass: 'bg-slate-600 text-white', // Static class for non-theme badges
            popular: false
        },
        {
            name: '2 Year Plan',
            originalPrice: '₹7,999',
            price: '₹3,999',
            period: 'per 2 years',
            tagline: 'Less than ₹5.48 per day!',
            subtext: (
                <div className="text-sm text-gray-400 mt-2">
                    <p>Effective Monthly Cost: <span className="text-white font-bold">₹166.63</span></p>
                    <p className="text-gray-500 text-xs mt-0.5">(Deepest Recurring Discount)</p>
                </div>
            ),
            features: [
                '1 User License',
                "Full CRM Dashboard",
                "Chatbot & Automation",
                "All Future Updates & Support",
                "Priority Support"
            ],
            buttonText: 'Get Started Now',
            badge: 'Best Value',
            // No badgeClass here; we will style this dynamically with theme color
            popular: true
        },
        {
            name: 'Yearly Plan',
            originalPrice: '₹5,999',
            price: '₹2,999',
            period: 'per year',
            tagline: 'Less than ₹8.22 per day!',
            subtext: (
                <div className="text-sm text-gray-400 mt-2">
                    <p>Effective Monthly Cost: <span className="text-white">₹249.92</span> (Saves</p>
                    <p>50% over monthly plan)</p>
                </div>
            ),
            features: [
                '1 User License',
                "Full CRM Dashboard",
                "Chatbot & Automation",
                "All Future Updates & Support"
            ],
            buttonText: 'Get Started Now',
            badge: 'Most Popular',
            badgeClass: 'bg-blue-500 text-white', // Static class for non-theme badges
            popular: false
        }
    ];

    return (
        <section id="pricing" className="py-20 bg-slate-950 font-sans ">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        The Perfect Plan for Your Business
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Choose the plan that's right for your business. <span className="font-bold text-white">Risk-Free with our 30-Day Money-Back Guarantee.</span>
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative flex flex-col h-full rounded-2xl p-1 transition-transform hover:-translate-y-1 ${plan.popular
                                    ? 'bg-[#111827] border-2 scale-105 z-10 shadow-2xl shadow-black/50'
                                    : 'bg-[#111827] border border-gray-800'
                                }`}
                            // Apply dynamic border color only to the popular plan
                            style={{ 
                                borderColor: plan.popular ? colors.interactive.primary : undefined 
                            }}
                        >
                            <div className="p-8 flex flex-col h-full">
                                {/* Badge */}
                                <div className="flex justify-center mb-6">
                                    <span 
                                        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${plan.badgeClass || ''}`}
                                        // Apply dynamic background to the popular badge
                                        style={plan.popular ? { 
                                            backgroundColor: colors.interactive.primary,
                                            color: '#020617' // Dark text (slate-950) for contrast against bright theme colors
                                        } : {}}
                                    >
                                        {plan.badge}
                                    </span>
                                </div>

                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>

                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <span className="text-xl text-gray-500 line-through decoration-gray-600">{plan.originalPrice}</span>
                                        <span className="text-5xl font-bold text-white">{plan.price}</span>
                                    </div>

                                    <div className="text-gray-500 text-sm mb-6">{plan.period}</div>

                                    {/* Dynamic Theme Color for Tagline */}
                                    <p 
                                        className="font-bold text-sm mb-2"
                                        style={{ color: colors.interactive.primary }}
                                    >
                                        {plan.tagline}
                                    </p>

                                    {plan.subtext}
                                </div>

                                <div className="space-y-4 flex-grow mt-4 mb-8 px-4">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            {/* Keeps checks green as per standard UI practice, or change to colors.interactive.primary if preferred */}
                                            <Check className="w-5 h-5 text-emerald-500 shrink-0" strokeWidth={3} />
                                            <span className="text-gray-400 text-sm text-left leading-relaxed">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    <button
                                        className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${!plan.popular ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700' : 'text-slate-900 shadow-lg'}`}
                                        style={plan.popular ? {
                                            backgroundColor: colors.interactive.primary,
                                            // Add a subtle glow using the primary color
                                            boxShadow: `0 10px 15px -3px ${colors.interactive.primary}40` 
                                        } : {}}
                                        onMouseEnter={(e) => {
                                            if (plan.popular) {
                                                e.currentTarget.style.backgroundColor = colors.interactive.primaryHover || colors.interactive.primary;
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (plan.popular) {
                                                e.currentTarget.style.backgroundColor = colors.interactive.primary;
                                            }
                                        }}
                                    >
                                        {plan.buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;