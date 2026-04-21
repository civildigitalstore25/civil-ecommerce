import React from "react";
import ReactMarkdown from "react-markdown";
import { useProductViewModalTheme } from "./useProductViewModalTheme";

type Props = {
  htmlContent?: string;
};

export const ProductViewModalRichContent: React.FC<Props> = ({ htmlContent }) => {
  const t = useProductViewModalTheme();

  if (!htmlContent?.trim()) {
    return (
      <p className="text-sm" style={t.muted}>
        No content available
      </p>
    );
  }

  const isHTML = /<[^>]+>/.test(htmlContent);
  if (isHTML) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="prose max-w-none product-view-modal-prose"
        style={t.body}
      />
    );
  }

  return (
    <div className="prose max-w-none product-view-modal-prose" style={t.body}>
      <ReactMarkdown>{htmlContent}</ReactMarkdown>
    </div>
  );
};
