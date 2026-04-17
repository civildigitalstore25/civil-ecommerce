import { productApiClient } from "./productApiClient";

export const trackProductViewer = async (
  productId: string,
  viewerId: string,
): Promise<{ success: boolean; viewerCount: number }> => {
  const { data } = await productApiClient.post(
    `/${productId}/track-viewer`,
    { viewerId },
  );
  return data;
};

export const getProductViewerCount = async (
  productId: string,
): Promise<number> => {
  try {
    const { data } = await productApiClient.get(
      `/${productId}/viewer-count`,
    );
    return data.viewerCount || 0;
  } catch (error) {
    console.error("Error getting viewer count:", error);
    return 0;
  }
};

export const removeProductViewer = async (
  productId: string,
  viewerId: string,
): Promise<void> => {
  try {
    await productApiClient.post(`/${productId}/remove-viewer`, { viewerId });
  } catch (error) {
    console.error("Error removing viewer:", error);
  }
};

export const incrementProductViewCount = async (
  productId: string,
): Promise<{ success: boolean; viewCount: number }> => {
  const { data } = await productApiClient.post(
    `/${productId}/increment-view`,
  );
  return data;
};

export const getProductViewCountStatic = async (
  productId: string,
): Promise<number> => {
  try {
    const { data } = await productApiClient.get(`/${productId}/view-count`);
    return data.viewCount || 0;
  } catch (error) {
    console.error("Error getting view count:", error);
    return 0;
  }
};

export const getProductSoldQuantity = async (
  productId: string,
): Promise<number> => {
  try {
    const { data } = await productApiClient.get(
      `/${productId}/sold-quantity`,
    );
    return data.soldQuantity || 0;
  } catch (error) {
    console.error("Error getting sold quantity:", error);
    return 0;
  }
};
