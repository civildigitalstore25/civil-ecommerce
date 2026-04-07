import { Package, Download } from "lucide-react";
import type { IOrder, IOrderItem } from "../../../api/types/orderTypes";
import type { ThemeColors, ThemeMode } from "../../../contexts/AdminThemeContext";
import {
  formatProductInfoFileSize,
  formatProductInfoOrderDate,
} from "./productInfoFormat";

interface DownloadSlice {
  isDownloading: boolean;
  fileSizeBytes: number | null;
  downloadedBytes: number;
  totalBytes: number | null;
  downloadProgress: number | null;
  canDownload: boolean;
  downloadBlockedReason: string;
  isFreeOfferEnded: boolean;
  handleDownload: () => void;
}

interface ProductInfoPanelProps {
  order: IOrder;
  product: IOrderItem;
  colors: ThemeColors;
  theme: ThemeMode;
  formatPriceWithSymbol: (price: number) => string;
  download: DownloadSlice;
}

export function ProductInfoPanel({
  order,
  product,
  colors,
  theme,
  formatPriceWithSymbol,
  download,
}: ProductInfoPanelProps) {
  const {
    isDownloading,
    fileSizeBytes,
    downloadedBytes,
    totalBytes,
    downloadProgress,
    canDownload,
    downloadBlockedReason,
    isFreeOfferEnded,
    handleDownload,
  } = download;

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4">
      <div className="relative flex justify-center sm:justify-start flex-shrink-0 w-full sm:w-auto">
        <div
          className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center"
          style={{
            backgroundColor:
              theme === "dark" ? colors.background.tertiary : "#f3f4f6",
            border: `1.5px solid ${colors.border.primary}`,
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
              style={{
                color:
                  theme === "dark" ? "#fff" : colors.interactive.primary,
                opacity: 0.85,
              }}
            />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 w-full">
        <h3
          className="font-bold text-base sm:text-lg mb-2"
          style={{ color: colors.text.primary }}
        >
          {product?.name || "Product"}
        </h3>

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
            {formatProductInfoOrderDate(order.createdAt)}
          </div>

          {product?.driveLink && (
            <div
              className="text-xs sm:text-sm mt-1"
              style={{ color: colors.text.secondary }}
            >
              <span className="font-medium">File Size:</span>{" "}
              {fileSizeBytes !== null
                ? formatProductInfoFileSize(fileSizeBytes)
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
                {` (${formatProductInfoFileSize(downloadedBytes)}`}
                {totalBytes !== null
                  ? ` / ${formatProductInfoFileSize(totalBytes)})`
                  : ")"}
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

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {product?.driveLink && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || !canDownload}
              className="px-4 py-2 rounded text-xs sm:text-sm font-semibold border transition-colors duration-200 w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
              title={!canDownload ? downloadBlockedReason : "Download product"}
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  <span>
                    {downloadProgress !== null
                      ? `DOWNLOADING ${Math.round(downloadProgress)}%`
                      : "DOWNLOADING..."}
                  </span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    {canDownload
                      ? "DOWNLOAD"
                      : isFreeOfferEnded
                        ? "DOWNLOAD (Offer Ended)"
                        : "DOWNLOAD (Unavailable)"}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
