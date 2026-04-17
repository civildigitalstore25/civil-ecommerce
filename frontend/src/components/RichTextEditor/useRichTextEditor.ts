import { useState, useRef, useEffect } from "react";

export function useRichTextEditor(
  value: string,
  onChange: (value: string) => void,
) {
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

  const formatText = (command: string, cmdValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, cmdValue);
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      updateCharacterCount(content);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) formatText("createLink", url);
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) formatText("insertImage", url);
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      setIsUpdating(true);
      editorRef.current.innerHTML = value;
      updateCharacterCount(value);
      setIsUpdating(false);
    }
  }, [value]);

  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
      updateCharacterCount(value);
    }
  }, []);

  return {
    editorRef,
    characterCount,
    handleInput,
    formatText,
    insertLink,
    insertImage,
  };
}
