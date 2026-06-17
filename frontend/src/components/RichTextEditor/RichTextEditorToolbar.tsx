import { useState, useRef, useEffect, useCallback } from "react";
import type { Editor } from "@tiptap/react";
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  RemoveFormatting,
} from "lucide-react";

type RichTextEditorToolbarProps = {
  editor: Editor | null;
};

const HEADING_OPTIONS = [
  { label: "Normal", level: 0 },
  { label: "H1", level: 1 },
  { label: "H2", level: 2 },
  { label: "H3", level: 3 },
  { label: "H4", level: 4 },
] as const;

const HEADING_FONT_CLASSES: Record<number, string> = {
  0: "text-sm",
  1: "text-lg font-bold",
  2: "text-base font-bold",
  3: "text-sm font-bold",
  4: "text-sm font-semibold",
};

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Yellow", value: "#eab308" },
  { label: "Green", value: "#22c55e" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
  { label: "Gray", value: "#6b7280" },
];

// Active-state aware toolbar button
function ToolbarButton({
  onClick,
  isActive = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-700"
          : "hover:bg-gray-200 text-yellow-600"
      }`}
      title={title}
    >
      {children}
    </button>
  );
}

export function RichTextEditorToolbar({ editor }: RichTextEditorToolbarProps) {
  const [headingOpen, setHeadingOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headingRef.current && !headingRef.current.contains(e.target as Node)) {
        setHeadingOpen(false);
      }
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setColorOpen(false);
      }
    };
    if (headingOpen || colorOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [headingOpen, colorOpen]);

  const handleHeadingSelect = useCallback(
    (level: number) => {
      if (!editor) return;
      if (level === 0) {
        editor.chain().focus().setParagraph().run();
      } else {
        editor
          .chain()
          .focus()
          .toggleHeading({ level: level as 1 | 2 | 3 | 4 })
          .run();
      }
      setHeadingOpen(false);
    },
    [editor],
  );

  const handleInsertLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href ?? "";
    const url = prompt("Enter URL:", previousUrl);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  const handleInsertImage = useCallback(() => {
    if (!editor) return;
    const url = prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleColorSelect = useCallback(
    (color: string) => {
      if (!editor) return;
      if (color === "") {
        editor.chain().focus().unsetColor().run();
      } else {
        editor.chain().focus().setColor(color).run();
      }
      setColorOpen(false);
    },
    [editor],
  );

  if (!editor) return null;

  // Determine current heading level for dropdown label
  const currentHeading =
    HEADING_OPTIONS.find(
      (opt) =>
        opt.level > 0 &&
        editor.isActive("heading", { level: opt.level }),
    )?.label ?? "Normal";

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
      {/* Heading Dropdown */}
      <div className="relative" ref={headingRef}>
        <button
          type="button"
          onClick={() => setHeadingOpen((prev) => !prev)}
          className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-200 rounded text-yellow-700 transition-colors text-sm font-medium min-w-[80px] justify-between"
          title="Text style"
        >
          <span>{currentHeading}</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        {headingOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1 overflow-hidden">
            {HEADING_OPTIONS.map((opt) => (
              <button
                key={opt.level}
                type="button"
                onClick={() => handleHeadingSelect(opt.level)}
                className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 transition-colors ${HEADING_FONT_CLASSES[opt.level]} ${
                  (opt.level === 0 && !editor.isActive("heading"))
                    ? "bg-blue-50 text-blue-700"
                    : opt.level > 0 && editor.isActive("heading", { level: opt.level })
                      ? "bg-blue-50 text-blue-700"
                      : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Text Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Link & Image */}
      <ToolbarButton
        onClick={handleInsertLink}
        isActive={editor.isActive("link")}
        title="Insert Link"
      >
        <Link className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={handleInsertImage} title="Insert Image">
        <Image className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Quote & Code */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Quote"
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        title="Code Block"
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Text Color */}
      <div className="relative" ref={colorRef}>
        <button
          type="button"
          onClick={() => setColorOpen((prev) => !prev)}
          className="p-2 hover:bg-gray-200 rounded text-yellow-600 transition-colors"
          title="Text Color"
        >
          <Palette className="h-4 w-4" />
        </button>

        {colorOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 min-w-[160px]">
            <div className="grid grid-cols-5 gap-1">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => handleColorSelect(c.value)}
                  className="w-7 h-7 rounded-md border border-gray-200 hover:scale-110 transition-transform flex items-center justify-center"
                  style={{
                    backgroundColor: c.value || "#ffffff",
                  }}
                  title={c.label}
                >
                  {c.value === "" && (
                    <span className="text-xs text-gray-400">A</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        title="Clear Formatting"
      >
        <RemoveFormatting className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}
