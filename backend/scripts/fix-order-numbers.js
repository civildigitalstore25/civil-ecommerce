"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Script to fix existing orders with null orderNumber
 * Run this script once to update all existing orders
 */
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Order_1 = __importDefault(require("../models/Order"));
dotenv_1.default.config();
const fixOrderNumbers = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Ecommerce';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        // Find all orders with null orderNumber
        const ordersWithNullOrderNumber = await Order_1.default.find({ orderNumber: null }).sort({ createdAt: 1 });
        console.log(`Found ${ordersWithNullOrderNumber.length} orders with null orderNumber`);
        if (ordersWithNullOrderNumber.length === 0) {
            console.log('✅ No orders need fixing');
            await mongoose_1.default.disconnect();
            return;
        }
        // Get the highest existing orderNumber
        const lastOrder = await Order_1.default.findOne({ orderNumber: { $exists: true, $ne: null } })
            .sort({ orderNumber: -1 })
            .select('orderNumber')
            .lean();
        let nextOrderNumber = lastOrder && lastOrder.orderNumber ? lastOrder.orderNumber + 1 : 1001;
        console.log(`Starting from order number: ${nextOrderNumber}`);
        // Update each order
        for (const order of ordersWithNullOrderNumber) {
            // Make sure this orderNumber doesn't exist
            let attempts = 0;
            while (attempts < 100) {
                const exists = await Order_1.default.findOne({ orderNumber: nextOrderNumber, _id: { $ne: order._id } });
                if (!exists) {
                    break;
                }
                nextOrderNumber++;
                attempts++;
            }
            order.orderNumber = nextOrderNumber;
            await order.save();
            console.log(`✅ Updated order ${order.orderId} with orderNumber: ${nextOrderNumber}`);
            nextOrderNumber++;
        }
        console.log('✅ All orders updated successfully');
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('❌ Error fixing order numbers:', error);
        await mongoose_1.default.disconnect();
        process.exit(1);
    }
};
fixOrderNumbers();
