# SEO Quick Reference Guide

## How to Modify SEO Content

### File Location
All SEO configurations are in: `frontend/src/utils/seo.ts`

---

## Common Modifications

### 1. **Change Homepage Title/Description**
```typescript
// In seo.ts, modify getHomeSEO():
export const getHomeSEO = (): SEOMetadata => {
  return {
    title: "Your New Title Here",
    description: "Your new description here",
    // ... rest of the code
  };
};
```

### 2. **Add New Product Category**
```typescript
// In seo.ts, add to CATEGORY_SEO_CONFIG:
"your-category": {
  name: "Display Name",
  keywords: "keyword1, keyword2, keyword3",
  description: "Short description for this category",
},
```

### 3. **Change Brand Keywords**
```typescript
// In seo.ts, modify BRAND_SEO_CONFIG:
autodesk: {
  brandName: "Autodesk",
  keywords: "your, custom, keywords",
  description: "your custom description",
},
```

---

## Testing Your Changes

### 1. **Local Testing**
```bash
cd frontend
npm run dev
```
Then open browser and:
1. Right-click → View Page Source
2. Search for `<title>` and `<meta` tags in `<head>`

### 2. **Check Specific Page**
- Homepage: `http://localhost:5173/`
- Product: `http://localhost:5173/product/autocad-2024`
- Category: `http://localhost:5173/category?brand=autodesk&category=autocad`

### 3. **Verify in Browser DevTools**
1. Open DevTools (F12)
2. Go to Elements tab
3. Expand `<head>` section
4. Look for `<title>` and `<meta>` tags

---

## SEO Checklist for New Products

When adding a new product, ensure:
- [ ] Product has a `category` field
- [ ] Product has a `company` field (brand)
- [ ] Product has a `shortDescription` or `description`
- [ ] Category exists in `CATEGORY_SEO_CONFIG` (if major brand)
- [ ] Product images have descriptive filenames

---

## Quick Wins

### Improve Product SEO:
1. Add detailed product descriptions (200+ words)
2. Include target keywords naturally
3. Add FAQs to product pages
4. Include customer reviews

### Site-Wide SEO:
1. Create XML sitemap
2. Submit to Google Search Console
3. Set up Google Analytics
4. Build quality backlinks

---

## Important Notes

⚠️ **Don't Over-Optimize**: Keep content natural and user-friendly  
⚠️ **Avoid Keyword Stuffing**: Use keywords naturally in context  
⚠️ **Mobile-First**: Ensure site works perfectly on mobile  
⚠️ **Page Speed**: Keep load times under 3 seconds  

✅ **Focus on Value**: Great content naturally ranks well  
✅ **Be Specific**: "Buy AutoCAD 2024 License" > "Software Store"  
✅ **Include CTAs**: "Buy Now", "Get Started", "Shop Today"  

---

## Need Help?

Refer to `SEO_IMPLEMENTATION_SUMMARY.md` for complete details.
