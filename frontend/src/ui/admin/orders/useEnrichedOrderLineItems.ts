import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { productApiClient } from "../../../api/products/productApiClient";

const MONGO_OBJECT_ID = /^[a-f0-9]{24}$/i;

function itemNeedsProductVersionFetch(item: unknown): item is { productId: string } {
  if (!item || typeof item !== "object") return false;
  const rec = item as Record<string, unknown>;
  const id = rec.productId;
  if (typeof id !== "string" || !MONGO_OBJECT_ID.test(id)) return false;
  const v = rec.version;
  if (typeof v === "string" && v.trim().length > 0) return false;
  return true;
}

/**
 * Fetches product `version` when the order line omitted it so admin order
 * details can show the catalog version.
 */
export function useEnrichedOrderLineItems(items: unknown[]): unknown[] {
  const productIds = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) {
      if (itemNeedsProductVersionFetch(it)) set.add((it as { productId: string }).productId);
    }
    return [...set];
  }, [items]);

  const queries = useQueries({
    queries: productIds.map((id) => ({
      queryKey: ["product", id] as const,
      queryFn: async () => {
        const { data } = await productApiClient.get(`/${id}`);
        return { id, product: data as { version?: string } };
      },
      staleTime: 5 * 60 * 1000,
    })),
  });

  return useMemo(() => {
    const versionByProductId = new Map<string, string>();
    productIds.forEach((id, i) => {
      const q = queries[i];
      const v =
        q?.status === "success" && q.data?.product?.version
          ? String(q.data.product.version).trim()
          : "";
      if (id && v) versionByProductId.set(id, v);
    });

    return items.map((item) => {
      if (!item || typeof item !== "object") return item;
      const rec = { ...(item as Record<string, unknown>) };
      const pid = rec.productId;
      if (typeof pid === "string" && MONGO_OBJECT_ID.test(pid)) {
        const fetched = versionByProductId.get(pid);
        if (fetched && !(typeof rec.version === "string" && rec.version.trim())) {
          rec.version = fetched;
        }
      }
      return rec;
    });
  }, [items, productIds, queries]);
}
