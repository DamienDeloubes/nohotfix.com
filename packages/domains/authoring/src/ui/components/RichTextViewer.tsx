import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { unwrapRichText } from '../lib/rich-text.js';

interface RichTextViewerProps {
  content: unknown;
}

export function RichTextViewer({ content }: RichTextViewerProps) {
  const doc = unwrapRichText(content);

  const editor = useEditor({
    extensions: [StarterKit],
    content: doc as Parameters<typeof useEditor>[0] extends { content?: infer C } ? C : never,
    editable: false,
  });

  if (!editor) return null;

  return (
    <div style={{ fontSize: '0.875rem' }}>
      <EditorContent editor={editor} />
    </div>
  );
}
