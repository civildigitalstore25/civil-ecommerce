import React, { useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline as UnderlineExt } from "@tiptap/extension-underline";
import { Link as LinkExt } from "@tiptap/extension-link";
import { Image as ImageExt } from "@tiptap/extension-image";
import { TextAlign as TextAlignExt } from "@tiptap/extension-text-align";
import { Placeholder as PlaceholderExt } from "@tiptap/extension-placeholder";
import { Color as ColorExt } from "@tiptap/extension-color";
import { TextStyle as TextStyleExt } from "@tiptap/extension-text-style";
import type { RichTextEditorProps } from "./richTextEditorTypes";
import { RichTextEditorToolbar } from "./RichTextEditorToolbar";
import { RICH_TEXT_EDITOR_SCOPED_CSS } from "./richTextEditorScopedCss";

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  className = "",
  editorMinHeight,
  editorMaxHeight,
}) => {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      UnderlineExt,
      LinkExt.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
      ImageExt.configure({
        inline: false,
        allowBase64: true,
      }),
      TextAlignExt.configure({
        types: ["heading", "paragraph"],
      }),
      PlaceholderExt.configure({
        placeholder,
      }),
      ColorExt,
      TextStyleExt,
    ],
    [placeholder],
  );

  const editor = useEditor({
    extensions,
    content: value || "",
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML();
      // TipTap returns "<p></p>" for empty content – normalize to ""
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Sync external value → editor (e.g. when the form resets or loads new data)
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    const normalizedCurrent = currentHtml === "<p></p>" ? "" : currentHtml;
    const normalizedValue = value || "";
    if (normalizedCurrent !== normalizedValue) {
      editor.commands.setContent(normalizedValue, { emitUpdate: false });
    }
  }, [value, editor]);

  // Character count
  const characterCount = editor?.storage.characterCount?.characters?.() 
    ?? editor?.getText().length 
    ?? 0;

  return (
    <div
      className={`tiptap-editor border border-gray-300 rounded-lg overflow-hidden flex flex-col ${className}`}
    >
      <RichTextEditorToolbar editor={editor} />

      <div
        className="flex-1 min-h-0"
        style={{
          minHeight: editorMinHeight || "150px",
          ...(editorMaxHeight
            ? { maxHeight: editorMaxHeight, overflowY: "auto" as const }
            : {}),
        }}
      >
        <EditorContent
          editor={editor}
          className="p-4 h-full focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-inset"
        />
      </div>

      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex-shrink-0">
        <div>
          Supports <strong>headings</strong>, <strong>bold</strong>,{" "}
          <em>italic</em>, <u>underline</u> • bullets, numbers, alignment,
          colors, [links](url), ![images](url)
        </div>
        <div>{characterCount} characters</div>
      </div>

      <style>{RICH_TEXT_EDITOR_SCOPED_CSS}</style>
    </div>
  );
};

export default RichTextEditor;

export type { RichTextEditorProps } from "./richTextEditorTypes";
