"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Script to view all orders and their orderNumbers
 */
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const viewOrders = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Ecommerce';
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        const db = mongoose_1.default.connection.db;
        const orders = await db.collection('orders').find({}).project({ orderId: 1, orderNumber: 1, userId: 1, createdAt: 1 }).sort({ createdAt: -1 }).toArray();
        console.log('\n📦 All Orders:');
        console.log('=====================================');
        orders.forEach((order, index) => {
            console.log(`${index + 1}. ID: ${order._id}`);
            console.log(`   orderId: ${order.orderId}`);
            console.log(`   orderNumber: ${order.orderNumber} (type: ${typeof order.orderNumber})`);
            console.log(`   userId: ${order.userId}`);
            console.log(`   createdAt: ${order.createdAt}`);
            console.log('-------------------------------------');
        });
        console.log(`\n✅ Total orders: ${orders.length}`);
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('❌ Error:', error);
        await mongoose_1.default.disconnect();
        process.exit(1);
    }
};
viewOrders();
