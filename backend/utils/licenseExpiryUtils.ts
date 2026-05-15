/**
 * Utility functions for handling license expiry calculations
 */

/**
 * License type definitions
 */
export type LicenseType = '1year' | '3year' | '5minute' | 'lifetime';

/**
 * Calculate the expiry date based on purchase date and license type
 * @param purchaseDate - Date of purchase
 * @param licenseType - Type of license (1year, 3year, 5minute, lifetime)
 * @returns Expiry date for the license, or null for lifetime licenses
 */
export function calculateExpiryDate(
  purchaseDate: Date,
  licenseType: LicenseType
): Date | null {
  if (licenseType === 'lifetime') {
    return null;
  }

  const expiryDate = new Date(purchaseDate);

  if (licenseType === '1year') {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else if (licenseType === '3year') {
    expiryDate.setFullYear(expiryDate.getFullYear() + 3);
  } else if (licenseType === '5minute') {
    expiryDate.setMinutes(expiryDate.getMinutes() + 5);
  }

  return expiryDate;
}

/**
 * Check if a license has expired
 * @param expiryDate - License expiry date
 * @returns true if license has expired, false otherwise
 */
export function isLicenseExpired(expiryDate: Date | null): boolean {
  if (!expiryDate) return false; // Lifetime licenses never expire
  return new Date() > expiryDate;
}

/**
 * Get number of days until expiry (negative if already expired)
 * @param expiryDate - License expiry date
 * @returns Number of days until expiry (negative if expired)
 */
export function getDaysUntilExpiry(expiryDate: Date | null): number {
  if (!expiryDate) return Infinity; // Lifetime licenses never expire

  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get days since expiry (0 if not expired)
 * @param expiryDate - License expiry date
 * @returns Number of days since expiry (0 if not expired)
 */
export function getDaysSinceExpiry(expiryDate: Date | null): number {
  if (!expiryDate) return 0; // Lifetime licenses never expire

  const now = new Date();
  if (now <= expiryDate) return 0;

  const diffTime = now.getTime() - expiryDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Infer license type from pricing plan string
 * Looks for patterns like "5 minute", "1year", "1-year", "3year", "3-year", "lifetime"
 * @param pricingPlan - Pricing plan string
 * @returns Inferred license type or null if cannot determine
 */
export function inferLicenseType(pricingPlan: string | undefined): LicenseType | null {
  if (!pricingPlan) return null;

  const planLower = pricingPlan.toLowerCase();

  if (planLower.includes('lifetime')) {
    return 'lifetime';
  }
  if (planLower.includes('5') && planLower.includes('minute')) {
    return '5minute';
  }
  if (planLower.includes('3') && (planLower.includes('year') || planLower.includes('yr'))) {
    return '3year';
  }
  if (planLower.includes('1') && (planLower.includes('year') || planLower.includes('yr'))) {
    return '1year';
  }

  return null;
}

/**
 * Format date to display string
 * @param date - Date to format
 * @returns Formatted date string (e.g., "15 May 2027")
 */
export function formatDateDisplay(date: Date | null): string {
  if (!date) return 'Never';

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}
