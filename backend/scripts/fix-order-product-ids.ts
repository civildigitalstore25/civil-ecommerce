import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Ecommerce';

interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  driveLink?: string;
}

interface IOrderItem {
  productId: mongoose.Types.ObjectId | string;
  name: string;
  driveLink?: string;
  [key: string]: any;
}

interface IOrder {
  _id: mongoose.Types.ObjectId;
  orderId: string;
  items: IOrderItem[];
  [key: string]: any;
}

async function fixOrderProductIds() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Get all products with their current IDs and names
    const products = await db
      .collection('products')
      .find({})
      .toArray() as any[];

    console.log(`📦 Found ${products.length} products in database`);
    
    // Create a name -> product map
    const productsByName = new Map<string, any>();
    products.forEach(p => {
      productsByName.set(p.name.toLowerCase().trim(), p);
      console.log(`  - ${p.name}: ${p._id} ${p.driveLink ? '(has driveLink)' : '(no driveLink)'}`);
    });

    console.log('\n🔍 Fetching all orders...');
    const orders = await db
      .collection('orders')
      .find({})
      .toArray() as any[];

    console.log(`📦 Found ${orders.length} orders\n`);

    let updatedCount = 0;
    let itemsFixed = 0;

    for (const order of orders) {
      let orderNeedsUpdate = false;
      const updatedItems = order.items.map((item: any) => {
        const itemName = item.name.toLowerCase().trim();
        const currentProduct = productsByName.get(itemName);

        if (!currentProduct) {
          console.log(`⚠️  Order ${order.orderId} - Item "${item.name}" - No matching product found`);
          return item;
        }

        const oldProductId = item.productId.toString();
        const newProductId = currentProduct._id.toString();

        if (oldProductId !== newProductId) {
          console.log(`🔧 Order ${order.orderId} - Item "${item.name}":`);
          console.log(`   Old ID: ${oldProductId}`);
          console.log(`   New ID: ${newProductId}`);
          console.log(`   DriveLink: ${currentProduct.driveLink || 'none'}`);
          
          orderNeedsUpdate = true;
          itemsFixed++;

          return {
            ...item,
            productId: currentProduct._id,
            driveLink: currentProduct.driveLink || null
          };
        }

        // Even if ID is correct, update driveLink if missing
        if (!item.driveLink && currentProduct.driveLink) {
          console.log(`📎 Order ${order.orderId} - Adding driveLink to "${item.name}"`);
          orderNeedsUpdate = true;
          return {
            ...item,
            driveLink: currentProduct.driveLink
          };
        }

        return item;
      });

      if (orderNeedsUpdate) {
        await db
          .collection('orders')
          .updateOne(
            { _id: order._id },
            { $set: { items: updatedItems } }
          );
        
        updatedCount++;
        console.log(`✅ Updated order ${order.orderId}\n`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Orders checked: ${orders.length}`);
    console.log(`   Orders updated: ${updatedCount}`);
    console.log(`   Items fixed: ${itemsFixed}`);
    console.log('\n✅ Done!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the fix
fixOrderProductIds();
