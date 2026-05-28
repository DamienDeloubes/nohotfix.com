import { describe, expect, it } from 'vitest';

import { extractPlainTextLength } from '../tiptap-text.js';

describe('extractPlainTextLength', () => {
  it('returns 0 for null', () => {
    expect(extractPlainTextLength(null)).toBe(0);
  });

  it('returns 0 for undefined', () => {
    expect(extractPlainTextLength(undefined)).toBe(0);
  });

  it('returns 0 for non-object input', () => {
    expect(extractPlainTextLength('hello')).toBe(0);
    expect(extractPlainTextLength(42)).toBe(0);
    expect(extractPlainTextLength(true)).toBe(0);
  });

  it('returns 0 for empty doc', () => {
    expect(extractPlainTextLength({ type: 'doc', content: [] })).toBe(0);
  });

  it('counts text from a simple text node', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world' }],
        },
      ],
    };
    expect(extractPlainTextLength(doc)).toBe(11);
  });

  it('counts text from nested nodes with formatting', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hello ' },
            { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' world' },
          ],
        },
      ],
    };
    expect(extractPlainTextLength(doc)).toBe(16);
  });

  it('counts text across multiple paragraphs', () => {
    const doc = {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'First' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Second' }] },
      ],
    };
    expect(extractPlainTextLength(doc)).toBe(11);
  });

  it('returns 0 for document with no text nodes', () => {
    const doc = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [] }, { type: 'horizontal_rule' }],
    };
    expect(extractPlainTextLength(doc)).toBe(0);
  });

  it('handles versioned envelope', () => {
    const envelope = {
      version: 1,
      doc: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Wrapped' }] }],
      },
    };
    expect(extractPlainTextLength(envelope)).toBe(7);
  });

  it('handles versioned envelope with null doc', () => {
    const envelope = { version: 1, doc: null };
    expect(extractPlainTextLength(envelope)).toBe(0);
  });
});
