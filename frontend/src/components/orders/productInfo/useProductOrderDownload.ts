import { useState } from "react";
import { toast } from "react-hot-toast";
import type { IOrder, IOrderItem } from "../../../api/types/orderTypes";
import {
  downloadSecureProductFile,
  getProductDownloadMetadata,
  getProductDownloadUrl,
} from "../../../api/downloadApi";

export function useProductOrderDownload(order: IOrder, product: IOrderItem) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileSizeBytes, setFileSizeBytes] = useState<number | null>(null);
  const [suggestedFileName, setSuggestedFileName] = useState<string | null>(
    null,
  );
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const legacyOrderDownloadAllowed =
    order.paymentStatus?.toLowerCase() === "paid" ||
    order.orderStatus?.toLowerCase() === "delivered";

  const canDownload = Boolean(
    product?.driveLink &&
      (typeof product?.canDownload === "boolean"
        ? product.canDownload
        : legacyOrderDownloadAllowed),
  );

  const downloadBlockedReason =
    product?.downloadBlockedReason ||
    (!legacyOrderDownloadAllowed
      ? "Download available after payment confirmation"
      : "Download is not available for this product right now.");

  const isFreeOfferEnded = Boolean(
    product?.isFreeProduct && product?.isFreeOfferActive === false,
  );

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
    const loadingToast = toast.loading("Preparing download...");
    let metadataFileName: string | null = null;

    try {
      const metadataResponse = await getProductDownloadMetadata(
        order._id!,
        product.productId,
      );
      if (metadataResponse.success && metadataResponse.data) {
        metadataFileName = metadataResponse.data.fileName || null;
        setSuggestedFileName(metadataResponse.data.fileName || null);
        setFileSizeBytes(metadataResponse.data.sizeBytes);
        setTotalBytes(metadataResponse.data.sizeBytes);
      }

      const response = await getProductDownloadUrl(order._id!, product.productId);

      if (response.success && response.data) {
        toast.loading("Downloading file...", { id: loadingToast });

        const { blob, fileName, totalBytes: streamedTotalBytes } =
          await downloadSecureProductFile(
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

        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download =
          fileName ||
          metadataFileName ||
          suggestedFileName ||
          response.data.fileName ||
          product.name ||
          "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);

        const finalSize = streamedTotalBytes ?? blob.size ?? fileSizeBytes;
        if (finalSize !== null) {
          setFileSizeBytes(finalSize);
          setTotalBytes(finalSize);
        }

        setDownloadProgress(100);
        setDownloadedBytes(blob.size);

        toast.success("Download completed successfully!", { id: loadingToast });
      } else {
        toast.error(response.message || "Failed to get download link", {
          id: loadingToast,
        });
      }
    } catch (error: unknown) {
      console.error("Download error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to download product";
      toast.error(message, { id: loadingToast });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    fileSizeBytes,
    downloadedBytes,
    totalBytes,
    downloadProgress,
    canDownload,
    downloadBlockedReason,
    isFreeOfferEnded,
    handleDownload,
  };
}
