/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { apiV1Client } from '../api/client';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote, Code, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, ImagePlus } from 'lucide-react';

interface BlogEditorProps {
  value: string;
  onChange: (value: string) => void;
  onError?: (message: string) => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ value, onChange, onError }) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Tulis konten artikel di sini...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'min-h-[320px] prose prose-invert prose-headings:font-semibold prose-p:leading-relaxed focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentContent = editor.getHTML();
    if (value !== currentContent) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, value]);

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiV1Client.post('/images/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = response.data?.data?.url;
      if (!imageUrl) {
        throw new Error('Upload gagal: tidak menerima URL gambar.');
      }
      editor?.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal mengunggah gambar.';
      if (onError) onError(message);
    }
  };

  const handleImageButton = () => {
    imageInputRef.current?.click();
  };

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadImage(file);
    event.target.value = '';
  };

  const buildButton = (label: ReactNode, active: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors ${active ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-950 text-zinc-300 hover:bg-zinc-900'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {buildButton(
          <Bold className="w-4 h-4" />,
          editor?.isActive('bold') ?? false,
          () => editor?.chain().focus().toggleBold().run()
        )}
        {buildButton(
          <Italic className="w-4 h-4" />,
          editor?.isActive('italic') ?? false,
          () => editor?.chain().focus().toggleItalic().run()
        )}
        {buildButton(
          <UnderlineIcon className="w-4 h-4" />,
          editor?.isActive('underline') ?? false,
          () => editor?.chain().focus().toggleUnderline().run()
        )}
        {buildButton(
          <Strikethrough className="w-4 h-4" />,
          editor?.isActive('strike') ?? false,
          () => editor?.chain().focus().toggleStrike().run()
        )}
        {buildButton(
          <Heading1 className="w-4 h-4" />,
          editor?.isActive('heading', { level: 1 }) ?? false,
          () => editor?.chain().focus().toggleHeading({ level: 1 }).run()
        )}
        {buildButton(
          <Heading2 className="w-4 h-4" />,
          editor?.isActive('heading', { level: 2 }) ?? false,
          () => editor?.chain().focus().toggleHeading({ level: 2 }).run()
        )}
        {buildButton(
          <List className="w-4 h-4" />,
          editor?.isActive('bulletList') ?? false,
          () => editor?.chain().focus().toggleBulletList().run()
        )}
        {buildButton(
          <ListOrdered className="w-4 h-4" />,
          editor?.isActive('orderedList') ?? false,
          () => editor?.chain().focus().toggleOrderedList().run()
        )}
        {buildButton(
          <Quote className="w-4 h-4" />,
          editor?.isActive('blockquote') ?? false,
          () => editor?.chain().focus().toggleBlockquote().run()
        )}
        {buildButton(
          <Code className="w-4 h-4" />,
          editor?.isActive('codeBlock') ?? false,
          () => editor?.chain().focus().toggleCodeBlock().run()
        )}
        {buildButton(
          <AlignLeft className="w-4 h-4" />,
          editor?.isActive({ textAlign: 'left' }) ?? false,
          () => editor?.chain().focus().setTextAlign('left').run()
        )}
        {buildButton(
          <AlignCenter className="w-4 h-4" />,
          editor?.isActive({ textAlign: 'center' }) ?? false,
          () => editor?.chain().focus().setTextAlign('center').run()
        )}
        {buildButton(
          <AlignRight className="w-4 h-4" />,
          editor?.isActive({ textAlign: 'right' }) ?? false,
          () => editor?.chain().focus().setTextAlign('right').run()
        )}
        {buildButton(
          <LinkIcon className="w-4 h-4" />,
          editor?.isActive('link') ?? false,
          () => {
            const url = window.prompt('Masukkan URL tautan:');
            if (url) {
              editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }
          }
        )}
        {buildButton(
          <ImagePlus className="w-4 h-4" />,
          false,
          handleImageButton
        )}
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
        <EditorContent editor={editor} />
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />
    </div>
  );
};
