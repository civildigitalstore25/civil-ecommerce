export type ProductTrustBadge = {
    title: string;
    desc: string;
    icon: "truck" | "support" | "secure";
};

export const PRODUCT_TRUST_BADGES: ProductTrustBadge[] = [
    { title: "Free Digital Shipping", desc: "5-10 Min Instant Delivery", icon: "truck" },
    { title: "24/7 Customer Support", desc: "Online Help By Our Agents", icon: "support" },
    { title: "100% Secure Payments", desc: "UPI / Internet Banking / Cards", icon: "secure" },
];
