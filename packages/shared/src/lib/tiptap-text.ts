/**
 * Extract the total plain-text character count from a TipTap JSON document.
 *
 * Walks the document tree recursively, concatenating `.text` properties from
 * text nodes. Handles versioned envelopes (`{ version, doc }`) and raw
 * TipTap documents. Returns 0 for null/undefined input.
 */
export function extractPlainTextLength(doc: unknown): number {
  if (doc == null) return 0;
  if (typeof doc !== 'object') return 0;

  const obj = doc as Record<string, unknown>;

  // Handle versioned envelope: { version: number, doc: <tiptap-json> }
  if (typeof obj.version === 'number' && 'doc' in obj) {
    return extractPlainTextLength(obj.doc);
  }

  // Text node — accumulate its text length
  if (typeof obj.text === 'string') {
    return obj.text.length;
  }

  // Recurse into content array
  if (Array.isArray(obj.content)) {
    let total = 0;
    for (const child of obj.content) {
      total += extractPlainTextLength(child);
    }
    return total;
  }

  return 0;
}
