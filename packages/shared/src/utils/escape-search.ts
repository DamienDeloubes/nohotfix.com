/**
 * Escapes SQL LIKE wildcards (`%`, `_`) and backslashes in a user-supplied
 * search string so it can be safely interpolated into a LIKE / ILIKE pattern.
 */
export function escapeSearch(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}
