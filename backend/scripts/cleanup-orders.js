"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Script to clean up orders collection
 * Fixes orderNumber field issues
 */
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cleanupOrders = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Ecommerce';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        const db = mongoose_1.default.connection.db;
        const ordersCollection = db.collection('orders');
        // Get all orders sorted by creation date
        const allOrders = await ordersCollection.find({}).sort({ createdAt: 1 }).toArray();
        console.log(`\n📦 Found ${allOrders.length} total orders`);
        let fixed = 0;
        let nextNumber = 1001;
        // First pass: collect all valid orderNumbers and mark invalid ones
        const validNumbers = new Set();
        const ordersToFix = [];
        for (const order of allOrders) {
            if (typeof order.orderNumber === 'number' && !isNaN(order.orderNumber)) {
                validNumbers.add(order.orderNumber);
                console.log(`✅ Order ${order._id} (${order.orderId || 'N/A'}) has valid orderNumber: ${order.orderNumber}`);
            }
            else {
                ordersToFix.push(order);
                console.log(`⚠️  Order ${order._id} (${order.orderId || 'N/A'}) needs fixing: orderNumber = ${order.orderNumber} (${typeof order.orderNumber})`);
            }
        }
        // Second pass: assign new numbers to orders that need fixing
        console.log(`\n🔧 Fixing ${ordersToFix.length} orders...`);
        for (const order of ordersToFix) {
            // Find next available number
            while (validNumbers.has(nextNumber)) {
                nextNumber++;
            }
            console.log(`\n   Updating order ${order._id} (${order.orderId || 'N/A'})`);
            console.log(`   → Setting orderNumber to: ${nextNumber}`);
            await ordersCollection.updateOne({ _id: order._id }, { $set: { orderNumber: nextNumber } });
            validNumbers.add(nextNumber);
            nextNumber++;
            fixed++;
        }
        console.log(`\n✅ Cleanup complete!`);
        console.log(`   Fixed: ${fixed} orders`);
        console.log(`   Next orderNumber will be: ${nextNumber}`);
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('❌ Error:', error);
        await mongoose_1.default.disconnect();
        process.exit(1);
    }
};
cleanupOrders();
