# Quick Start Guide - Download Feature

## 🚀 Immediate Steps

### 1. Navigate to Backend
```bash
cd backend
```

### 2. The backend already has axios installed, so no need to install it again. Just restart the server:
```bash
npm run dev
```

### 3. Navigate to Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

## 📝 Add Your First Downloadable Product

### Step 1: Upload to Google Drive
1. Go to https://drive.google.com
2. Upload your product file (e.g., `autocad_2025.zip`)
3. Right-click the file → Share
4. Change to "Anyone with the link" → Viewer
5. Copy the link (e.g., `https://drive.google.com/file/d/1ABC...XYZ/view`)

### Step 2: Add Product in Admin Panel
1. Login to admin panel
2. Go to Products → Add Product
3. Fill in product details
4. In the "Media" section, find **"Google Drive Download Link"** field
5. Paste your Google Drive link
6. Save the product

### Step 3: Test Download
1. Purchase the product (complete checkout)
2. Go to "My Orders" page
3. You'll see a **"DOWNLOAD"** button next to the product
4. Click it to download your file!

## 🎯 Where to Find Things

### Admin Panel - Add Drive Link:
```
Products Page
  ↓
Add/Edit Product
  ↓
Scroll to "Media" Section
  ↓
"Google Drive Download Link (Optional)" field
  ↓
Paste your link here
```

### User Side - Download Product:
```
My Orders Page
  ↓
Find your paid order
  ↓
See "DOWNLOAD" button
  ↓
Click to download
```

## ✅ Testing Checklist

- [ ] Backend server running
- [ ] Frontend server running  
- [ ] Product added with Drive link
- [ ] Test purchase completed
- [ ] Order shows in My Orders
- [ ] Download button visible
- [ ] Download works successfully

## 🔧 If Download Button Not Showing

Check these:
1. Is order payment status = "paid" or "delivered"?
2. Does the product have a driveLink in database?
3. Is the order recent (refresh the page)?

## 🔧 If Download Not Working

Check these:
1. Is Google Drive file set to "Anyone with the link"?
2. Open the Drive link directly in browser - does it work?
3. Check browser console for errors (F12)
4. Check backend logs for error messages

## 📱 Example Drive Link Formats (All Supported)

```
Format 1: https://drive.google.com/file/d/1ABC...XYZ/view?usp=sharing
Format 2: https://drive.google.com/open?id=1ABC...XYZ  
Format 3: https://drive.google.com/uc?id=1ABC...XYZ
```

## 🎉 You're All Set!

The download feature is now fully integrated. Users can:
- ✅ See download button only for paid orders
- ✅ Download products securely
- ✅ Get direct downloads from your Google Drive

For detailed documentation, see:
- `GOOGLE_DRIVE_SETUP.md` - Complete setup guide
- `DOWNLOAD_FEATURE_SUMMARY.md` - Technical implementation details

---

**Need Help?** Check the troubleshooting sections in GOOGLE_DRIVE_SETUP.md
