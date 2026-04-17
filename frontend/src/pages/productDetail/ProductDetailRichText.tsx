import React from "react";
import ReactMarkdown from "react-markdown";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

type Props = {
  htmlContent?: string;
  className?: string;
  colors: ThemeColors;
};

export const ProductDetailRichText: React.FC<Props> = ({ htmlContent, className, colors }) => {
  if (!htmlContent) {
    return <p style={{ color: colors.text.secondary }}>No content available</p>;
  }

  const isHTML = /<[^>]+>/.test(htmlContent);
  if (isHTML) {
    return (
      <div
        className={`${className || "prose max-w-none"} overflow-x-auto`}
        style={
          {
            color: colors.text.secondary,
            "--tw-prose-body": colors.text.secondary,
            "--tw-prose-headings": colors.text.primary,
            "--tw-prose-bold": colors.text.primary,
            "--tw-prose-links": colors.interactive.primary,
          } as React.CSSProperties
        }
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  let content = htmlContent;
  content = content.replace(
    /(\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+([A-Z])/g,
    "$1\n\n**$2**\n\n$3",
  );
  const parts = content.split(/\s*•\s*/);
  if (parts.length > 1) {
    const intro = parts[0].trim();
    const bullets = parts
      .slice(1)
      .map((item) => `- ${item.trim()}`)
      .join("\n");
    content = `${intro}\n\n${bullets}`;
  }
  content = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");

  return (
    <div className={className || "prose max-w-none"} style={{ color: colors.text.secondary }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};
