import mongoose from 'mongoose';

type ProductBrandFields = {
  company?: string | null;
  brand?: string | null;
};

/**
 * Ebook storefront uses brand value "ebook" (see productFormConstants / company field).
 * Post-payment orders that are ebook-only go straight to `delivered` (shown as Success);
 * software and mixed carts stay `processing` until an admin marks delivered.
 */
export const productIsEbookBrand = (p: ProductBrandFields | null | undefined): boolean => {
  if (!p) return false;
  const c = (p.company || '').toLowerCase().trim();
  const b = (p.brand || '').toLowerCase().trim();
  return c === 'ebook' || b === 'ebook';
};

export const postPaymentOrderStatusForOrderItems = (
  items: { productId: string }[],
  productById: Map<string, ProductBrandFields>,
): 'delivered' | 'processing' => {
  if (!items.length) return 'processing';
  for (const item of items) {
    const pid = item.productId;
    if (!mongoose.Types.ObjectId.isValid(pid)) return 'processing';
    const p = productById.get(pid);
    if (!productIsEbookBrand(p)) return 'processing';
  }
  return 'delivered';
};
