import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import Strike from '@tiptap/extension-strike';
import CodeBlock from '@tiptap/extension-code-block';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';

import './tiptap.css';

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // disable default if you want custom history
      }),
      Heading.configure({ levels: [1, 2] }),
      Blockquote,
      Strike,
      CodeBlock,
      HorizontalRule,
      HardBreak.configure({ keepMarks: false }),
      History, // custom undo/redo
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'active' : ''}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'active' : ''}>
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'active' : ''}>
          Strike
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'active' : ''}>
          Code
        </button><button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'active' : ''}
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'active' : ''}
        >
          1. List
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ―
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          ⏎
        </button>
        <button onClick={() => editor.chain().focus().undo().run()}>
          ⎌ Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          ⎌ Redo
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          Clear
        </button>
      </div>

      <EditorContent editor={editor} className="editor" />
    </div>
  );
}
