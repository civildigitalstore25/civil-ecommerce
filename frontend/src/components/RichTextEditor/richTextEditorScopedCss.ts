/** Scoped styles for the TipTap rich text editor. */
export const RICH_TEXT_EDITOR_SCOPED_CSS = `
  .tiptap-editor .tiptap {
    outline: none;
    line-height: 1.6;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  .tiptap-editor .tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #9ca3af;
    font-style: italic;
    pointer-events: none;
    height: 0;
  }

  .tiptap-editor .tiptap p {
    margin: 0.25rem 0;
  }

  .tiptap-editor .tiptap strong {
    font-weight: bold;
  }

  .tiptap-editor .tiptap h1 {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.3;
    margin: 0.75rem 0 0.5rem;
  }

  .tiptap-editor .tiptap h2 {
    font-size: 1.375rem;
    font-weight: 700;
    line-height: 1.35;
    margin: 0.625rem 0 0.375rem;
  }

  .tiptap-editor .tiptap h3 {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 0.5rem 0 0.25rem;
  }

  .tiptap-editor .tiptap h4 {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 0.375rem 0 0.25rem;
  }

  .tiptap-editor .tiptap em {
    font-style: italic;
  }

  .tiptap-editor .tiptap u {
    text-decoration: underline;
  }

  .tiptap-editor .tiptap blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    color: #6b7280;
  }

  .tiptap-editor .tiptap pre {
    background-color: #f3f4f6;
    padding: 1rem;
    border-radius: 0.375rem;
    font-family: monospace;
    white-space: pre-wrap;
  }

  .tiptap-editor .tiptap code {
    background-color: #f3f4f6;
    padding: 0.15rem 0.3rem;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.9em;
  }

  .tiptap-editor .tiptap pre code {
    background: none;
    padding: 0;
    border-radius: 0;
  }

  .tiptap-editor .tiptap ul {
    list-style-type: disc;
    padding-left: 2rem;
    margin: 0.5rem 0;
  }

  .tiptap-editor .tiptap ol {
    list-style-type: decimal;
    padding-left: 2rem;
    margin: 0.5rem 0;
  }

  .tiptap-editor .tiptap li {
    margin: 0.25rem 0;
  }

  .tiptap-editor .tiptap li p {
    margin: 0;
  }

  .tiptap-editor .tiptap a {
    color: #3b82f6;
    text-decoration: underline;
    cursor: pointer;
  }

  .tiptap-editor .tiptap img {
    max-width: 100%;
    height: auto;
    margin: 0.5rem 0;
    border-radius: 0.375rem;
  }

  .tiptap-editor .tiptap hr {
    border: none;
    border-top: 2px solid #e5e7eb;
    margin: 1rem 0;
  }
`;
