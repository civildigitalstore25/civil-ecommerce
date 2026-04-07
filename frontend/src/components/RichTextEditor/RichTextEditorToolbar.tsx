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

type RichTextEditorToolbarProps = {
  onFormat: (command: string, value?: string) => void;
  onInsertLink: () => void;
  onInsertImage: () => void;
};

export function RichTextEditorToolbar({
  onFormat,
  onInsertLink,
  onInsertImage,
}: RichTextEditorToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
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
