// Product form constants - centralized place for all product form defaults and configurations

export const BRANDS = [
    { value: "autodesk", label: "Autodesk" },
    { value: "microsoft", label: "Microsoft" },
    { value: "adobe", label: "Adobe" },
    { value: "coreldraw", label: "Coreldraw" },
    { value: "antivirus", label: "Antivirus" },
    { value: "structural-softwares", label: "Structural Softwares" },
    { value: "architectural-softwares", label: "Architectural Softwares" },
    { value: "accounting-billing", label: "Accounting and Billing" },
    { value: "ebook", label: "Ebook" },
    { value: "others", label: "Others" },
];

export const BRAND_CATEGORIES: Record<string, { value: string; label: string }[]> = {
    autodesk: [
        { value: "autocad", label: "AutoCAD" },
        { value: "3ds-max", label: "3ds MAX" },
        { value: "revit", label: "Revit" },
        { value: "maya", label: "Maya" },
        { value: "fusion", label: "Fusion" },
        { value: "navisworks-manage", label: "Navisworks Manage" },
        { value: "inventor-professional", label: "Inventor Professional" },
        { value: "autocad-lt", label: "AutoCAD LT" },
        { value: "aec-collection", label: "AEC Collection" },
        { value: "civil-3d", label: "Civil 3D" },
        { value: "map-3d", label: "Map 3D" },
        { value: "autocad-mechanical", label: "AutoCAD Mechanical" },
        { value: "autocad-electrical", label: "AutoCAD Electrical" },
        { value: "autocad-mep", label: "AutoCAD MEP" },
    ],
    microsoft: [
        { value: "microsoft-365", label: "Microsoft 365" },
        { value: "microsoft-professional", label: "Microsoft Professional" },
        { value: "microsoft-projects", label: "Microsoft Projects" },
        { value: "server", label: "Server" },
        { value: "windows", label: "Windows" },
    ],
    adobe: [
        { value: "adobe-acrobat", label: "Adobe Acrobat" },
        { value: "photoshop", label: "Photoshop" },
        { value: "lightroom", label: "Lightroom" },
        { value: "after-effect", label: "After Effect" },
        { value: "premier-pro", label: "Premier Pro" },
        { value: "illustrator", label: "Illustrator" },
        { value: "adobe-creative-cloud", label: "Adobe Creative Cloud" },
    ],
    coreldraw: [
        { value: "coreldraw-graphics-suite", label: "Coreldraw Graphics Suite" },
        { value: "coreldraw-technical-suite", label: "Coreldraw Technical Suite" },
    ],
    antivirus: [
        { value: "k7-security", label: "K7 Security" },
        { value: "quick-heal", label: "Quick Heal" },
        { value: "hyper-say", label: "Hyper Say" },
        { value: "norton", label: "Norton" },
        { value: "mcafee", label: "McAfee" },
        { value: "eset", label: "ESET" },
    ],
    "structural-softwares": [
        { value: "e-tab", label: "E-Tab" },
        { value: "safe", label: "Safe" },
        { value: "sap-2000", label: "Sap 2000" },
        { value: "tekla", label: "Tekla" },
    ],
    "architectural-softwares": [
        { value: "lumion", label: "Lumion" },
        { value: "twin-motion", label: "Twin Motion" },
        { value: "d5-render", label: "D5 Render" },
        { value: "archi-cad", label: "Archi CAD" },
    ],
    "accounting-billing": [
        { value: "tally", label: "Tally" },
        { value: "vyapar", label: "Vyapar" },
    ],
    ebook: [],
    others: [],
};

export const PRODUCT_STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
];

export const DEFAULT_PRODUCT_FORM = {
    name: "",
    version: "",
    longDescription: "",
    detailsDescription: "",
    category: "",
    brand: BRANDS[0].value,
    subscriptionDurations: [
        { duration: "1 Year", price: "", priceINR: "", priceUSD: "", trialDays: "" },
    ],
    ebookPriceINR: "",
    ebookPriceUSD: "",
    subscriptions: [
        { duration: "Monthly", price: "", priceINR: "", priceUSD: "" },
    ],
    hasLifetime: false,
    lifetimePrice: "",
    lifetimePriceINR: "",
    lifetimePriceUSD: "",
    hasMembership: false,
    membershipPrice: "",
    membershipPriceINR: "",
    membershipPriceUSD: "",
    strikethroughPriceINR: "",
    strikethroughPriceUSD: "",
    imageUrl: "",
    additionalImages: [""],
    videoUrl: "",
    activationVideoUrl: "",
    driveLink: "",
    status: "active",
    isBestSeller: false,
    isOutOfStock: false,
    faqs: [],
    keyFeatures: [],
    systemRequirements: [],
    // Deal fields
    isDeal: false,
    dealStartDate: "",
    dealEndDate: "",
    dealStartTime: "",
    dealEndTime: "",
    dealEbookPriceINR: "",
    dealEbookPriceUSD: "",
    dealLifetimePriceINR: "",
    dealLifetimePriceUSD: "",
    dealMembershipPriceINR: "",
    dealMembershipPriceUSD: "",
    dealSubscriptionDurations: [],
    dealSubscriptions: [],
};

// LocalStorage keys for auto-save
export const DRAFT_STORAGE_KEY = 'product_form_draft';
export const DRAFT_TIMESTAMP_KEY = 'product_form_draft_timestamp';

// Auto-save interval in milliseconds (save every 3 seconds)
export const AUTO_SAVE_INTERVAL = 3000;

// Types
export interface SubscriptionDuration {
    duration: string;
    price: string;
    priceINR: string;
    priceUSD: string;
    trialDays?: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export interface Requirement {
    icon: string;
    title: string;
    description: string;
}

export interface ProductForm {
    name: string;
    version: string;
    longDescription: string;
    detailsDescription: string;
    category: string;
    brand: string;
    subscriptionDurations: SubscriptionDuration[];
    ebookPriceINR: string;
    ebookPriceUSD: string;
    subscriptions: SubscriptionDuration[];
    hasLifetime: boolean;
    lifetimePrice: string;
    lifetimePriceINR: string;
    lifetimePriceUSD: string;
    hasMembership: boolean;
    membershipPrice: string;
    membershipPriceINR: string;
    membershipPriceUSD: string;
    strikethroughPriceINR: string;
    strikethroughPriceUSD: string;
    imageUrl: string;
    additionalImages: string[];
    videoUrl: string;
    activationVideoUrl: string;
    driveLink: string;
    status: string;
    isBestSeller: boolean;
    isOutOfStock: boolean;
    faqs: FAQ[];
    keyFeatures: Feature[];
    systemRequirements: Requirement[];
    // Deal fields
    isDeal: boolean;
    dealStartDate: string;
    dealEndDate: string;
    dealStartTime: string;
    dealEndTime: string;
    dealEbookPriceINR: string;
    dealEbookPriceUSD: string;
    dealLifetimePriceINR: string;
    dealLifetimePriceUSD: string;
    dealMembershipPriceINR: string;
    dealMembershipPriceUSD: string;
    dealSubscriptionDurations: SubscriptionDuration[];
    dealSubscriptions: SubscriptionDuration[];
}
