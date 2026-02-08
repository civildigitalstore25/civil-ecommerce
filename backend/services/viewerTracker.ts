/**
 * Product Viewer Tracking Service
 * Tracks active viewers for each product in real-time
 */

interface ViewerInfo {
  viewerId: string;
  lastSeen: number;
  productId: string;
}

class ViewerTracker {
  // Map of productId -> Set of viewer information
  private viewers: Map<string, Map<string, ViewerInfo>>;
  private readonly VIEWER_TIMEOUT = 60000; // 60 seconds - consider viewer inactive after this
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.viewers = new Map();
    this.startCleanupInterval();
  }

  /**
   * Register or update a viewer for a product
   */
  trackViewer(productId: string, viewerId: string): void {
    if (!productId || !viewerId) {
      return;
    }

    if (!this.viewers.has(productId)) {
      this.viewers.set(productId, new Map());
    }

    const productViewers = this.viewers.get(productId)!;
    productViewers.set(viewerId, {
      viewerId,
      lastSeen: Date.now(),
      productId,
    });
  }

  /**
   * Get the current viewer count for a product
   */
  getViewerCount(productId: string): number {
    if (!productId) {
      return 0;
    }

    const productViewers = this.viewers.get(productId);
    if (!productViewers) {
      return 0;
    }

    // Clean up stale viewers for this product
    this.cleanupStaleViewers(productId);

    return productViewers.size;
  }

  /**
   * Remove a specific viewer from a product
   */
  removeViewer(productId: string, viewerId: string): void {
    if (!productId || !viewerId) {
      return;
    }

    const productViewers = this.viewers.get(productId);
    if (productViewers) {
      productViewers.delete(viewerId);
      
      // Clean up the product entry if no viewers left
      if (productViewers.size === 0) {
        this.viewers.delete(productId);
      }
    }
  }

  /**
   * Clean up stale viewers for a specific product
   */
  private cleanupStaleViewers(productId: string): void {
    const productViewers = this.viewers.get(productId);
    if (!productViewers) {
      return;
    }

    const now = Date.now();
    const staleViewers: string[] = [];

    productViewers.forEach((viewer, viewerId) => {
      if (now - viewer.lastSeen > this.VIEWER_TIMEOUT) {
        staleViewers.push(viewerId);
      }
    });

    staleViewers.forEach((viewerId) => {
      productViewers.delete(viewerId);
    });

    // Clean up the product entry if no viewers left
    if (productViewers.size === 0) {
      this.viewers.delete(productId);
    }
  }

  /**
   * Clean up all stale viewers across all products
   */
  private cleanupAllStaleViewers(): void {
    const productIds = Array.from(this.viewers.keys());
    productIds.forEach((productId) => {
      this.cleanupStaleViewers(productId);
    });
  }

  /**
   * Start automatic cleanup interval
   */
  private startCleanupInterval(): void {
    // Run cleanup every 30 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanupAllStaleViewers();
    }, 30000);
  }

  /**
   * Stop cleanup interval (useful for testing or shutdown)
   */
  stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Get statistics about all viewers (useful for debugging)
   */
  getStats(): { totalProducts: number; totalViewers: number } {
    let totalViewers = 0;
    this.viewers.forEach((productViewers) => {
      totalViewers += productViewers.size;
    });

    return {
      totalProducts: this.viewers.size,
      totalViewers,
    };
  }
}

// Export singleton instance
export const viewerTracker = new ViewerTracker();
export default viewerTracker;
