/**
 * Script to fix existing orders with invalid orderNumber and missing orderId
 * This fixes orders with null, undefined, or string-type orderNumber values
 * Also generates orderId for orders that are missing it
 * Run this script once to update all existing orders with proper numeric orderNumber and orderId
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order';

dotenv.config();

/**
 * Generate unique order ID
 */
const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
};

const fixOrderNumbers = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Ecommerce';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Find all orders to check for invalid orderNumbers or missing orderId
        const allOrders = await Order.find({}).sort({ createdAt: 1 }).lean();
        console.log(`📦 Found ${allOrders.length} total orders`);

        // Find orders with invalid orderNumber (null, undefined, or string type)
        const invalidOrders = allOrders.filter((order: any) => 
            order.orderNumber === null || 
            order.orderNumber === undefined || 
            typeof order.orderNumber === 'string'
        );
        
        // Find orders missing orderId
        const missingOrderId = allOrders.filter((order: any) => 
            !order.orderId || order.orderId === null || order.orderId === undefined
        );
        
        console.log(`⚠️  Found ${invalidOrders.length} orders with invalid orderNumber`);
        if (invalidOrders.length > 0) {
            invalidOrders.forEach((order: any) => {
                console.log(`  - Order ${order.orderId || order._id}: orderNumber = ${order.orderNumber} (type: ${typeof order.orderNumber})`);
            });
        }

        console.log(`⚠️  Found ${missingOrderId.length} orders missing orderId`);
        if (missingOrderId.length > 0) {
            missingOrderId.forEach((order: any) => {
                console.log(`  - Order _id ${order._id}: orderId = ${order.orderId}`);
            });
        }

        if (invalidOrders.length === 0 && missingOrderId.length === 0) {
            console.log('✅ No orders need fixing');
            await mongoose.disconnect();
            return;
        }

        // Get the highest valid orderNumber (only numeric values)
        const validOrders = allOrders.filter((order: any) => 
            typeof order.orderNumber === 'number' && 
            !isNaN(order.orderNumber)
        );
        
        let nextOrderNumber = validOrders.length > 0 
            ? Math.max(...validOrders.map((o: any) => o.orderNumber)) + 1 
            : 1001;
        
        console.log(`🔢 Starting from order number: ${nextOrderNumber}`);

        // Fix missing orderId first
        if (missingOrderId.length > 0) {
            console.log('\n🔧 Fixing missing orderId values...');
            for (const order of missingOrderId) {
                const newOrderId = generateOrderId();
                await Order.updateOne(
                    { _id: order._id },
                    { $set: { orderId: newOrderId } }
                );
                console.log(`✅ Updated order ${order._id} with orderId: ${newOrderId}`);
            }
        }

        // Update each invalid orderNumber
        if (invalidOrders.length > 0) {
            console.log('\n🔧 Fixing invalid orderNumber values...');
            for (const invalidOrder of invalidOrders) {
                // Make sure this orderNumber doesn't exist
                let attempts = 0;
                while (attempts < 100) {
                    const exists = await Order.findOne({ orderNumber: nextOrderNumber, _id: { $ne: invalidOrder._id } });
                    if (!exists) {
                        break;
                    }
                    nextOrderNumber++;
                    attempts++;
                }

                // First unset the field, then set it with proper type
                await Order.updateOne(
                    { _id: invalidOrder._id },
                    { $unset: { orderNumber: "" } }
                );

                await Order.updateOne(
                    { _id: invalidOrder._id },
                    { $set: { orderNumber: nextOrderNumber } }
                );

                console.log(`✅ Updated order ${invalidOrder.orderId || invalidOrder._id} with orderNumber: ${nextOrderNumber}`);
                nextOrderNumber++;
            }
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
