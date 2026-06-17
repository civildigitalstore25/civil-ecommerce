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

  .rich-text-editor h1 {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.3;
    margin: 0.75rem 0 0.5rem;
  }

  .rich-text-editor h2 {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.35;
    margin: 0.625rem 0 0.375rem;
  }

  .rich-text-editor h3 {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 0.5rem 0 0.25rem;
  }

  .rich-text-editor h4 {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 0.375rem 0 0.25rem;
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
