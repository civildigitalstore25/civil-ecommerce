/**
 * Viewer Utilities
 * Generate and manage viewer IDs for product tracking
 */

const VIEWER_ID_KEY = 'product_viewer_id';

/**
 * Generate a random viewer ID
 */
const generateViewerId = (): string => {
  return `viewer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get or create a viewer ID
 * The ID persists in sessionStorage for the duration of the browser session
 */
export const getViewerId = (): string => {
  // Check if we already have a viewer ID in session storage
  let viewerId = sessionStorage.getItem(VIEWER_ID_KEY);
  
  if (!viewerId) {
    // Generate a new viewer ID
    viewerId = generateViewerId();
    sessionStorage.setItem(VIEWER_ID_KEY, viewerId);
  }
  
  return viewerId;
};

/**
 * Clear the viewer ID (useful for testing)
 */
export const clearViewerId = (): void => {
  sessionStorage.removeItem(VIEWER_ID_KEY);
};

export default {
  getViewerId,
  clearViewerId,
};
