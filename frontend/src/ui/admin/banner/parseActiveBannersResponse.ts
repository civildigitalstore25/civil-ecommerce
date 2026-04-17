import type { Banner } from "../../../types/Banner";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Normalize various API shapes for `/banners/active/:page`. */
export function parseActiveBannersResponse(result: unknown): Banner[] {
  if (Array.isArray(result)) {
    return result as Banner[];
  }
  if (!isRecord(result)) {
    return [];
  }
  if (result.success && result.data && Array.isArray(result.data)) {
    return result.data as Banner[];
  }
  if (result.data && Array.isArray(result.data)) {
    return result.data as Banner[];
  }
  return [];
}
