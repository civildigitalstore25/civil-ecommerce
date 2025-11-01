/**
 * Script to fix existing orders with null orderNumber
 * Run this script once to update all existing orders
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order';

dotenv.config();

const fixOrderNumbers = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Ecommerce';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Find all orders with null orderNumber
        const ordersWithNullOrderNumber = await Order.find({ orderNumber: null }).sort({ createdAt: 1 });
        console.log(`Found ${ordersWithNullOrderNumber.length} orders with null orderNumber`);

        if (ordersWithNullOrderNumber.length === 0) {
            console.log('✅ No orders need fixing');
            await mongoose.disconnect();
            return;
        }

        // Get the highest existing orderNumber
        const lastOrder = await Order.findOne({ orderNumber: { $exists: true, $ne: null } })
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
                const exists = await Order.findOne({ orderNumber: nextOrderNumber, _id: { $ne: order._id } });
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
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error fixing order numbers:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

fixOrderNumbers();
