"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
// Helper function to calculate item total price
const calculateItemTotal = (price, quantity) => {
    return Math.round(price * quantity * 100) / 100;
};
// Helper function to get price by license type
const getPriceByLicenseType = (product, licenseType, subscriptionPlan) => {
    console.log(`Getting price for product: ${product.name}, licenseType: ${licenseType}`);
    console.log('Subscription plan details:', subscriptionPlan);
    console.log('Product subscription data:', {
        subscriptionDurations: product.subscriptionDurations,
        subscriptions: product.subscriptions,
        lifetimePriceINR: product.lifetimePriceINR,
        membershipPriceINR: product.membershipPriceINR
    });
    // If subscription plan details are provided, use them to find the exact plan
    if (subscriptionPlan && subscriptionPlan.planId && subscriptionPlan.planLabel) {
        console.log(`Looking for specific plan: ${subscriptionPlan.planLabel} (${subscriptionPlan.planId})`);
        // Check admin subscription plans first
        if (product.subscriptions && product.subscriptions.length > 0) {
            for (const [index, sub] of product.subscriptions.entries()) {
                const expectedPlanId = `admin-subscription-${index}`;
                if (subscriptionPlan.planId === expectedPlanId || sub.duration === subscriptionPlan.planLabel) {
                    const price = sub.priceINR || sub.price || 0;
                    console.log(`Found matching admin subscription plan: ${sub.duration} = ₹${price}`);
                    return price;
                }
            }
        }
        // Check main subscription durations
        if (product.subscriptionDurations && product.subscriptionDurations.length > 0) {
            for (const [index, sub] of product.subscriptionDurations.entries()) {
                const expectedPlanId = `subscription-${index}`;
                if (subscriptionPlan.planId === expectedPlanId || sub.duration === subscriptionPlan.planLabel) {
                    const price = sub.priceINR || sub.price || 0;
                    console.log(`Found matching subscription duration: ${sub.duration} = ₹${price}`);
                    return price;
                }
            }
        }
        // Check for lifetime plan
        if (subscriptionPlan.planId === 'lifetime') {
            const lifetimePrice = product.lifetimePriceINR || product.priceLifetimeINR || product.priceLifetime || 0;
            console.log(`Found lifetime plan: ₹${lifetimePrice}`);
            return lifetimePrice;
        }
        // Check for membership plan
        if (subscriptionPlan.planId === 'membership') {
            const membershipPrice = product.membershipPriceINR || product.membershipPrice || 0;
            console.log(`Found membership plan: ₹${membershipPrice}`);
            return membershipPrice;
        }
    }
    // First check modern subscription durations (primary pricing)
    if (product.subscriptionDurations && product.subscriptionDurations.length > 0) {
        console.log('Checking subscription durations...');
        // For 1year license type, try to find 1-year subscription plans
        if (licenseType === '1year') {
            for (const sub of product.subscriptionDurations) {
                const duration = sub.duration.toLowerCase();
                if (duration.includes('1') && (duration.includes('year') || duration.includes('annual'))) {
                    const price = sub.priceINR || sub.price || 0;
                    console.log(`Found 1-year plan: ${sub.duration} = ₹${price}`);
                    return price;
                }
            }
            // If no specific 1-year plan found, take the first subscription plan
            if (product.subscriptionDurations.length > 0) {
                const firstPlan = product.subscriptionDurations[0];
                const price = firstPlan.priceINR || firstPlan.price || 0;
                console.log(`Using first subscription plan: ${firstPlan.duration} = ₹${price}`);
                return price;
            }
        }
        // For 3year license type
        if (licenseType === '3year') {
            for (const sub of product.subscriptionDurations) {
                const duration = sub.duration.toLowerCase();
                if (duration.includes('3') && duration.includes('year')) {
                    const price = sub.priceINR || sub.price || 0;
                    console.log(`Found 3-year plan: ${sub.duration} = ₹${price}`);
                    return price;
                }
            }
        }
    }
    // Check admin subscription plans for 1year mapping
    if (product.subscriptions && product.subscriptions.length > 0 && licenseType === '1year') {
        console.log('Checking admin subscription plans...');
        const firstSub = product.subscriptions[0];
        const price = firstSub.priceINR || firstSub.price || 0;
        console.log(`Using first admin subscription: ${firstSub.duration} = ₹${price}`);
        return price;
    }
    // Check lifetime pricing
    if (licenseType === 'lifetime') {
        const lifetimePrice = product.lifetimePriceINR || product.priceLifetimeINR || product.priceLifetime || 0;
        console.log(`Lifetime price: ₹${lifetimePrice}`);
        return lifetimePrice;
    }
    // Fallback to legacy pricing structure
    console.log('Using legacy pricing structure...');
    let price = 0;
    switch (licenseType) {
        case '1year':
            price = product.price1INR || product.price1 || 0;
            break;
        case '3year':
            price = product.price3INR || product.price3 || 0;
            break;
        case 'lifetime':
            price = product.priceLifetimeINR || product.priceLifetime || 0;
            break;
        default:
            price = product.price1INR || product.price1 || 0;
    }
    console.log(`Legacy price for ${licenseType}: ₹${price}`);
    return price;
};
const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart_1.default.findOne({ user: userId })
            .populate('items.product', 'name description image company category version')
            .exec();
        if (!cart) {
            // Create empty cart if it doesn't exist
            const newCart = new Cart_1.default({ user: userId, items: [] });
            await newCart.save();
            res.json(newCart);
            return;
        }
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, licenseType, quantity = 1, subscriptionPlan } = req.body;
        // Validate input
        if (!productId || !licenseType) {
            res.status(400).json({ message: 'Product ID and license type are required' });
            return;
        }
        // Get product
        const product = await Product_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        const price = getPriceByLicenseType(product, licenseType, subscriptionPlan);
        console.log(`Final price for ${product.name} with ${licenseType}: ₹${price}`);
        if (price <= 0) {
            console.error(`Invalid price for product ${product.name} with license ${licenseType}. Price: ${price}`);
            console.error('Subscription plan details:', subscriptionPlan);
            res.status(400).json({
                message: 'Invalid price for selected license',
                details: {
                    productName: product.name,
                    licenseType,
                    calculatedPrice: price,
                    subscriptionPlan
                }
            });
            return;
        }
        const totalPrice = calculateItemTotal(price, quantity);
        // Find or create cart
        let cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new Cart_1.default({ user: userId, items: [] });
        }
        // Check if item already exists
        const existingItemIndex = cart.items.findIndex((item) => item.product.toString() === productId &&
            item.licenseType === licenseType);
        if (existingItemIndex >= 0) {
            // Update existing item
            const existingItem = cart.items[existingItemIndex];
            existingItem.quantity += quantity;
            existingItem.totalPrice = calculateItemTotal(price, existingItem.quantity);
        }
        else {
            // Add new item - explicitly cast product._id to Types.ObjectId
            const newItem = {
                product: product._id,
                licenseType,
                quantity,
                price,
                totalPrice,
                ...(subscriptionPlan && { subscriptionPlan })
            };
            cart.items.push(newItem);
        }
        await cart.save();
        await cart.populate('items.product', 'name description image company category version');
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { itemId } = req.params;
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            res.status(400).json({ message: 'Valid quantity is required' });
            return;
        }
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }
        // Find item by _id using find instead of .id() method
        const item = cart.items.find((item) => item._id?.toString() === itemId);
        if (!item) {
            res.status(404).json({ message: 'Item not found in cart' });
            return;
        }
        item.quantity = quantity;
        item.totalPrice = calculateItemTotal(item.price, quantity);
        await cart.save();
        await cart.populate('items.product', 'name description image company category version');
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateCartItem = updateCartItem;
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { itemId } = req.params;
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }
        // Filter out the item to remove instead of using .pull()
        cart.items = cart.items.filter((item) => item._id?.toString() !== itemId);
        await cart.save();
        await cart.populate('items.product', 'name description image company category version');
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }
        cart.items = [];
        await cart.save();
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.clearCart = clearCart;
