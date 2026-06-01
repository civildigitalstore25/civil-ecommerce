import type { IProduct } from "../models/Product";
import BackInStockAlert from "../models/BackInStockAlert";
import emailService from "./emailService";

function productPageUrl(product: { slug?: string; name: string }): string {
  const base = process.env.FRONTEND_URL || "https://softzcart.com";
  if (product.slug?.trim()) {
    return `${base.replace(/\/+$/, "")}/product/${product.slug.trim()}`;
  }
  return `${base.replace(/\/+$/, "")}/products`;
}

/** Email subscribers when a product is marked in stock again (fire-and-forget). */
export async function notifyBackInStockSubscribers(
  product: Pick<IProduct, "_id" | "name" | "slug">,
): Promise<void> {
  const productId = product._id;
  if (!productId) return;

  const alerts = await BackInStockAlert.find({
    product: productId,
    notified: false,
  });

  if (alerts.length === 0) return;

  const url = productPageUrl(product);

  for (const alert of alerts) {
    try {
      await emailService.sendBackInStockAvailableEmail({
        to: alert.email,
        name: alert.name,
        productName: alert.productName || product.name,
        productUrl: url,
      });
      alert.notified = true;
      await alert.save();
    } catch (error) {
      console.error(
        `Failed back-in-stock notify for ${alert.email}:`,
        error,
      );
    }
  }

  console.log(
    `✅ Back-in-stock: notified ${alerts.length} subscriber(s) for ${product.name}`,
  );
}
