import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { unwrapRichText, wrapRichText } from '../lib/rich-text.js';

interface RichTextEditorProps {
  content: unknown;
  onChange: (json: unknown) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, disabled, placeholder }: RichTextEditorProps) {
  const doc = unwrapRichText(content);

  const editor = useEditor({
    extensions: [StarterKit],
    content: doc as Parameters<typeof useEditor>[0] extends { content?: infer C } ? C : never,
    editable: !disabled,
    onUpdate: ({ editor: e }) => {
      onChange(wrapRichText(e.getJSON()));
    },
  });

  return (
    <div
      style={{
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        minHeight: '100px',
        fontSize: '0.875rem',
      }}
    >
      {editor && !editor.getText() && placeholder && <div style={{ position: 'absolute', padding: '0.5rem 0.75rem', color: '#9ca3af', pointerEvents: 'none' }}>{placeholder}</div>}
      <EditorContent editor={editor} style={{ padding: '0.5rem 0.75rem' }} />
    </div>
  );
}
