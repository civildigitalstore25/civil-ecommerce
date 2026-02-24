import mongoose from 'mongoose';
import Review from '../models/Review';
import dotenv from 'dotenv';

dotenv.config();

const dropUniqueIndex = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civil-ecommerce';
        
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        console.log('\nDropping old unique index on reviews collection...');
        
        // Get the collection
        const collection = mongoose.connection.collection('reviews');
        
        // List all existing indexes
        const indexes = await collection.indexes();
        console.log('\nExisting indexes:', JSON.stringify(indexes, null, 2));
        
        // Try to drop the unique compound index
        try {
            await collection.dropIndex('product_1_user_1');
            console.log('✅ Successfully dropped unique index: product_1_user_1');
        } catch (error: any) {
            if (error.code === 27) {
                console.log('ℹ️ Index product_1_user_1 does not exist (already dropped or never created)');
            } else {
                console.error('⚠️ Error dropping index:', error.message);
            }
        }
        
        // Recreate indexes from the model
        console.log('\nRecreating indexes from model...');
        await Review.createIndexes();
        console.log('✅ Indexes recreated successfully');
        
        // Show final indexes
        const finalIndexes = await collection.indexes();
        console.log('\nFinal indexes:', JSON.stringify(finalIndexes, null, 2));
        
        console.log('\n✅ Index migration completed successfully!');
        console.log('👥 Users can now post multiple reviews on the same product.');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
};

dropUniqueIndex();
