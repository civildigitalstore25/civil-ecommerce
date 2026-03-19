import React, { useState } from "react";
import { Package, Download } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import type { IOrder } from "../../api/types/orderTypes";
import {
  downloadSecureProductFile,
  getProductDownloadMetadata,
  getProductDownloadUrl,
} from "../../api/downloadApi";
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
    const [fileSizeBytes, setFileSizeBytes] = useState<number | null>(null);
    const [downloadedBytes, setDownloadedBytes] = useState(0);
    const [totalBytes, setTotalBytes] = useState<number | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

    const formatFileSize = (bytes: number | null) => {
      if (bytes === null || Number.isNaN(bytes) || bytes < 0) return "Unknown";
      if (bytes === 0) return "0 B";

      const units = ["B", "KB", "MB", "GB", "TB"];
      const power = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1,
      );
      const value = bytes / Math.pow(1024, power);
      return `${value.toFixed(power === 0 ? 0 : 2)} ${units[power]}`;
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const handleDownload = async () => {
      if (!canDownload) {
        toast.error(downloadBlockedReason);
        return;
      }

      if (!product?.productId) {
        toast.error("Product information not found");
        return;
      }

      setIsDownloading(true);
      setDownloadedBytes(0);
      setDownloadProgress(0);
      setTotalBytes(null);
      const loadingToast = toast.loading('Preparing download...');

      try {
        const metadataResponse = await getProductDownloadMetadata(order._id!, product.productId);
        if (metadataResponse.success && metadataResponse.data) {
          setFileSizeBytes(metadataResponse.data.sizeBytes);
          setTotalBytes(metadataResponse.data.sizeBytes);
        }

        const response = await getProductDownloadUrl(order._id!, product.productId);

        if (response.success && response.data) {
          toast.loading('Downloading file...', { id: loadingToast });

          const { blob, fileName, totalBytes: streamedTotalBytes } = await downloadSecureProductFile(
            response.data.downloadUrl,
            (update) => {
              setDownloadedBytes(update.loaded);
              if (update.total !== null) {
                setTotalBytes(update.total);
                setFileSizeBytes(update.total);
              }
              setDownloadProgress(update.percent);
            },
          );

          // Create blob URL and trigger download
          const blobUrl = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName || response.data.fileName || product.name || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up blob URL
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);

          const finalSize = streamedTotalBytes ?? blob.size ?? fileSizeBytes;
          if (finalSize !== null) {
            setFileSizeBytes(finalSize);
            setTotalBytes(finalSize);
          }

          setDownloadProgress(100);
          setDownloadedBytes(blob.size);

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
    const legacyOrderDownloadAllowed =
      order.paymentStatus?.toLowerCase() === 'paid' ||
      order.orderStatus?.toLowerCase() === 'delivered';
    const canDownload = Boolean(product?.driveLink) &&
      (typeof product?.canDownload === 'boolean' ? product.canDownload : legacyOrderDownloadAllowed);
    const downloadBlockedReason =
      product?.downloadBlockedReason ||
      (!legacyOrderDownloadAllowed
        ? 'Download available after payment confirmation'
        : 'Download is not available for this product right now.');
    const isFreeOfferEnded = Boolean(product?.isFreeProduct && product?.isFreeOfferActive === false);

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

            {product?.driveLink && (
              <div
                className="text-xs sm:text-sm mt-1"
                style={{ color: colors.text.secondary }}
              >
                <span className="font-medium">File Size:</span>{" "}
                {fileSizeBytes !== null
                  ? formatFileSize(fileSizeBytes)
                  : isDownloading
                    ? "Fetching..."
                    : "Click download to fetch"}
              </div>
            )}

            {isDownloading && (
              <div className="mt-2">
                <div
                  className="text-xs sm:text-sm mb-1"
                  style={{ color: colors.text.secondary }}
                >
                  <span className="font-medium">Download Status:</span>{" "}
                  {downloadProgress !== null
                    ? `${Math.round(downloadProgress)}%`
                    : "In progress"}
                  {` (${formatFileSize(downloadedBytes)}`}
                  {totalBytes !== null ? ` / ${formatFileSize(totalBytes)})` : ")"}
                </div>
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: colors.background.tertiary }}
                >
                  <div
                    className="h-full transition-all duration-200"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(downloadProgress ?? 0, 100),
                      )}%`,
                      backgroundColor: colors.interactive.primary,
                    }}
                  />
                </div>
              </div>
            )}
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
                title={!canDownload ? downloadBlockedReason : 'Download product'}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>
                      {downloadProgress !== null
                        ? `DOWNLOADING ${Math.round(downloadProgress)}%`
                        : 'DOWNLOADING...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>
                      {canDownload
                        ? 'DOWNLOAD'
                        : isFreeOfferEnded
                          ? 'DOWNLOAD (Offer Ended)'
                          : 'DOWNLOAD (Unavailable)'}
                    </span>
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
