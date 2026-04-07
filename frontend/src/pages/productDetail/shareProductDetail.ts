export function shareProductDetail(platform: string, productName: string): void {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`${productName} - ${window.location.href}`);
  let shareUrl = "";

  switch (platform) {
    case "whatsapp":
      shareUrl = `https://wa.me/?text=${text}`;
      break;
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
      break;
    case "linkedin":
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      break;
    case "email":
      shareUrl = `mailto:?subject=${encodeURIComponent(productName)}&body=${text}`;
      break;
    default:
      shareUrl = "";
  }

  if (shareUrl) {
    window.open(shareUrl, "_blank", "noopener noreferrer");
  }
}
