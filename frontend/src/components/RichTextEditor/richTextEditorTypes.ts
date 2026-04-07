export type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Min height for the editor area only (e.g. "400px"). */
  editorMinHeight?: string;
  /** Max height for the editor area; enables scrolling when content exceeds. */
  editorMaxHeight?: string;
};
