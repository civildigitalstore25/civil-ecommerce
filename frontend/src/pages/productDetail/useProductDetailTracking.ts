import { useState, useEffect } from "react";
import {
  incrementProductViewCount,
  getProductViewCountStatic,
  getProductSoldQuantity,
} from "../../api/productApi";

export function useProductDetailTracking(productId: string | undefined) {
  const [totalViews, setTotalViews] = useState<number>(0);
  const [soldQuantity, setSoldQuantity] = useState<number>(0);

  useEffect(() => {
    if (!productId) return;

    const sessionKey = `viewed_product_${productId}`;
    const hasViewedInSession = sessionStorage.getItem(sessionKey);

    const fetchSoldQuantity = async () => {
      try {
        const quantity = await getProductSoldQuantity(productId);
        setSoldQuantity(quantity);
      } catch (error) {
        console.error("Error fetching sold quantity:", error);
      }
    };

    const trackView = async () => {
      try {
        const result = await incrementProductViewCount(productId);
        setTotalViews(result.viewCount);
        sessionStorage.setItem(sessionKey, "true");
      } catch (error) {
        console.error("Error tracking product view:", error);
      }
    };

    if (!hasViewedInSession) {
      trackView();
    } else {
      const fetchViewCount = async () => {
        try {
          const count = await getProductViewCountStatic(productId);
          setTotalViews(count);
        } catch (error) {
          console.error("Error fetching view count:", error);
        }
      };
      fetchViewCount();
    }

    fetchSoldQuantity();
  }, [productId]);

  return { totalViews, soldQuantity };
}
