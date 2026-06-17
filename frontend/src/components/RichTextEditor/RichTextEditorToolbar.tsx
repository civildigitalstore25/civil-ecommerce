import { useState, useRef, useEffect } from "react";
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
  ChevronDown,
} from "lucide-react";

type RichTextEditorToolbarProps = {
  onFormat: (command: string, value?: string) => void;
  onInsertLink: () => void;
  onInsertImage: () => void;
};

const HEADING_OPTIONS = [
  { label: "Normal", tag: "p", className: "text-sm" },
  { label: "H1", tag: "h1", className: "text-lg font-bold" },
  { label: "H2", tag: "h2", className: "text-base font-bold" },
  { label: "H3", tag: "h3", className: "text-sm font-bold" },
  { label: "H4", tag: "h4", className: "text-sm font-semibold" },
] as const;

export function RichTextEditorToolbar({
  onFormat,
  onInsertLink,
  onInsertImage,
}: RichTextEditorToolbarProps) {
  const [headingOpen, setHeadingOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setHeadingOpen(false);
      }
    };
    if (headingOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [headingOpen]);

  const handleHeadingSelect = (tag: string) => {
    onFormat("formatBlock", tag);
    setHeadingOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
      {/* Heading Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setHeadingOpen((prev) => !prev)}
          className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-200 rounded text-yellow-700 transition-colors text-sm font-medium min-w-[80px] justify-between"
          title="Text style"
        >
          <span>Heading</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        {headingOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1 overflow-hidden">
            {HEADING_OPTIONS.map((opt) => (
              <button
                key={opt.tag}
                type="button"
                onClick={() => handleHeadingSelect(opt.tag)}
                className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 transition-colors ${opt.className}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={() => onFormat("bold")}
        className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onFormat("italic")}
        className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onFormat("underline")}
        className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={() => onFormat("insertUnorderedList")}
        className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onFormat("insertOrderedList")}
        className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={onInsertLink}
        className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
        title="Insert Link"
      >
        <Link className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onInsertImage}
        className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
        title="Insert Image"
      >
        <Image className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <button
        type="button"
        onClick={() => onFormat("formatBlock", "blockquote")}
        className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onFormat("formatBlock", "pre")}
        className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </button>
    </div>
  );
}
