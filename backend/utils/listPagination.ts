/**
 * Admin list APIs: omit `limit` (or empty) to return all matches without skip/limit.
 * Pass positive `limit` (+ optional `page`) for optional server-side pagination.
 */
export type OptionalPaginationResult = {
  paginate: boolean;
  page: number;
  limit: number;
  skip: number;
};

function firstQueryString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value[0] !== undefined ? String(value[0]) : undefined;
  return String(value);
}

export function resolveOptionalPagination(query: {
  page?: unknown;
  limit?: unknown;
}): OptionalPaginationResult {
  const limitStr = firstQueryString(query.limit);
  if (limitStr === undefined || limitStr === "") {
    return { paginate: false, page: 1, limit: 0, skip: 0 };
  }

  const limit = parseInt(limitStr, 10);
  if (!Number.isFinite(limit) || limit < 1) {
    return { paginate: false, page: 1, limit: 0, skip: 0 };
  }

  const pageStr = firstQueryString(query.page);
  const page = Math.max(parseInt(pageStr ?? "1", 10) || 1, 1);
  return { paginate: true, page, limit, skip: (page - 1) * limit };
}
