/**
 * Transform a string to kebab-case.
 *
 * - Lowercases
 * - Replaces spaces and underscores with hyphens
 * - Strips non-alphanumeric characters (except hyphens)
 * - Collapses consecutive hyphens
 * - Trims leading/trailing hyphens
 */
export function toKebabCase(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}
