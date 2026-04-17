import React from "react";
import type { RichTextEditorProps } from "./richTextEditorTypes";
import { useRichTextEditor } from "./useRichTextEditor";
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
  const {
    editorRef,
    characterCount,
    handleInput,
    formatText,
    insertLink,
    insertImage,
  } = useRichTextEditor(value, onChange);

  return (
    <div
      className={`border border-gray-300 rounded-lg overflow-hidden flex flex-col ${className}`}
    >
      <RichTextEditorToolbar
        onFormat={formatText}
        onInsertLink={insertLink}
        onInsertImage={insertImage}
      />

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rich-text-editor flex-1 min-h-0"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          lineHeight: "1.6",
          minHeight: editorMinHeight || "150px",
          ...(editorMaxHeight
            ? { maxHeight: editorMaxHeight, overflowY: "auto" }
            : {}),
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex-shrink-0">
        <div>
          Supports <strong>bold</strong>, <em>italic</em>, <u>underline</u> •
          bullets, 1. numbers, [links](url), ![images](url)
        </div>
        <div>{characterCount} characters</div>
      </div>

      <style>{RICH_TEXT_EDITOR_SCOPED_CSS}</style>
    </div>
  );
};

export default RichTextEditor;

export type { RichTextEditorProps } from "./richTextEditorTypes";
