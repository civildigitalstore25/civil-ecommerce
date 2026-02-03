import React, { useState } from "react";
import { Package, Download } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import type { IOrder } from "../../api/types/orderTypes";
import { getProductDownloadUrl } from "../../api/downloadApi";
import { toast } from "react-hot-toast";

interface ProductInfoProps {
  order: IOrder;
  onBuyAgain: () => void;
  onViewDetails: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = React.memo(
  ({ order }) => {
    const { colors, theme } = useAdminTheme();
    const { formatPriceWithSymbol } = useCurrency();
    const product = order.items[0];
    const [isDownloading, setIsDownloading] = useState(false);

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const handleDownload = async () => {
      if (!product?.productId) {
        toast.error("Product information not found");
        return;
      }

      setIsDownloading(true);
      const loadingToast = toast.loading('Preparing download...');

      try {
        const response = await getProductDownloadUrl(order._id!, product.productId);

        if (response.success && response.data) {
          // Get auth token
          const token = localStorage.getItem('token');

          if (!token) {
            throw new Error('Please login to download');
          }

          toast.loading('Downloading file...', { id: loadingToast });

          // Fetch with authorization header
          const downloadResponse = await fetch(response.data.downloadUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
          });

          if (!downloadResponse.ok) {
            if (downloadResponse.status === 401) {
              throw new Error('Session expired. Please login again.');
            } else if (downloadResponse.status === 403) {
              throw new Error('Order must be paid before downloading.');
            } else {
              throw new Error('Download failed. Please try again.');
            }
          }

          // Create blob URL and trigger download
          const blob = await downloadResponse.blob();
          const blobUrl = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = product.name || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up blob URL
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);

          toast.success('Download completed successfully!', { id: loadingToast });
        } else {
          toast.error(response.message || 'Failed to get download link', { id: loadingToast });
        }
      } catch (error: any) {
        console.error('Download error:', error);
        toast.error(error.message || 'Failed to download product', { id: loadingToast });
      } finally {
        setIsDownloading(false);
      }
    };

    // Check if the product has a download link and order is paid/delivered
    const canDownload = product?.driveLink &&
      (order.paymentStatus?.toLowerCase() === 'paid' ||
        order.orderStatus?.toLowerCase() === 'delivered');

    // Debug logging
    console.log('ProductInfo Debug:', {
      productName: product?.name,
      hasDriveLink: !!product?.driveLink,
      driveLink: product?.driveLink,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      canDownload
    });

    return (
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Product Image */}
        <div className="relative flex justify-center sm:justify-start flex-shrink-0 w-full sm:w-auto">
          <div
            className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              backgroundColor: theme === 'dark' ? colors.background.tertiary : '#f3f4f6',
              border: `1.5px solid ${colors.border.primary}`
            }}
          >
            {product?.image &&
              product.image !== "null" &&
              product.image.trim() !== "" ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package
                className="w-8 h-8"
                style={{ color: theme === 'dark' ? '#fff' : colors.interactive.primary, opacity: 0.85 }}
              />
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0 w-full">
          <h3
            className="font-bold text-base sm:text-lg mb-2"
            style={{ color: colors.text.primary }}
          >
            {product?.name || "Product"}
          </h3>

          {/* Product Details */}
          <div className="mb-4">
            <div
              className="text-xs sm:text-sm mb-1"
              style={{ color: colors.text.secondary }}
            >
              <span className="font-medium">Quantity:</span>{" "}
              {product?.quantity ?? 1}
            </div>
            <div
              className="text-xs sm:text-sm mb-1"
              style={{ color: colors.text.secondary }}
            >
              <span className="font-medium">Unit Price:</span>{" "}
              {formatPriceWithSymbol(product?.price || 0)}
            </div>
            <div
              className="text-xs sm:text-sm mb-1"
              style={{ color: colors.text.secondary }}
            >
              <span className="font-medium">Payment Status:</span>{" "}
              {order.paymentStatus}
            </div>
            <div
              className="text-xs sm:text-sm"
              style={{ color: colors.text.secondary }}
            >
              <span className="font-medium">Order Date:</span>{" "}
              {formatDate(order.createdAt)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Download Button - Always show if product has driveLink */}
            {product?.driveLink && (
              <button
                onClick={handleDownload}
                disabled={isDownloading || !canDownload}
                className="px-4 py-2 rounded text-xs sm:text-sm font-semibold border transition-colors duration-200 w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.background.secondary,
                  color: colors.text.primary,
                  borderColor: colors.border.primary,
                }}
                title={!canDownload ? 'Download available after payment confirmation' : 'Download product'}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>DOWNLOADING...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{canDownload ? 'DOWNLOAD' : 'DOWNLOAD (Pending Payment)'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },
);

ProductInfo.displayName = "ProductInfo";

export default ProductInfo;
