# Should We Delete CategoryListing.tsx?

## Analysis

### Current Usage
- **HomeProducts.tsx** uses `<CategoryListing limit={6} showCount={false} />`
- Displays 6 featured products on homepage
- Currently fetches by `?category=` query param (but homepage has NO category param!)

### Problem Found! 🚨

Looking at the code:
```tsx
// CategoryListing.tsx
const category = params.get("category") || "";
const { data } = useProducts({ category });
```

**On the homepage, there's NO `?category=` in the URL!**

This means `category = ""`, so it's fetching **ALL products** and showing the first 6.

### Options

## Option 1: Delete CategoryListing.tsx ❌ NOT RECOMMENDED
- BrandCategoryListing can't replace it (no props support)
- Would need to create a new component anyway

## Option 2: Convert to Proper FeaturedProducts Component ✅ RECOMMENDED
- Rename to `FeaturedProducts.tsx`
- Fetch latest/featured products specifically
- Remove category dependency
- Keep the `limit` prop

## Option 3: Keep As-Is ⚠️ WORKS BUT CONFUSING
- Keep CategoryListing.tsx
- It works (fetches all products, shows 6)
- Name is misleading (not really about categories)

---

## Recommendation: CREATE A NEW FeaturedProducts.tsx

Replace CategoryListing with a proper FeaturedProducts component that:
1. Fetches latest or best-selling products (not by category)
2. Has a clear, descriptive name
3. Accepts `limit` prop
4. Is specifically designed for homepage use

Then delete CategoryListing.tsx.

Would you like me to:
1. ✅ Create FeaturedProducts.tsx and replace CategoryListing
2. ❌ Keep CategoryListing as-is
3. ❌ Try to make BrandCategoryListing work (not ideal)
