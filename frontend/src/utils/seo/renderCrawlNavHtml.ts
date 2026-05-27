import { crawlNavSections } from "../../constants/crawlNavLinks";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** HTML nav placed in index.html so non-JS crawlers see internal outlinks on every route. */
export function renderCrawlNavHtml(): string {
  const sections = crawlNavSections
    .map((section) => {
      const items = section.links
        .map(
          (link) =>
            `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`,
        )
        .join("\n          ");
      return `<section aria-labelledby="crawl-nav-${escapeHtml(section.title.toLowerCase().replace(/\s+/g, "-"))}">
        <h2 id="crawl-nav-${escapeHtml(section.title.toLowerCase().replace(/\s+/g, "-"))}">${escapeHtml(section.title)}</h2>
        <ul>
          ${items}
        </ul>
      </section>`;
    })
    .join("\n      ");

  return `<nav id="crawl-nav" aria-label="Site navigation">
    <h1>Softzcart — Engineering Software &amp; Resources</h1>
    <p>Browse authorized software for AutoCAD, Autodesk, Microsoft, Adobe, and more.</p>
    <div class="crawl-nav-sections">
      ${sections}
    </div>
  </nav>`;
}
