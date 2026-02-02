/**
 * Google Analytics utility functions
 */

// Extend the Window interface to include gtag
declare global {
    interface Window {
        gtag?: (
            command: 'config' | 'event' | 'set',
            targetId: string,
            config?: Record<string, any>
        ) => void;
        dataLayer?: any[];
    }
}

/**
 * Check if Google Analytics is loaded
 */
export const isGALoaded = (): boolean => {
    return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Track page views
 */
export const trackPageView = (url: string, title?: string) => {
    if (!isGALoaded()) return;

    window.gtag!('event', 'page_view', {
        page_path: url,
        page_title: title || document.title,
    });
};

/**
 * Track custom events
 */
export const trackEvent = (
    eventName: string,
    eventParams?: Record<string, any>
) => {
    if (!isGALoaded()) return;

    window.gtag!('event', eventName, eventParams);
};

/**
 * Track e-commerce events
 */

// Track when user views a product
export const trackProductView = (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    brand?: string;
}) => {
    trackEvent('view_item', {
        currency: 'INR',
        value: product.price,
        items: [
            {
                item_id: product.id,
                item_name: product.name,
                item_category: product.category,
                item_brand: product.brand,
                price: product.price,
            },
        ],
    });
};

// Track when user adds product to cart
export const trackAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
}) => {
    trackEvent('add_to_cart', {
        currency: 'INR',
        value: product.price * product.quantity,
        items: [
            {
                item_id: product.id,
                item_name: product.name,
                item_category: product.category,
                price: product.price,
                quantity: product.quantity,
            },
        ],
    });
};

// Track when user removes product from cart
export const trackRemoveFromCart = (product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
}) => {
    trackEvent('remove_from_cart', {
        currency: 'INR',
        value: product.price * product.quantity,
        items: [
            {
                item_id: product.id,
                item_name: product.name,
                price: product.price,
                quantity: product.quantity,
            },
        ],
    });
};

// Track when user begins checkout
export const trackBeginCheckout = (cart: {
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    total: number;
}) => {
    trackEvent('begin_checkout', {
        currency: 'INR',
        value: cart.total,
        items: cart.items.map((item) => ({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
        })),
    });
};

// Track when user completes purchase
export const trackPurchase = (order: {
    orderId: string;
    total: number;
    tax?: number;
    shipping?: number;
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
    }>;
}) => {
    trackEvent('purchase', {
        transaction_id: order.orderId,
        currency: 'INR',
        value: order.total,
        tax: order.tax || 0,
        shipping: order.shipping || 0,
        items: order.items.map((item) => ({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
        })),
    });
};

// Track search events
export const trackSearch = (searchTerm: string) => {
    trackEvent('search', {
        search_term: searchTerm,
    });
};

// Track when user signs up
export const trackSignup = (method: string = 'email') => {
    trackEvent('sign_up', {
        method,
    });
};

// Track when user logs in
export const trackLogin = (method: string = 'email') => {
    trackEvent('login', {
        method,
    });
};
