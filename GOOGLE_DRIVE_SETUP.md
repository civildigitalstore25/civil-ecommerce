# Google Drive Download Setup Guide

## ✅ What's Working Now

- Download button appears for paid/delivered orders
- Users can only download products they purchased
- Backend verifies order ownership
- File downloads directly (no Drive page popup)

---

## 🔒 Two Security Options

### **Option A: Public Links** (Current - Simple)

**How it works:**
- Upload file to Google Drive
- Share with "Anyone with the link"
- Add link to product in admin panel
- Users download directly from Google Drive

**Pros:**
- ✅ Super simple setup (5 minutes)
- ✅ Fast downloads (Google's servers)
- ✅ No bandwidth costs for you

**Cons:**
- ❌ Anyone with the link can download
- ❌ Users can share the link with others

**Use this if:** Your products aren't highly sensitive or you want quick setup

---

### **Option B: Restricted Access** (Secure - Requires API)

**How it works:**
- Files stay private in your Drive
- Your server uses Google Drive API to access them
- Server streams files directly to authenticated users
- Users never see the actual Drive link

**Pros:**
- ✅ Completely secure (users can't share links)
- ✅ You control all access
- ✅ Track every download
- ✅ Can revoke access anytime

**Cons:**
- ❌ More complex setup (30-45 minutes)
- ❌ Uses your server bandwidth
- ❌ Requires Google Cloud project

**Use this if:** You sell premium products and need maximum security

---

## 📋 Setup Instructions

### For Option A (Public Links) - CURRENT SETUP

#### **Step 1: Prepare Your File**
1. Upload product file to Google Drive
2. Right-click → "Share"
3. Change to "Anyone with the link"
4. Set permission to **"Viewer"** (not Editor)
5. Copy the link (looks like: `https://drive.google.com/file/d/1AbC...XyZ/view?usp=sharing`)

#### **Step 2: Add to Your Product**
1. Login to admin panel
2. Go to Products → Edit product (or Add new)
3. Find the "**Google Drive Link**" field (in Media section)
4. Paste the Drive link
5. Save product

#### **Step 3: Test**
1. Create a test order with this product
2. Mark order as "Delivered"
3. Go to "My Orders" page
4. You should see "Download" button
5. Click it → file downloads automatically

**That's it! You're done.** ✅

---

### For Option B (Restricted Access) - ADVANCED SETUP

#### **Step 1: Google Cloud Setup** (15 minutes)

1. **Create Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project: "CivilEcommerce-Downloads"

2. **Enable Drive API:**
   - Go to "APIs & Services" → "Library"
   - Search "Google Drive API"
   - Click "Enable"

3. **Create Service Account:**
   - "APIs & Services" → "Credentials"
   - "Create Credentials" → "Service Account"
   - Name: `download-service`
   - Role: "Service Account User"
   - Click "Done"

4. **Get Credentials:**
   - Click on your service account
   - "Keys" tab → "Add Key" → "Create New Key"
   - Choose **JSON**
   - Download the JSON file (save it safely!)

5. **Note the Service Account Email:**
   - It looks like: `download-service@your-project.iam.gserviceaccount.com`
   - You'll need this in the next step

#### **Step 2: Google Drive Setup** (5 minutes)

1. **Create Product Folder:**
   - In your Google Drive, create: "Ecommerce Products"
   - Do NOT make this public
   - Upload all your product files here

2. **Share with Service Account:**
   - Right-click the "Ecommerce Products" folder
   - Click "Share"
   - Add the service account email (from Step 1.5)
   - Set permission to "Viewer"
   - Click "Send" (no need to notify)

3. **Get Folder ID:**
   - Open the "Ecommerce Products" folder
   - Look at the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Copy the `FOLDER_ID_HERE` part

#### **Step 3: Backend Configuration** (10 minutes)

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install googleapis
   npm install @types/googleapis --save-dev
   ```

2. **Update Environment Variables:**
   
   Open `backend/.env` and add:
   ```env
   # Google Drive API (for restricted file access)
   GOOGLE_DRIVE_ENABLED=true
   GOOGLE_SERVICE_ACCOUNT_EMAIL=download-service@your-project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
   GOOGLE_DRIVE_FOLDER_ID=your_folder_id_from_step_2.3
   ```

   **To get the private key:**
   - Open the JSON file you downloaded in Step 1.4
   - Find the `"private_key"` field
   - Copy the entire value (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
   - Paste it in the `.env` file (keep the quotes)

3. **Create Drive Service:**
   
   Create `backend/services/driveService.ts`:
   ```typescript
   import { google } from 'googleapis';
   import { Readable } from 'stream';

   const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

   // Initialize Google Drive client
   const getDriveClient = () => {
     const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
     
     const auth = new google.auth.JWT({
       email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
       key: privateKey,
       scopes: SCOPES,
     });

     return google.drive({ version: 'v3', auth });
   };

   // Download file from Google Drive
   export const downloadFile = async (fileId: string): Promise<Readable> => {
     const drive = getDriveClient();
     
     const response = await drive.files.get(
       { fileId, alt: 'media' },
       { responseType: 'stream' }
     );

     return response.data as Readable;
   };

   // Get file metadata
   export const getFileMetadata = async (fileId: string) => {
     const drive = getDriveClient();
     
     const response = await drive.files.get({
       fileId,
       fields: 'id, name, mimeType, size'
     });

     return response.data;
   };

   export default { downloadFile, getFileMetadata };
   ```

4. **Update Download Routes:**
   
   In `backend/routes/downloadRoutes.ts`, add secure streaming endpoint:
   ```typescript
   import { downloadFile, getFileMetadata } from '../services/driveService';

   // Secure download route (streams through server)
   router.get('/:orderId/:productId/secure', authenticate, async (req: Request, res: Response) => {
     try {
       const { orderId, productId } = req.params;
       const userId = (req as any).user._id;

       // Verify order ownership
       const order = await Order.findOne({ _id: orderId, userId });
       if (!order) {
         return res.status(404).json({ success: false, message: 'Order not found' });
       }

       // Check product in order
       const orderItem = order.items.find(item => item.productId?.toString() === productId);
       if (!orderItem) {
         return res.status(404).json({ success: false, message: 'Product not in order' });
       }

       // Get product
       const product = await Product.findById(productId);
       if (!product?.driveLink) {
         return res.status(404).json({ success: false, message: 'Download not available' });
       }

       // Extract file ID
       const fileId = extractDriveFileId(product.driveLink);
       if (!fileId) {
         return res.status(400).json({ success: false, message: 'Invalid Drive link' });
       }

       // Get file metadata
       const metadata = await getFileMetadata(fileId);
       
       // Set response headers
       res.setHeader('Content-Type', metadata.mimeType || 'application/octet-stream');
       res.setHeader('Content-Disposition', `attachment; filename="${metadata.name}"`);
       if (metadata.size) {
         res.setHeader('Content-Length', metadata.size);
       }

       // Stream the file
       const fileStream = await downloadFile(fileId);
       fileStream.pipe(res);

       // Log download
       console.log(`User ${userId} downloaded ${product.name} (Order: ${orderId})`);

     } catch (error) {
       console.error('Secure download error:', error);
       res.status(500).json({ success: false, message: 'Download failed' });
     }
   });
   ```

5. **Update Frontend API:**
   
   In `frontend/src/api/downloadApi.ts`, change the endpoint:
   ```typescript
   export const getProductDownloadUrl = async (orderId: string, productId: string) => {
     const response = await api.get(`/download/${orderId}/${productId}/secure`);
     return response.data;
   };
   ```

6. **Restart Backend:**
   ```bash
   npm run dev
   ```

#### **Step 4: Using the Secure System**

When adding products:
1. Upload file to the "Ecommerce Products" folder in Drive
2. Get the file's Drive link
3. Add it to your product (the backend will extract the file ID)
4. File will now stream securely through your server

**Users will never see the actual Drive link!** 🔒

---

## 🧪 Testing Your Setup

### Test Public Links (Option A):
1. ✅ Upload file, get shareable link
2. ✅ Add link to product in admin
3. ✅ Purchase product (test order)
4. ✅ Go to My Orders
5. ✅ Click Download button
6. ✅ File downloads directly

### Test Secure Streaming (Option B):
1. ✅ Service account has access to Drive folder
2. ✅ Environment variables are set
3. ✅ Backend starts without errors
4. ✅ Purchase product
5. ✅ Download works from My Orders
6. ✅ Try sharing the download URL (should fail - requires auth)
7. ✅ Check backend logs for download activity

---

## 🎯 Recommendations

**For Most Users:** Start with **Option A (Public Links)**
- Fast to setup
- Easy to maintain
- Good enough for most products

**Upgrade to Option B if:**
- You sell high-value digital products (>$50)
- You notice unauthorized sharing
- You need download analytics
- Legal compliance requires access control

---

## 📞 Support

If something isn't working:
1. Check backend terminal for errors
2. Check browser console for errors
3. Verify Drive link format is correct
4. Ensure order status is "paid" or "delivered"
5. Clear browser cache and try again

---

## ✅ Current Status

**What's Working:**
- ✅ Download button appears on My Orders
- ✅ Only shows for paid/delivered orders
- ✅ Users can only download their own purchases
- ✅ Direct download (no Drive page popup)
- ✅ Backend verifies all permissions

**What You Need to Choose:**
- ⏳ Public links (Option A) - simple and fast
- ⏳ Secure streaming (Option B) - private and controlled

Pick based on your security needs!
