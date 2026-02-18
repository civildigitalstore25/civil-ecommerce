import React from "react";
import { motion } from "framer-motion";
import { useAdminThemeStyles } from "../hooks/useAdminThemeStyles";
import { PAYMENT_METHOD } from "../constants/siteContent";
import { Helmet } from "react-helmet";

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

const PaymentMethod: React.FC = () => {
    const { colors } = useAdminThemeStyles();

    return (
        <div
            className="min-h-screen py-12 px-4 pt-20 transition-colors duration-200"
            style={{ backgroundColor: colors.background.secondary }}
        >
            <Helmet>
                <title>{PAYMENT_METHOD.title}</title>
                <meta name="description" content={PAYMENT_METHOD.intro} />
            </Helmet>

            <div
                className="py-14 px-4 sm:py-20 sm:px-6"
                style={{
                    background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
                }}
            >
                <div className="max-w-5xl mx-auto text-center mb-14">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold" style={{ color: colors.text.primary }}>
                        {PAYMENT_METHOD.title}
                    </h1>
                    <p className="mt-4 text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: colors.text.secondary }}>
                        {PAYMENT_METHOD.intro}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto space-y-6">
                    {PAYMENT_METHOD.methods.map((m, idx) => (
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
                                {m.title}
                            </h3>
                            <ul className="list-disc pl-6 space-y-1" style={{ color: colors.text.secondary }}>
                                {m.bullets.map((b, bi) => (
                                    <li key={bi}>{b}</li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    <motion.div className="rounded-2xl shadow-md p-6 sm:p-8 border" style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary }} variants={cardVariants} initial="hidden" whileInView="visible" transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>Security & Compliance</h3>
                        <p style={{ color: colors.text.secondary }}>{PAYMENT_METHOD.security}</p>
                        <div className="mt-4 text-sm" style={{ color: colors.text.secondary }}>
                            <p>Need help? Contact:</p>
                            <p className="font-medium" style={{ color: colors.interactive.primary }}>{PAYMENT_METHOD.support.email} • {PAYMENT_METHOD.support.phone}</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;
