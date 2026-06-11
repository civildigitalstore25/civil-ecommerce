import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { getAboutSEO, buildCanonicalUrl } from "../utils/seo";
import { Target, Package, Star, Phone, Users, CheckCircle, Zap, DollarSign, Headphones, Eye, Wifi } from "lucide-react";

const AboutPage: React.FC = () => {
    const { pathname } = useLocation();
    const { colors, theme } = useAdminTheme();
    const seoData = getAboutSEO();

    const isLight = theme === "light";

    const sectionTitle = (text: string, icon: React.ReactNode, mt = false) => (
        <div className={`flex items-center gap-2 sm:gap-3 ${mt ? "mt-4 sm:mt-6" : ""} mb-3 sm:mb-4`}>
            <div
                className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full shadow-sm"
                style={{ background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)", color: "#fff" }}
            >
                {icon}
            </div>
            <h2
                className="text-lg sm:text-xl font-bold"
                style={{ color: isLight ? "#0A2A6B" : colors.text.primary }}
            >
                {text}
            </h2>
        </div>
    );

    const card = (children: React.ReactNode, accent?: string) => (
        <div
            className="rounded-lg p-4 sm:p-5"
            style={{
                backgroundColor: isLight ? "#F8FAFC" : colors.background.primary,
                border: `1px solid ${isLight ? (accent ?? "#E2E8F0") : colors.border.primary}`,
            }}
        >
            {children}
        </div>
    );

    const bodyText = "text-sm sm:text-base leading-relaxed";
    const mutedColor = { color: isLight ? "#475569" : colors.text.secondary };

    return (
        <>
            <Helmet>
                <title>{seoData.title}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={seoData.keywords} />
                <meta property="og:title" content={seoData.title} />
                <meta property="og:description" content={seoData.description} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={buildCanonicalUrl(pathname)} />
            </Helmet>

            {/* Outer wrapper */}
            <div
                className="min-h-[calc(100vh-120px)] px-3 py-4 sm:p-6 md:p-10 pt-16 sm:pt-20 relative mt-16 sm:mt-20"
                style={{ backgroundColor: isLight ? "#F5F7FA" : colors.background.primary }}
            >
                <div
                    className="mx-auto max-w-6xl rounded-xl shadow-xl overflow-hidden"
                    style={{
                        backgroundColor: isLight ? "#fff" : colors.background.secondary,
                        border: `1px solid ${isLight ? "#E2E8F0" : colors.border.primary}`,
                    }}
                >
                    {/* Hero Header */}
                    <div
                        className="px-4 py-7 sm:p-10 text-center"
                        style={{ backgroundColor: "#0A2A6B" }}
                    >
                        <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: "#fff" }}>
                            About Softzcart
                        </h1>
                        <p className="mx-auto max-w-xl text-sm sm:text-base opacity-90" style={{ color: "#fff" }}>
                            We provide software products, licenses and services to architects, engineers and professionals worldwide.
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="px-4 py-5 sm:p-8 lg:p-10 space-y-5 sm:space-y-7">

                        {/* Our Mission */}
                        <section>
                            {sectionTitle("Our Mission", <Target size={14} strokeWidth={2.25} />)}
                            {card(
                                <p className={bodyText} style={mutedColor}>
                                    Our mission is to make professional software accessible to Indian engineering and design communities by offering legitimate licenses, expert support and easy digital delivery.
                                </p>
                            )}
                        </section>

                        {/* What We Offer */}
                        <section>
                            {sectionTitle("What We Offer", <Package size={14} strokeWidth={2.25} />)}
                            {card(
                                <ul className="space-y-2">
                                    {[
                                        "Licensed Ebooks",
                                        "Subscription & lifetime licensing options",
                                        "Activation & installation guidance",
                                        "Priority support for enterprise customers",
                                    ].map((item) => (
                                        <li key={item} className={`flex items-start gap-2 ${bodyText}`} style={mutedColor}>
                                            <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#00C8FF" }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Our Values */}
                        <section>
                            {sectionTitle("Our Values", <Star size={14} strokeWidth={2.25} />)}
                            {card(
                                <p className={bodyText} style={mutedColor}>
                                    We value transparency, compliance and customer-first service. All our products are distributed with proper licensing and support to ensure long-term satisfaction.
                                </p>
                            )}
                        </section>

                        {/* Who We Are */}
                        <section>
                            {sectionTitle("Who We Are", <Users size={14} strokeWidth={2.25} />)}
                            {card(
                                <ul className="space-y-2">
                                    {[
                                        "Windows Operating Systems – Windows 7, 8.1, 10, and 11 (Retail, OEM, and Enterprise editions)",
                                        "Windows Server Editions – Including Server 2012, 2016, 2019, and 2022",
                                        "Office Suites – Office 2010, 2013, 2016, 2019, 2021 & 365 (Home, Student, Pro Plus, Business)",
                                        "Antiviruses and Anti-malware Tools – Norton, Quick Heal, K7, Kaspersky, and others",
                                        "Developer and IT Tools – Visual Studio, SQL Server, Visio, etc.",
                                    ].map((item) => (
                                        <li key={item} className={`flex items-start gap-2 ${bodyText}`} style={mutedColor}>
                                            <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#00C8FF" }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* Why Choose SoftZcart */}
                        <section>
                            {sectionTitle("Why Choose SoftZcart?", <CheckCircle size={14} strokeWidth={2.25} />)}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {[
                                    {
                                        icon: <CheckCircle size={14} strokeWidth={2} />,
                                        title: "Genuine Keys, Guaranteed",
                                        desc: "All our products are 100% original, legitimate, and legally sourced, ensuring updates and full functionality.",
                                        accent: "#E0F2FE",
                                    },
                                    {
                                        icon: <Zap size={14} strokeWidth={2} />,
                                        title: "Lightning-Fast Delivery",
                                        desc: "Most keys are delivered within minutes of purchase, backed by detailed activation instructions and live support.",
                                        accent: "#FEF3C7",
                                    },
                                    {
                                        icon: <DollarSign size={14} strokeWidth={2} />,
                                        title: "Affordable Pricing",
                                        desc: "Our pricing makes professional software accessible to individuals, startups, and enterprises alike.",
                                        accent: "#DCFCE7",
                                    },
                                    {
                                        icon: <Headphones size={14} strokeWidth={2} />,
                                        title: "Dedicated Support",
                                        desc: "Available via WhatsApp, email, and phone. Customer Care: +91-90429 93986",
                                        accent: "#F3E8FF",
                                    },
                                ].map(({ icon, title, desc, accent }) => (
                                    <div
                                        key={title}
                                        className="rounded-lg p-4 sm:p-5"
                                        style={{
                                            backgroundColor: isLight ? "#F8FAFC" : colors.background.primary,
                                            border: `1px solid ${isLight ? accent : colors.border.primary}`,
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                                            <span style={{ color: "#0A2A6B" }}>{icon}</span>
                                            <h4
                                                className="text-sm sm:text-base font-semibold"
                                                style={{ color: isLight ? "#0A2A6B" : colors.text.primary }}
                                            >
                                                {title}
                                            </h4>
                                        </div>
                                        <p className="text-xs sm:text-sm leading-relaxed" style={mutedColor}>{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Our Vision */}
                        <section>
                            {sectionTitle("Our Vision", <Eye size={14} strokeWidth={2.25} />)}
                            {card(
                                <p className={bodyText} style={mutedColor}>
                                    To become India's most trusted destination for original software keys, empowering productivity, creativity, and security across the digital ecosystem. We envision a future where everyone uses legal software confidently and affordably, free from the worries of piracy.
                                </p>
                            )}
                        </section>

                        {/* Stay Connected */}
                        <section>
                            {sectionTitle("Stay Connected", <Wifi size={14} strokeWidth={2.25} />)}
                            {card(
                                <p className={bodyText} style={mutedColor}>
                                    Stay updated with the latest releases, upgrades, and special offers:{" "}
                                    <a href="mailto:softzcart@gmail.com" className="underline font-medium" style={{ color: "#0A2A6B" }}>
                                        softzcart@gmail.com
                                    </a>{" "}
                                    · Website:{" "}
                                    <a href="https://softzcart.com" target="_blank" rel="noopener noreferrer" className="underline font-medium" style={{ color: "#0A2A6B" }}>
                                        softzcart.com
                                    </a>
                                </p>
                            )}
                        </section>

                        {/* Get in Touch CTA */}
                        <section>
                            {sectionTitle("Get in Touch", <Phone size={14} strokeWidth={2.25} />)}
                            <div
                                className="rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                                style={{
                                    backgroundColor: isLight ? "#F0F9FF" : colors.background.primary,
                                    border: `2px solid ${isLight ? "#0EA5E9" : colors.border.primary}`,
                                }}
                            >
                                <p className={`${bodyText} flex-1`} style={mutedColor}>
                                    For partnership, bulk licensing or support queries, please visit our Contact page.
                                </p>
                                <Link
                                    to="/contact"
                                    className="w-full sm:w-auto text-center shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:shadow-md hover:-translate-y-0.5"
                                    style={{
                                        backgroundColor: "#0A2A6B",
                                        color: "#fff",
                                    }}
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutPage;
