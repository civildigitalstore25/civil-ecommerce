import express, { Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import Product from '../models/Product';
import Order from '../models/Order';
import axios from 'axios';
import { downloadFile, getFileMetadata, isDriveConfigured } from '../services/driveService';

const router = express.Router();

// Helper function to extract Google Drive file ID from various URL formats
const extractDriveFileId = (url: string): string | null => {
  try {
    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) return match1[1];

    // Format 2: https://drive.google.com/open?id=FILE_ID
    const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2) return match2[1];

    // Format 3: https://drive.google.com/uc?id=FILE_ID
    const match3 = url.match(/uc\?id=([a-zA-Z0-9_-]+)/);
    if (match3) return match3[1];

    return null;
  } catch (error) {
    console.error('Error extracting Drive file ID:', error);
    return null;
  }
};

// Get download URL for a purchased product
router.get('/:orderId/:productId', authenticate, async (req: Request, res: Response) => {
  try {
    const { orderId, productId } = req.params;
    const userId = (req as any).user._id;

    // Verify the order belongs to the user
    const order = await Order.findOne({
      _id: orderId,
      userId: userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or you do not have permission to access this order'
      });
    }

    // Check if the order contains the requested product
    const orderItem = order.items.find(
      item => item.productId?.toString() === productId
    );

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in this order'
      });
    }

    // Get the product details to retrieve the drive link
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.driveLink) {
      return res.status(404).json({
        success: false,
        message: 'Download link not available for this product'
      });
    }

    // Extract the file ID from the Drive URL
    const fileId = extractDriveFileId(product.driveLink);

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google Drive link format'
      });
    }

    // Generate the direct download URL
    // For public files: https://drive.google.com/uc?export=download&id=FILE_ID
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    // Log the download activity
    console.log(`User ${userId} downloading product ${productId} from order ${orderId}`);

    // Return the download information
    res.json({
      success: true,
      data: {
        downloadUrl,
        productName: product.name,
        productVersion: product.version,
        fileName: `${product.name}_${product.version}.zip`, // Suggested filename
        message: 'Download link generated successfully'
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating download link',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Alternative: Stream the file through our server (more secure but bandwidth intensive)
router.get('/:orderId/:productId/stream', authenticate, async (req: Request, res: Response) => {
  try {
    const { orderId, productId } = req.params;
    const userId = (req as any).user._id;

    // Verify the order belongs to the user
    const order = await Order.findOne({
      _id: orderId,
      userId: userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or you do not have permission to access this order'
      });
    }

    // Check if the order contains the requested product
    const orderItem = order.items.find(
      item => item.productId?.toString() === productId
    );

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in this order'
      });
    }

    // Get the product details
    const product = await Product.findById(productId);

    if (!product || !product.driveLink) {
      return res.status(404).json({
        success: false,
        message: 'Download link not available'
      });
    }

    // Extract the file ID
    const fileId = extractDriveFileId(product.driveLink);

    if (!fileId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google Drive link format'
      });
    }

    // Stream the file from Google Drive
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    try {
      const response = await axios({
        method: 'GET',
        url: downloadUrl,
        responseType: 'stream'
      });

      // Set appropriate headers
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${product.name}_${product.version}.zip"`);

      // Pipe the stream to response
      response.data.pipe(res);

    } catch (streamError) {
      console.error('Stream error:', streamError);
      return res.status(500).json({
        success: false,
        message: 'Error streaming file from Google Drive'
      });
    }

  } catch (error) {
    console.error('Stream download error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing download request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Secure download route - streams through server using Google Drive API
// Users never see the actual Drive link, files can be private in Drive
router.get('/:orderId/:productId/secure', authenticate, async (req: Request, res: Response) => {
  try {
    const { orderId, productId } = req.params;
    const userId = (req as any).user._id;

    console.log(`🔐 Secure download requested: Order ${orderId}, Product ${productId}, User ${userId}`);

    // Check if Google Drive API is configured
    if (!isDriveConfigured()) {
      console.error('❌ Google Drive API not configured');
      return res.status(503).json({
        success: false,
        message: 'Secure download is not configured. Please contact support.'
      });
    }

    // Verify the order belongs to the user
    const order = await Order.findOne({
      _id: orderId,
      userId: userId
    });

    if (!order) {
      console.log(`❌ Order not found or unauthorized: ${orderId}`);
      return res.status(404).json({
        success: false,
        message: 'Order not found or you do not have permission to access this order'
      });
    }

    // Check if order is paid or delivered
    const canDownload = order.paymentStatus === 'paid' || order.orderStatus === 'delivered';
    if (!canDownload) {
      console.log(`❌ Order not paid/delivered: ${orderId}`);
      return res.status(403).json({
        success: false,
        message: 'This order must be paid or delivered before downloading'
      });
    }

    // Check if the order contains the requested product
    const orderItem = order.items.find(
      item => item.productId?.toString() === productId
    );

    if (!orderItem) {
      console.log(`❌ Product not in order: ${productId}`);
      return res.status(404).json({
        success: false,
        message: 'Product not found in this order'
      });
    }

    // Get the product details
    const product = await Product.findById(productId);

    if (!product || !product.driveLink) {
      console.log(`❌ Product or driveLink not found: ${productId}`);
      return res.status(404).json({
        success: false,
        message: 'Download link not available for this product'
      });
    }

    // Extract the file ID
    const fileId = extractDriveFileId(product.driveLink);

    if (!fileId) {
      console.log(`❌ Invalid Drive link format: ${product.driveLink}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid Google Drive link format'
      });
    }

    console.log(`✅ Fetching file metadata for: ${fileId}`);
    
    // Get file metadata from Google Drive
    const metadata = await getFileMetadata(fileId);
    
    // Set response headers for download
    const fileName = metadata.name || metadata.originalFilename || `${product.name}.zip`;
    res.setHeader('Content-Type', metadata.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    if (metadata.size) {
      res.setHeader('Content-Length', metadata.size);
    }

    console.log(`📦 Streaming file: ${fileName} (${metadata.size || 'unknown'} bytes)`);

    // Stream the file from Google Drive through our server
    const fileStream = await downloadFile(fileId);
    
    // Pipe the stream to response
    fileStream.on('error', (error) => {
      console.error('❌ Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error streaming file'
        });
      }
    });

    fileStream.on('end', () => {
      console.log(`✅ Download completed: ${fileName} for user ${userId}`);
    });

    fileStream.pipe(res);

  } catch (error: any) {
    console.error('❌ Secure download error:', error);
    
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message || 'Error processing secure download request',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

export default router;