import { useMemo, useState } from "react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

const SEO_TITLE_MAX = 70;
const SEO_DESCRIPTION_MAX = 172;
const SEO_KEYWORDS_MAX = 500;

export type AddProductModalSeoSectionProps = {
  colors: ThemeColors;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  onInputChange: (field: string, value: string) => void;
};

function parseKeywords(value: string): string[] {
  if (!value.trim()) return [];
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const piece of value.split(",")) {
    const keyword = piece.trim();
    if (!keyword) continue;
    const normalized = keyword.toLowerCase();
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    parts.push(keyword);
  }
  return parts;
}

export function AddProductModalSeoSection({
  colors,
  seoTitle,
  seoDescription,
  seoKeywords,
  onInputChange,
}: AddProductModalSeoSectionProps) {
  const [keywordInput, setKeywordInput] = useState("");

  const keywordList = useMemo(() => parseKeywords(seoKeywords), [seoKeywords]);

  const pushKeywords = (keywords: string[]) => {
    onInputChange("seoKeywords", keywords.join(", "));
  };

  const addKeyword = () => {
    const next = keywordInput.trim();
    if (!next) return;
    const existing = parseKeywords(seoKeywords);
    const exists = existing.some((k) => k.toLowerCase() === next.toLowerCase());
    if (!exists) {
      pushKeywords([...existing, next]);
    }
    setKeywordInput("");
  };

  const removeKeyword = (keyword: string) => {
    const filtered = keywordList.filter((k) => k.toLowerCase() !== keyword.toLowerCase());
    pushKeywords(filtered);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
          style={{
            color: colors.text.primary,
            borderBottomColor: colors.border.primary,
          }}
        >
          SEO <span className="opacity-70 font-normal text-base">(optional)</span>
        </h2>
        <p className="mt-2 text-sm" style={{ color: colors.text.secondary }}>
          Leave blank to auto-generate from product name, description, and keywords.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline gap-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            SEO Title
          </label>
          <span className="text-xs shrink-0" style={{ color: colors.text.secondary }}>
            {seoTitle.length}/{SEO_TITLE_MAX}
          </span>
        </div>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => onInputChange("seoTitle", e.target.value)}
          maxLength={SEO_TITLE_MAX}
          placeholder="Defaults to product name"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline gap-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            SEO Description
          </label>
          <span className="text-xs shrink-0" style={{ color: colors.text.secondary }}>
            {seoDescription.length}/{SEO_DESCRIPTION_MAX}
          </span>
        </div>
        <textarea
          value={seoDescription}
          onChange={(e) => onInputChange("seoDescription", e.target.value)}
          maxLength={SEO_DESCRIPTION_MAX}
          rows={3}
          placeholder="Defaults to product description"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200 resize-y min-h-[5rem]"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline gap-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            SEO Keywords
          </label>
          <span className="text-xs shrink-0" style={{ color: colors.text.secondary }}>
            {seoKeywords.length}/{SEO_KEYWORDS_MAX}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder="Type keyword and press Enter"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse,
            }}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[1.75rem]">
          {keywordList.map((keyword) => (
            <span
              key={keyword.toLowerCase()}
              className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
              style={{
                backgroundColor: colors.interactive.primary,
                color: colors.text.inverse,
                border: `1px solid ${colors.interactive.primary}`,
              }}
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="text-sm leading-none opacity-90 hover:opacity-100"
                style={{ color: colors.text.inverse }}
                aria-label={`Remove ${keyword}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
