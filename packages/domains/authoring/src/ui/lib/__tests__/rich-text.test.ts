import { describe, expect, it } from 'vitest';

import { isEmptyRichText, unwrapRichText, wrapRichText } from '../rich-text.js';

const richDoc = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }] };
const emptyDoc = { type: 'doc', content: [] };

describe('wrapRichText', () => {
  it('wraps a non-empty TipTap doc in a versioned envelope', () => {
    expect(wrapRichText(richDoc)).toEqual({ version: 1, doc: richDoc });
  });

  it('returns null for null', () => {
    expect(wrapRichText(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(wrapRichText(undefined)).toBeNull();
  });

  it('returns null for an empty TipTap doc', () => {
    expect(wrapRichText(emptyDoc)).toBeNull();
  });

  it('is idempotent — returns an already-wrapped envelope as-is', () => {
    const envelope = { version: 1, doc: richDoc };
    expect(wrapRichText(envelope)).toEqual(envelope);
  });

  it('does not double-wrap a versioned envelope', () => {
    const envelope = { version: 1, doc: richDoc };
    const result = wrapRichText(envelope);
    // Must NOT produce { version: 1, doc: { version: 1, doc: richDoc } }
    expect(result).not.toEqual({ version: 1, doc: envelope });
  });
});

describe('unwrapRichText', () => {
  it('extracts the doc from a versioned envelope', () => {
    expect(unwrapRichText({ version: 1, doc: richDoc })).toEqual(richDoc);
  });

  it('returns null for null', () => {
    expect(unwrapRichText(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(unwrapRichText(undefined)).toBeNull();
  });

  it('handles a future version envelope', () => {
    const futureDoc = { type: 'doc', content: [{ type: 'heading' }] };
    expect(unwrapRichText({ version: 2, doc: futureDoc })).toEqual(futureDoc);
  });
});

describe('isEmptyRichText', () => {
  it('returns true for null', () => {
    expect(isEmptyRichText(null)).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(isEmptyRichText(undefined)).toBe(true);
  });

  it('returns true for an empty TipTap doc', () => {
    expect(isEmptyRichText(emptyDoc)).toBe(true);
  });

  it('returns true for a versioned envelope wrapping an empty doc', () => {
    expect(isEmptyRichText({ version: 1, doc: emptyDoc })).toBe(true);
  });

  it('returns false for a non-empty TipTap doc', () => {
    expect(isEmptyRichText(richDoc)).toBe(false);
  });

  it('returns false for a versioned envelope wrapping a non-empty doc', () => {
    expect(isEmptyRichText({ version: 1, doc: richDoc })).toBe(false);
  });
});
