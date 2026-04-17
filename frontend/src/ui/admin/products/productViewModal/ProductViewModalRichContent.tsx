import React from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  htmlContent?: string;
};

export const ProductViewModalRichContent: React.FC<Props> = ({ htmlContent }) => {
  if (!htmlContent) {
    return <p style={{ color: "gray" }}>No content available</p>;
  }

  const isHTML = /<[^>]+>/.test(htmlContent);
  if (isHTML) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        className="prose max-w-none"
        style={{ color: "gray" }}
      />
    );
  }

  return (
    <div className="prose max-w-none" style={{ color: "gray" }}>
      <ReactMarkdown>{htmlContent}</ReactMarkdown>
    </div>
  );
};
