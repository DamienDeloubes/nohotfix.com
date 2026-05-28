/**
 * Versioned rich-text envelope utilities.
 *
 * Storage format: `{ version: 1, doc: <TipTap JSON> }`
 * Gracefully handles legacy unversioned TipTap docs (type: "doc") by treating
 * them as version 1.
 */

const CURRENT_VERSION = 1;

interface RichTextEnvelope {
  version: number;
  doc: unknown;
}

function isEnvelope(value: unknown): value is RichTextEnvelope {
  if (value == null || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.version === 'number' && 'doc' in obj;
}

/** Extract the TipTap document from a versioned envelope. */
export function unwrapRichText(value: unknown): unknown {
  if (value == null) return null;
  if (isEnvelope(value)) return value.doc;
  return value;
}

/** Wrap a TipTap document in the versioned envelope for storage. */
export function wrapRichText(doc: unknown): RichTextEnvelope | null {
  if (isEmptyRichText(doc)) return null;
  if (isEnvelope(doc)) return doc;
  return { version: CURRENT_VERSION, doc };
}

/** Check whether a rich-text value is empty (null, or an empty TipTap doc, or an envelope wrapping an empty doc). */
export function isEmptyRichText(value: unknown): boolean {
  if (value == null) return true;

  // Unwrap envelope first
  const doc = isEnvelope(value) ? value.doc : value;

  if (doc == null) return true;
  if (typeof doc !== 'object') return false;
  const obj = doc as Record<string, unknown>;
  if (obj.type !== 'doc') return false;
  const content = obj.content;
  if (!Array.isArray(content)) return true;
  return content.length === 0;
}
