import React from "react";
import { Link } from "react-router-dom";
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
                                For partnership, bulk licensing or support queries, please visit our <Link to="/contact" className="underline" style={{ color: colors.interactive.primary }}>Contact</Link> page.
                            </p>
                        </section>

                        {/* Additional sections from instructions - add only if new */}
                        <section>
                            <h2 className="text-2xl font-semibold mt-6" style={{ color: colors.text.primary }}>
                                Who We Are
                            </h2>
                            <ul className="list-disc pl-6 mt-3" style={{ color: colors.text.secondary }}>
                                <li>Windows Operating Systems – Windows 7, 8.1, 10, and 11 (Retail, OEM, and Enterprise editions)</li>
                                <li>Windows Server Editions – Including Server 2012, 2016, 2019, and 2022</li>
                                <li>Office Suites – Office 2010, 2013, 2016, 2019, 2021 &amp; 365 (Home, Student, Pro Plus, Business)</li>
                                <li>Antiviruses and Anti-malware Tools – Norton, Quick Heal, K7, Kaspersky, and others</li>
                                <li>Developer and IT Tools – Visual Studio, SQL Server, Visio, etc.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6" style={{ color: colors.text.primary }}>
                                Why Choose SoftZcart?
                            </h2>
                            <div className="mt-3 space-y-4" style={{ color: colors.text.secondary }}>
                                <div>
                                    <h4 className="font-semibold">Genuine Keys, Guaranteed</h4>
                                    <p>All our products are 100% original, legitimate, and legally sourced, ensuring that you receive updates and full functionality from the respective software providers.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Lightning-Fast Delivery</h4>
                                    <p>SoftZcart is committed to rapid digital delivery. Most keys are delivered within minutes of purchase, backed by detailed activation instructions and live support.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Affordable Pricing</h4>
                                    <p>Our pricing structure is designed to offer the best value for money, making professional software accessible to individuals, startups, and enterprises alike.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Dedicated Support</h4>
                                    <p>Whether you need help choosing the right product or require activation assistance, we are available via WhatsApp, email, and phone. Customer Care: +91- 90429 93986</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6" style={{ color: colors.text.primary }}>
                                Our Vision
                            </h2>
                            <p className="mt-3 leading-relaxed" style={{ color: colors.text.secondary }}>
                                To become India’s most trusted destination for original software keys, empowering productivity, creativity, and security across the digital ecosystem. We envision a future where everyone uses legal software confidently and affordably, free from the worries of piracy.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6" style={{ color: colors.text.primary }}>
                                Stay Connected
                            </h2>
                            <p className="mt-3 leading-relaxed" style={{ color: colors.text.secondary }}>
                                Stay updated with the latest releases, upgrades, and special offers: Email: softzcart@gmail.com · Website: https://softzcart.com
                            </p>
                        </section>
                    </div>


                </div>
            </div>
        </>
    );
};

export default AboutPage;
