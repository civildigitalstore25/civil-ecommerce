export const EMAIL_BRAND = {
    brandName: process.env.FROM_NAME || "Civil Digital Store",
    fromEmail: process.env.FROM_EMAIL || "noreply@yourapp.com",
    supportEmail:
        process.env.CONTACT_EMAIL || process.env.FROM_EMAIL || "support@yourapp.com",
    websiteUrl: process.env.FRONTEND_URL || "",
    accentColor: process.env.EMAIL_ACCENT_COLOR || "#0A2A6B",
    footer: {
        privacyPolicyUrl:
            process.env.PRIVACY_POLICY_URL ||
            (process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/privacy-policy` : ""),
        helpCenterUrl:
            process.env.HELP_CENTER_URL ||
            (process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/contact` : ""),
    },
    social: {
        facebook:
            process.env.SOCIAL_FACEBOOK_URL || "https://www.facebook.com/SoftzCart/",
        instagram:
            process.env.SOCIAL_INSTAGRAM_URL || "https://www.instagram.com/softzcart/",
        linkedin:
            process.env.SOCIAL_LINKEDIN_URL || "https://www.linkedin.com/in/softzcart/",
        youtube:
            process.env.SOCIAL_YOUTUBE_URL || "https://www.youtube.com/@SoftZcart",
        x: process.env.SOCIAL_X_URL || "https://x.com/SoftZcart",
        whatsapp: process.env.SOCIAL_WHATSAPP_URL || "",
        pinterest: process.env.SOCIAL_PINTEREST_URL || "",
    },
};
