import { getYouTubeVideoId } from "../components/blog/blogUtils";

export type ProductVideoPlayer =
  | {
      kind: "iframe";
      src: string;
      allow?: string;
    }
  | {
      kind: "video";
      src: string;
    };

/**
 * Maps stored product video URLs to something the browser can play.
 * Watch URLs and file links are not valid iframe `src` values; this matches
 * the behavior used on the public product page.
 */
export function resolveProductVideoPlayer(raw: string | undefined): ProductVideoPlayer | null {
  const url = raw?.trim();
  if (!url) return null;

  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch?.[1]) {
    return {
      kind: "iframe",
      src: `https://www.youtube.com/embed/${shortsMatch[1]}?rel=0`,
      allow:
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    };
  }

  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) {
    return {
      kind: "iframe",
      src: `https://www.youtube.com/embed/${youtubeId}?rel=0`,
      allow:
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo?.[1]) {
    return {
      kind: "iframe",
      src: `https://player.vimeo.com/video/${vimeo[1]}`,
      allow: "autoplay; fullscreen; picture-in-picture",
    };
  }

  const drive = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (drive?.[1]) {
    return {
      kind: "iframe",
      src: `https://drive.google.com/file/d/${drive[1]}/preview`,
    };
  }

  if (/youtube\.com\/embed\//i.test(url) || /player\.vimeo\.com\/video\//i.test(url)) {
    return { kind: "iframe", src: url };
  }

  return { kind: "video", src: url };
}
