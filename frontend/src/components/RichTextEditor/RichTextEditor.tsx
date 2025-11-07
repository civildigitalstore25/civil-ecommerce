import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text...",
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateCharacterCount = (content: string) => {
    const textContent = content.replace(/<[^>]*>/g, "");
    setCharacterCount(textContent.length);
  };

  const handleInput = () => {
    if (editorRef.current && !isUpdating) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      updateCharacterCount(content);
    }
  };

  const formatText = (command: string, value?: string) => {
    // Ensure the editor is focused
    if (editorRef.current) {
      editorRef.current.focus();
    }

    // Execute the formatting command
    document.execCommand(command, false, value);

    // Get the updated content and notify parent
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      updateCharacterCount(content);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      formatText("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      formatText("insertImage", url);
    }
  };

  // Update editor content when value prop changes (but avoid infinite loops)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      setIsUpdating(true);
      editorRef.current.innerHTML = value;
      updateCharacterCount(value);
      setIsUpdating(false);
    }
  }, [value]);

  // Set initial content
  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
      updateCharacterCount(value);
    }
  }, []);

  return (
    <div
      className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => formatText("bold")}
          className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText("italic")}
          className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText("underline")}
          className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => formatText("insertUnorderedList")}
          className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText("insertOrderedList")}
          className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={insertLink}
          className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => formatText("formatBlock", "blockquote")}
          className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText("formatBlock", "pre")}
          className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[150px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rich-text-editor"
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          lineHeight: "1.6",
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
        <div>
          Supports <strong>bold</strong>, <em>italic</em>, <u>underline</u> •
          bullets, 1. numbers, [links](url), ![images](url)
        </div>
        <div>{characterCount} characters</div>
      </div>

      <style>{`
        .rich-text-editor:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
          pointer-events: none;
        }
        
        .rich-text-editor strong {
          font-weight: bold;
        }
        
        .rich-text-editor em {
          font-style: italic;
        }
        
        .rich-text-editor u {
          text-decoration: underline;
        }
        
        .rich-text-editor blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .rich-text-editor pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          font-family: monospace;
          white-space: pre-wrap;
        }
        
        .rich-text-editor ul {
          list-style-type: disc;
          padding-left: 2rem;
          margin: 0.5rem 0;
        }
        
        .rich-text-editor ol {
          list-style-type: decimal;
          padding-left: 2rem;
          margin: 0.5rem 0;
        }
        
        .rich-text-editor li {
          margin: 0.25rem 0;
        }
        
        .rich-text-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .rich-text-editor img {
          max-width: 100%;
          height: auto;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
