# Review Index Fix - Production Database Migration

## Problem

**Symptom**: Admin users cannot create multiple reviews for a single product in production, resulting in "Database error occurred" message.

**Root Cause**: The production MongoDB database has a **unique compound index** on `{ product: 1, user: 1 }` in the `reviews` collection. This prevents:
1. Multiple reviews from the same user on the same product
2. Multiple anonymous reviews on the same product (since anonymous reviews have `user: null`)

**Why it works locally**: The local database either never had the unique constraint OR the migration was already run.

**Why it fails in production**: The production database still has the old unique index.

## MongoDB Error Code
```
Error code: 11000 (Duplicate Key Error)
```

## Solution

### Step 1: Run the Migration Script on Production

The migration script will:
- Drop the old unique index on `{ product: 1, user: 1 }`
- Recreate it as a non-unique index
- Allow multiple reviews per user per product

#### Option A: Using npm script (Recommended)
```bash
# SSH into production server
cd /path/to/backend

# Ensure MONGODB_URI is set in .env
npm run script:drop-review-index
```

#### Option B: Direct execution
```bash
cd /path/to/backend
ts-node scripts/drop-review-unique-index.ts
```

#### Option C: Using MongoDB shell directly
If you have direct MongoDB access:
```javascript
// Connect to your production MongoDB
use your_database_name;

// List current indexes
db.reviews.getIndexes();

// Drop the unique index
db.reviews.dropIndex("product_1_user_1");

// The application will recreate it as non-unique on next restart
```

### Step 2: Verify the Fix

After running the migration:

1. **Check indexes**:
```javascript
db.reviews.getIndexes();
// Should show product_1_user_1 without unique: true
```

2. **Test in application**:
   - Login as admin
   - Navigate to any product
   - Create multiple anonymous reviews
   - Should work without errors

### Step 3: Restart the Application (if needed)

After migration, restart your Node.js application:
```bash
pm2 restart backend
# or
systemctl restart your-service
```

## Code Changes Made

### 1. Review Model (`models/Review.ts`)
```typescript
// OLD (ambiguous)
ReviewSchema.index({ product: 1, user: 1 });

// NEW (explicitly non-unique)
ReviewSchema.index({ product: 1, user: 1 }, { unique: false });
```

### 2. Review Controller (`controllers/reviewController.ts`)
Enhanced error handling to detect and report this specific issue:
```typescript
if (error.code === 11000) {
    console.error('MongoDB duplicate key error - unique index violation:', error);
    console.error('Please run: npm run script:drop-review-index on production');
    return res.status(500).json({
        message: 'Database constraint error. Please contact support.',
        hint: 'Database migration needed'
    });
}
```

### 3. Package.json
Added convenience script:
```json
"script:drop-review-index": "ts-node scripts/drop-review-unique-index.ts"
```

## Prevention for Future Deployments

1. **Always run migrations** when deploying schema changes
2. **Document index changes** in migration scripts
3. **Test with production-like data** before deploying
4. **Monitor MongoDB logs** for duplicate key errors (code 11000)

## Verification Commands

### Check if the issue still exists:
```bash
# Connect to MongoDB
mongosh "your-connection-string"

# Check for unique indexes
use your_database;
db.reviews.getIndexes().forEach(idx => {
  if (idx.unique) {
    print("Unique index found: " + idx.name);
    printjson(idx);
  }
});
```

### Expected output after fix:
```json
{
  "v": 2,
  "key": { "product": 1, "user": 1 },
  "name": "product_1_user_1"
  // Note: NO "unique: true" field
}
```

## Rollback (if needed)

If you need to restore the unique constraint:
```javascript
db.reviews.dropIndex("product_1_user_1");
db.reviews.createIndex({ product: 1, user: 1 }, { unique: true });
```

## Support

If the migration fails or you encounter issues:

1. Check MongoDB logs: `/var/log/mongodb/mongod.log`
2. Verify database connectivity
3. Ensure proper permissions for index operations
4. Contact the development team with error logs

## Status Checklist

- [ ] Migration script executed on production
- [ ] Indexes verified (no unique constraint)
- [ ] Application restarted
- [ ] Admin can create multiple anonymous reviews
- [ ] No error code 11000 in logs
- [ ] Production monitoring shows normal operation
