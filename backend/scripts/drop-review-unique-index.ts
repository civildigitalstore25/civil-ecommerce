import mongoose from 'mongoose';
import Review from '../models/Review';
import dotenv from 'dotenv';

dotenv.config();

const dropUniqueIndex = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civil-ecommerce';
        
        console.log('🔧 Review Index Migration Script');
        console.log('=================================');
        console.log('This script removes the unique constraint on { product, user } index');
        console.log('to allow multiple reviews per user per product.\n');
        
        console.log('Connecting to MongoDB...');
        console.log('URI:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB\n');

        // Get the collection
        const collection = mongoose.connection.collection('reviews');
        
        // List all existing indexes
        console.log('📋 Existing indexes:');
        const indexes = await collection.indexes();
        indexes.forEach((index: any) => {
            console.log(`  - ${index.name}:`, JSON.stringify(index.key), index.unique ? '(UNIQUE)' : '(non-unique)');
        });
        console.log('');
        
        // Try to drop the unique compound index
        console.log('🗑️  Attempting to drop product_1_user_1 index...');
        try {
            await collection.dropIndex('product_1_user_1');
            console.log('✅ Successfully dropped index: product_1_user_1\n');
        } catch (error: any) {
            if (error.code === 27) {
                console.log('ℹ️  Index product_1_user_1 does not exist (already dropped or never created)\n');
            } else {
                console.error('⚠️  Error dropping index:', error.message);
                console.error('   This might be okay if the index was already removed.\n');
            }
        }
        
        // Recreate indexes from the model (non-unique)
        console.log('🔄 Recreating indexes from model (non-unique)...');
        await Review.syncIndexes(); // This drops indexes not in schema and creates new ones
        console.log('✅ Indexes synchronized successfully\n');
        
        // Show final indexes
        console.log('📋 Final indexes:');
        const finalIndexes = await collection.indexes();
        finalIndexes.forEach((index: any) => {
            console.log(`  - ${index.name}:`, JSON.stringify(index.key), index.unique ? '(UNIQUE)' : '(non-unique)');
        });
        console.log('');
        
        console.log('✅ Migration completed successfully!');
        console.log('👥 Users can now post multiple reviews on the same product.');
        console.log('👤 Admins can create multiple anonymous reviews.');
        
    } catch (error: any) {
        console.error('❌ Migration Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
};

dropUniqueIndex();
