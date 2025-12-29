import React from "react";
import { motion } from "framer-motion";
import { FileText, Link, Shield, CreditCard, Database, Lock } from "lucide-react";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

const PrivacyPolicy: React.FC = () => {
    const { colors } = useAdminThemeStyles();

    return (
        <div
            className="py-14 px-4 sm:py-20 sm:px-6 mt-7"
            style={{ backgroundColor: colors.background.secondary }}
        >
            {/* Header */}
            <div className="max-w-5xl mx-auto text-center mb-10">
                <h1
                    className="text-5xl font-serif font-bold"
                    style={{ color: colors.text.primary }}
                >
                    Privacy Policy
                </h1>
                <p
                    className="mt-4 text-lg max-w-3xl mx-auto leading-relaxed"
                    style={{ color: colors.text.secondary }}
                >
                    Home / Privacy Policy
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid gap-8">
                {/* Who we are */}
                <motion.div
                    className="rounded-2xl shadow-md p-8 border"
                    style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary }}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full" style={{ backgroundColor: colors.background.secondary }}>
                            <FileText className="w-7 h-7" style={{ color: colors.interactive.primary }} />
                        </div>
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
                            Who we are
                        </h2>
                    </div>
                    <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                        Our website address is: <a href="https://softzcart.com" className="underline font-semibold" style={{ color: colors.interactive.primary }}>https://softzcart.com</a>.
                    </p>
                </motion.div>

                {/* What personal data we collect */}
                <motion.div
                    className="rounded-2xl shadow-md p-8 border"
                    style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary }}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full" style={{ backgroundColor: colors.background.secondary }}>
                            <Shield className="w-7 h-7" style={{ color: colors.interactive.primary }} />
                        </div>
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
                            What personal data we collect and why we collect it
                        </h2>
                    </div>

                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>Comments</h3>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection.
                    </p>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: <a href="https://automattic.com/privacy/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: colors.interactive.primary }}>https://automattic.com/privacy/</a>. After approval of your comment, your profile picture is visible to the public in the context of your comment.
                    </p>

                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>Media</h3>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
                    </p>

                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>Contact forms</h3>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        (Contact form handling text.)
                    </p>

                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>Cookies</h3>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
                    </p>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
                    </p>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select “Remember Me”, your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
                    </p>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
                    </p>

                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>Embedded content from other websites</h3>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
                    </p>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
                    </p>

                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>Analytics</h3>
                    <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                        (Analytics handling text.)
                    </p>
                </motion.div>

                {/* Who we share your data with & Retention */}
                <motion.div
                    className="rounded-2xl shadow-md p-8 border"
                    style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary }}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full" style={{ backgroundColor: colors.background.secondary }}>
                            <Link className="w-7 h-7" style={{ color: colors.interactive.primary }} />
                        </div>
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
                            Who we share your data with
                        </h2>
                    </div>
                    <p className="leading-relaxed mb-4" style={{ color: colors.text.secondary }}>
                        If you request a password reset, your IP address will be included in the reset email.
                    </p>

                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>How long we retain your data</h3>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
                    </p>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
                    </p>

                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>What rights you have over your data</h3>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
                    </p>

                    <h3 className="font-semibold" style={{ color: colors.text.primary }}>Where we send your data</h3>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        Visitor comments may be checked through an automated spam detection service.
                    </p>
                </motion.div>

                {/* Payment Information - Razorpay */}
                <motion.div
                    className="rounded-2xl shadow-md p-8 border"
                    style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary }}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full" style={{ backgroundColor: colors.background.secondary }}>
                            <CreditCard className="w-7 h-7" style={{ color: colors.interactive.primary }} />
                        </div>
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
                            Payment Information Collection
                        </h2>
                    </div>
                    <p className="leading-relaxed mb-4" style={{ color: colors.text.secondary }}>
                        When you make a purchase on our website, your payment is processed by <strong style={{ color: colors.interactive.primary }}>Razorpay</strong>, our trusted third-party payment processor. We collect and share the following information with Razorpay:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4" style={{ color: colors.text.secondary }}>
                        <li>Name and billing address</li>
                        <li>Email address and phone number</li>
                        <li>Order details and transaction amount</li>
                        <li>Device and browser information for fraud prevention</li>
                    </ul>
                    <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                        <strong style={{ color: colors.text.primary }}>Important:</strong> We do NOT store your complete credit/debit card numbers, CVV, or banking credentials on our servers. All sensitive payment information is securely handled by Razorpay's PCI-DSS Level 1 compliant infrastructure.
                    </p>
                </motion.div>

                {/* Third-Party Payment Processor */}
                <motion.div
                    className="rounded-2xl shadow-md p-8 border"
                    style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary }}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full" style={{ backgroundColor: colors.background.secondary }}>
                            <Lock className="w-7 h-7" style={{ color: colors.interactive.primary }} />
                        </div>
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
                            Third-Party Payment Processing
                        </h2>
                    </div>
                    <p className="leading-relaxed mb-4" style={{ color: colors.text.secondary }}>
                        Razorpay is an independent payment service provider with its own privacy practices. When you complete a transaction:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4" style={{ color: colors.text.secondary }}>
                        <li>You are redirected to Razorpay's secure payment gateway</li>
                        <li>Your payment data is transmitted directly to Razorpay using 256-bit SSL encryption</li>
                        <li>Razorpay processes the payment according to their Terms of Service and Privacy Policy</li>
                        <li>We receive only transaction confirmation and basic order details</li>
                    </ul>
                    <p className="leading-relaxed mb-3" style={{ color: colors.text.secondary }}>
                        We recommend reviewing Razorpay's Privacy Policy at{" "}
                        <a
                            href="https://razorpay.com/privacy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-semibold"
                            style={{ color: colors.interactive.primary }}
                        >
                            https://razorpay.com/privacy/
                        </a>{" "}
                        to understand how they handle your payment information.
                    </p>
                    <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                        <strong style={{ color: colors.text.primary }}>Merchant Agreement:</strong> We entered into a merchant agreement with Razorpay on December 14, 2025, governing our use of their payment services and data handling practices.
                    </p>
                </motion.div>

                {/* Data Security & Compliance */}
                <motion.div
                    className="rounded-2xl shadow-md p-8 border"
                    style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary }}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.6, delay: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full" style={{ backgroundColor: colors.background.secondary }}>
                            <Database className="w-7 h-7" style={{ color: colors.interactive.primary }} />
                        </div>
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
                            Data Security & Compliance
                        </h2>
                    </div>
                    <p className="leading-relaxed mb-4" style={{ color: colors.text.secondary }}>
                        We implement industry-standard security measures to protect your personal and payment information:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4" style={{ color: colors.text.secondary }}>
                        <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using SSL/TLS protocols</li>
                        <li><strong>Secure Storage:</strong> Personal data is stored on secure servers with restricted access</li>
                        <li><strong>Tokenization:</strong> Payment card details are tokenized by Razorpay for secure storage</li>
                        <li><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments</li>
                        <li><strong>Access Controls:</strong> Only authorized personnel have access to sensitive customer data</li>
                    </ul>
                    <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                        In the event of a data breach affecting your payment information, we will notify you promptly in accordance with applicable data protection laws.
                    </p>
                </motion.div>

                {/* Payment Data Retention */}
                <motion.div
                    className="rounded-2xl shadow-md p-8 border"
                    style={{ backgroundColor: colors.background.primary, borderColor: colors.border.primary }}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.6, delay: 0.7 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full" style={{ backgroundColor: colors.background.secondary }}>
                            <Shield className="w-7 h-7" style={{ color: colors.interactive.primary }} />
                        </div>
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text.primary }}>
                            Payment Data Retention
                        </h2>
                    </div>
                    <p className="leading-relaxed mb-4" style={{ color: colors.text.secondary }}>
                        We retain transaction-related data for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4" style={{ color: colors.text.secondary }}>
                        <li>Order fulfillment and customer service</li>
                        <li>Processing refunds and handling disputes</li>
                        <li>Compliance with tax and financial regulations</li>
                        <li>Fraud detection and prevention</li>
                        <li>Legal obligations and record-keeping requirements</li>
                    </ul>
                    <p className="leading-relaxed" style={{ color: colors.text.secondary }}>
                        Transaction records are typically retained for 7 years from the date of purchase to comply with accounting and tax laws. Payment card tokens stored by Razorpay may be retained as long as your account is active or as needed for recurring transactions.
                    </p>
                </motion.div>
            </div>

            {/* Footer Notice */}
            <div className="mt-12 text-center text-sm" style={{ color: colors.text.secondary }}>
                Last updated: <strong>December 2025</strong> • Subject to change anytime
                <br />
                <span className="mt-2 inline-block">
                    Payment processing powered by{" "}
                    <strong style={{ color: colors.interactive.primary }}>Razorpay</strong> •
                    Secure payment gateway partner since December 2025
                </span>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
