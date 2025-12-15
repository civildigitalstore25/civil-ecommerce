# Admin Panel UI Reference

## Where to Add Google Drive Link

When adding or editing a product in the admin panel, you'll find the new field in the **Media** section:

```
┌─────────────────────────────────────────────────────────────┐
│ Media                                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Main Product Image *                                        │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ https://example.com/product-image.jpg                  │  │
│ └────────────────────────────────────────────────────────┘  │
│ Primary product image displayed in listings                 │
│                                                              │
│ Additional Images                                            │
│ [Multiple image URL fields...]                              │
│                                                              │
│ Product Demo Video URL (Optional)                           │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ https://youtube.com/watch?v=...                        │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ Activation Demo Video URL (Optional)                        │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ https://youtube.com/watch?v=...                        │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ ⭐ Google Drive Download Link (Optional)  ← NEW FIELD      │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ https://drive.google.com/file/d/...                    │  │
│ └────────────────────────────────────────────────────────┘  │
│ Google Drive shareable link for the downloadable product   │
│ file. Users will see a download button after purchase.     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## User's My Orders Page

After purchasing, users will see:

```
┌─────────────────────────────────────────────────────────────┐
│ My Orders                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Order #1234                                                  │
│ Status: Paid                                                 │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐   │
│ │  [Product Image]                                      │   │
│ │                                                       │   │
│ │  AutoCAD 2025                                         │   │
│ │  Quantity: 1                                          │   │
│ │  Price: ₹5,000                                        │   │
│ │                                                       │   │
│ │  ┌────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│ │  │ DOWNLOAD  │  │ BUY IT AGAIN │  │ VIEW DETAILS │ │   │
│ │  └────────────┘  └──────────────┘  └──────────────┘ │   │
│ │      ↑                                                │   │
│ │   NEW BUTTON!                                         │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Download Button Behavior

### When Button Appears:
✅ Order payment status is "paid" OR "delivered"
✅ Product has a Google Drive link

### When Button is Hidden:
❌ Order is pending or cancelled
❌ Product doesn't have a download link

### Button States:
- **Normal:** "DOWNLOAD" (blue/primary color)
- **Loading:** "DOWNLOADING..." (dimmed)
- **After Click:** Opens Google Drive download in new tab

## Google Drive File Requirements

Your Google Drive file MUST be:
1. ✅ Set to "Anyone with the link"
2. ✅ Permission: "Viewer"
3. ✅ File not deleted or moved

## Example Google Drive Setup

```
Google Drive:
  My Drive/
    └── Software Products/         ← Folder
        ├── autocad_2025.zip      ← Your product file
        ├── revit_2024.zip
        └── photoshop_2023.zip

Steps:
1. Right-click file → Share
2. Change "Restricted" to "Anyone with the link"
3. Set permission to "Viewer"
4. Copy link
5. Paste in admin panel
```

## Supported Link Formats

All these formats work:

```
✅ https://drive.google.com/file/d/1ABC...XYZ/view?usp=sharing
✅ https://drive.google.com/file/d/1ABC...XYZ/view
✅ https://drive.google.com/open?id=1ABC...XYZ
✅ https://drive.google.com/uc?id=1ABC...XYZ
```

## Common Mistakes to Avoid

❌ Using Google Drive folder link (use file link only)
❌ Keeping file as "Restricted" (must be public)
❌ Setting permission to "Editor" (use "Viewer")
❌ Deleting the file after adding link to product
❌ Using Google Docs/Sheets links (use file links)

## Testing Your Setup

### Test Checklist:
1. [ ] Add product with Drive link in admin panel
2. [ ] Create test order and mark as paid
3. [ ] Check My Orders page
4. [ ] Verify Download button appears
5. [ ] Click Download button
6. [ ] Confirm file downloads successfully

### If Something Goes Wrong:

**Button not showing?**
- Check order payment status in admin
- Verify product has driveLink in database
- Refresh the My Orders page

**Download fails?**
- Test the Drive link directly in browser
- Check file sharing settings
- Look for errors in browser console (F12)
- Check backend logs

---

That's it! The feature is fully integrated and ready to use. 🎉
