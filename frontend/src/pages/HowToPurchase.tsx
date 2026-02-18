import React from "react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../hooks/useAdminThemeStyles";
import { HOW_TO_PURCHASE } from "../constants/siteContent";
import { Helmet } from "react-helmet";

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

const HowToPurchase: React.FC = () => {
    const { colors } = useAdminThemeStyles();

    return (
        <div
            className="min-h-screen py-12 px-4 pt-20 transition-colors duration-200"
            style={{ backgroundColor: colors.background.secondary }}
        >
            <Helmet>
                <title>{HOW_TO_PURCHASE.title}</title>
                <meta name="description" content={HOW_TO_PURCHASE.intro} />
            </Helmet>

            <div
                className="py-14 px-4 sm:py-20 sm:px-6"
                style={{
                    background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
                }}
            >
                <div className="max-w-5xl mx-auto text-center mb-14">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold" style={{ color: colors.text.primary }}>
                        {HOW_TO_PURCHASE.title}
                    </h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: colors.text.secondary }}>
                        {HOW_TO_PURCHASE.intro}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto space-y-6">
                    {HOW_TO_PURCHASE.steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            className="rounded-2xl shadow-md p-6 sm:p-8 border"
                            style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary }}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            transition={{ duration: 0.5, delay: idx * 0.06 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>
                                {idx + 1}. {step.title}
                            </h3>
                            <ul className="list-disc pl-6 space-y-1" style={{ color: colors.text.secondary }}>
                                {step.bullets.map((b, bi) => (
                                    <li key={bi}>{b}</li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HowToPurchase;
