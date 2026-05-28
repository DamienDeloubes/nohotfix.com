export interface PaginationParams {
  limit: number;
  offset: number;
  cursor?: string;
}

export function parsePaginationParams(query: Record<string, unknown>): PaginationParams {
  const limit = Math.min(Number(query['limit'] ?? 20), 100);
  const offset = Number(query['offset'] ?? 0);
  const rawCursor = query['cursor'];
  const base = {
    limit: isNaN(limit) ? 20 : limit,
    offset: isNaN(offset) ? 0 : offset,
  };
  return typeof rawCursor === 'string' ? { ...base, cursor: rawCursor } : base;
}
