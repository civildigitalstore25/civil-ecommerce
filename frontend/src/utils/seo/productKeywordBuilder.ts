const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "as",
  "is",
  "was",
  "are",
  "with",
  "by",
  "from",
  "this",
  "that",
  "these",
  "those",
  "be",
  "have",
  "has",
  "had",
  "not",
  "your",
  "our",
  "you",
  "we",
  "it",
  "its",
  "will",
  "can",
  "all",
  "any",
  "may",
  "more",
  "most",
  "other",
  "some",
  "such",
  "only",
  "than",
  "too",
  "very",
  "just",
  "also",
  "into",
  "about",
  "out",
  "up",
  "one",
  "two",
  "first",
  "new",
  "who",
  "which",
  "their",
  "there",
  "what",
  "when",
  "where",
  "how",
  "why",
  "been",
  "www",
  "http",
  "https",
  "nbsp",
]);

export type ProductKeywordSource = {
  name: string;
  category?: string;
  company?: string;
  brand?: string;
  shortPlain?: string;
  descriptionPlain?: string;
  tags?: string[];
};

/** Derive comma-separated keywords from product fields (no external API). */
export function buildProductKeywords(input: ProductKeywordSource): string {
  const parts: string[] = [];
  const seen = new Set<string>();

  const add = (raw: string) => {
    const t = raw.trim();
    if (t.length < 2) return;
    const key = t.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    parts.push(t);
  };

  add(input.name);

  for (const tag of input.tags || []) {
    add(tag);
  }

  const cat = input.category?.replace(/-/g, " ").replace(/\s+/g, " ").trim();
  if (cat) {
    for (const w of cat.split(" ")) {
      if (w.length > 1) add(w);
    }
  }

  if (input.brand?.trim()) {
    add(input.brand.trim());
  } else if (input.company?.trim()) {
    add(input.company.trim());
  }

  const corpus = [input.shortPlain, input.descriptionPlain, input.name]
    .filter(Boolean)
    .join(" ");

  const tokens = corpus
    .toLowerCase()
    .replace(/[^a-z0-9\u00c0-\u024f\s-]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

  const counts = new Map<string, number>();
  for (const w of tokens) {
    counts.set(w, (counts.get(w) || 0) + 1);
  }

  const sorted = [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  const maxTerms = 16;
  for (const [word] of sorted) {
    if (parts.length >= maxTerms) break;
    add(word);
  }

  add("Softzcart");

  return parts.join(", ").slice(0, 500);
}
