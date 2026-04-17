type Colors = {
  text: { primary: string; secondary: string };
  interactive: { primary: string };
};

export function ProductDetailReviewExpandableText({
  id,
  text,
  expandedIds,
  setExpandedIds,
  colors,
  clampThreshold = 80,
}: {
  id: string;
  text: string;
  expandedIds: Set<string>;
  setExpandedIds: (next: Set<string>) => void;
  colors: Colors;
  clampThreshold?: number;
}) {
  const expanded = expandedIds.has(id);
  return (
    <div
      className="text-sm leading-relaxed min-w-0 overflow-hidden"
      style={{ color: colors.text.secondary }}
    >
      <p
        className={expanded ? "" : "line-clamp-2"}
        style={{
          color: colors.text.secondary,
          wordBreak: "break-word",
          overflow: expanded ? "visible" : "hidden",
        }}
      >
        {text}
      </p>
      {text.length > clampThreshold && (
        <button
          type="button"
          onClick={() => {
            const next = new Set(expandedIds);
            if (expanded) next.delete(id);
            else next.add(id);
            setExpandedIds(next);
          }}
          className="text-xs font-medium mt-1 transition-colors hover:underline"
          style={{ color: colors.interactive.primary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
