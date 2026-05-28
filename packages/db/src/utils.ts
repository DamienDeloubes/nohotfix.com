import { sql } from 'kysely';

/**
 * Wrap a JS value as a JSONB literal for Kysely inserts/updates.
 *
 * The `pg` driver does not auto-serialize objects for JSONB columns —
 * it would send `[object Object]` as the parameter value. This helper
 * `JSON.stringify()`s the value and casts it to `::jsonb`.
 */
export function jsonb(value: unknown): ReturnType<typeof sql<unknown>> {
  return value == null ? sql`null` : sql`${JSON.stringify(value)}::jsonb`;
}
