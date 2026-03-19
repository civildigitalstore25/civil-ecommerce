type DownloadProductLike = {
  driveLink?: string | null;
  isFreeProduct?: boolean | null;
  freeProductStartDate?: Date | string | null;
  freeProductEndDate?: Date | string | null;
};

type DownloadEligibilityParams = {
  orderPaymentStatus?: string | null;
  orderStatus?: string | null;
  orderItemPrice?: number | null;
  product?: DownloadProductLike | null;
  now?: Date;
};

export type DownloadEligibilityResult = {
  canDownload: boolean;
  reason?: string;
  isFreeProduct: boolean;
  isFreeOfferActive: boolean;
};

const toDate = (value?: Date | string | null): Date | null => {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isOrderEligibleForDownload = (paymentStatus?: string | null, orderStatus?: string | null): boolean => {
  return paymentStatus === 'paid' || orderStatus === 'delivered';
};

export const getDownloadEligibility = ({
  orderPaymentStatus,
  orderStatus,
  orderItemPrice,
  product,
  now = new Date(),
}: DownloadEligibilityParams): DownloadEligibilityResult => {
  const isFreeProduct = Boolean(product?.isFreeProduct);
  const freeStart = toDate(product?.freeProductStartDate);
  const freeEnd = toDate(product?.freeProductEndDate);
  const isFreeOfferActive = Boolean(
    isFreeProduct &&
      freeStart &&
      freeEnd &&
      now >= freeStart &&
      now <= freeEnd,
  );

  if (!isOrderEligibleForDownload(orderPaymentStatus, orderStatus)) {
    return {
      canDownload: false,
      reason: 'This order must be paid or delivered before downloading',
      isFreeProduct,
      isFreeOfferActive,
    };
  }

  if (!product?.driveLink) {
    return {
      canDownload: false,
      reason: 'Download link not available for this product',
      isFreeProduct,
      isFreeOfferActive,
    };
  }

  const isFreeOrderItem = Number(orderItemPrice || 0) <= 0;
  if (isFreeOrderItem && isFreeProduct && !isFreeOfferActive) {
    return {
      canDownload: false,
      reason: 'Free offer has ended for this product. Download is no longer available for this free order.',
      isFreeProduct,
      isFreeOfferActive,
    };
  }

  return {
    canDownload: true,
    isFreeProduct,
    isFreeOfferActive,
  };
};
