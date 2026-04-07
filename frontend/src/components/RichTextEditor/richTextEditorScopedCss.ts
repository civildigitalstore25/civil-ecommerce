/** Inline styles for contentEditable rich text (lists, links, placeholder). */
export const RICH_TEXT_EDITOR_SCOPED_CSS = `
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
`;
