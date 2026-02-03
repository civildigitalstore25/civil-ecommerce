import React from "react";
import { Helmet } from "react-helmet";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { getAboutSEO } from "../utils/seo";

const AboutPage: React.FC = () => {
    const { colors, theme } = useAdminTheme();
    const seoData = getAboutSEO();

    return (
        <>
            <Helmet>
                <title>{seoData.title}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={seoData.keywords} />
                <meta property="og:title" content={seoData.title} />
                <meta property="og:description" content={seoData.description} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <div
                className="min-h-[calc(100vh-120px)] p-6 md:p-10 pt-20 relative mt-20"
                style={{
                    backgroundColor: theme === "light" ? "#F5F7FA" : colors.background.primary,
                }}
            >
            <div
                className="mx-auto max-w-6xl rounded-xl shadow-xl overflow-hidden"
                style={{
                    backgroundColor: theme === "light" ? "#fff" : colors.background.secondary,
                    border: `1px solid ${theme === "light" ? "#E2E8F0" : colors.border.primary}`,
                }}
            >
                <div
                    className="p-10 text-center"
                    style={{
                        background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
                    }}
                >
                    <h1 className="mb-2 text-3xl md:text-4xl font-bold" style={{ color: "#fff" }}>
                        About Softzcart
                    </h1>
                    <p className="mx-auto max-w-xl opacity-90" style={{ color: "#fff" }}>
                        We provide software products, licenses and services to architects, engineers and professionals worldwide.
                    </p>
                </div>

                <div className="p-10 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
                            Our Mission
                        </h2>
                        <p className="mt-3 leading-relaxed" style={{ color: colors.text.secondary }}>
                            Our mission is to make professional software accessible to Indian engineering and design communities by offering legitimate licenses, expert support and easy digital delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
                            What We Offer
                        </h2>
                        <ul className="list-disc pl-6 mt-3" style={{ color: colors.text.secondary }}>
                            <li>Licensed Ebooks</li>
                            <li>Subscription & lifetime licensing options</li>
                            <li>Activation & installation guidance</li>
                            <li>Priority support for enterprise customers</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
                            Our Values
                        </h2>
                        <p className="mt-3 leading-relaxed" style={{ color: colors.text.secondary }}>
                            We value transparency, compliance and customer-first service. All our products are distributed with proper licensing and support to ensure long-term satisfaction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
                            Get in Touch
                        </h2>
                        <p className="mt-3 leading-relaxed" style={{ color: colors.text.secondary }}>
                            For partnership, bulk licensing or support queries, please visit our <a href="/contact" className="underline" style={{ color: colors.interactive.primary }}>Contact</a> page.
                        </p>
                    </section>
                </div>

               
            </div>
        </div>
        </>
    );
};

export default AboutPage;
