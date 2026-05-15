/**
 * WhatsApp utilities for generating WhatsApp Web links with pre-filled messages
 */

/**
 * Generate a WhatsApp Web link with pre-filled message
 * @param phoneNumber - Phone number with country code (e.g., +919876543210)
 * @param message - Message to pre-fill
 * @returns WhatsApp Web URL
 */
export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  // Remove any non-digit characters except +
  const cleanedPhone = phoneNumber.replace(/[^\d+]/g, "");

  // Ensure phone has country code
  let formattedPhone = cleanedPhone;
  if (!formattedPhone.startsWith("+")) {
    if (formattedPhone.startsWith("91")) {
      formattedPhone = "+" + formattedPhone;
    } else if (formattedPhone.startsWith("0")) {
      // Indian number without country code
      formattedPhone = "+91" + formattedPhone.substring(1);
    } else {
      formattedPhone = "+91" + formattedPhone;
    }
  }

  // URL encode the message
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

/**
 * Generate license expiry message
 * @param productName - Name of the product
 * @param expiryDate - Expiry date (ISO string or Date object)
 * @returns Pre-formatted message
 */
export function generateLicenseExpiryMessage(
  productName: string,
  expiryDate: string | Date
): string {
  const date =
    expiryDate instanceof Date ? expiryDate : new Date(expiryDate);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  return `Your license for ${productName} expired on ${formattedDate}. Please renew to regain access.`;
}

/**
 * Open WhatsApp Web in a new window
 * @param phoneNumber - Phone number with country code
 * @param message - Message to send
 */
export function openWhatsApp(phoneNumber: string, message: string): void {
  const url = generateWhatsAppLink(phoneNumber, message);
  window.open(url, "_blank", "width=800,height=600");
}

/**
 * Open WhatsApp Web for license expiry notification
 * @param phoneNumber - Phone number with country code
 * @param productName - Name of the product
 * @param expiryDate - Expiry date (ISO string or Date object)
 */
export function openWhatsAppForExpiry(
  phoneNumber: string,
  productName: string,
  expiryDate: string | Date
): void {
  const message = generateLicenseExpiryMessage(productName, expiryDate);
  openWhatsApp(phoneNumber, message);
}
