import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useLocation } from "react-router-dom";
import { useProductDetailPage } from "./productDetail/useProductDetailPage";
import { ProductDetailPageContent } from "./productDetail/ProductDetailPageContent";
import { ProductDetailModals } from "./productDetail/ProductDetailModals";
import { buildCanonicalUrl, getProductSEO } from "../utils/seo";

/** Best-effort label from URL slug until product JSON is loaded (Helmet must run on loading/not-found). */
function readableNameFromSlug(slug: string | undefined): string {
  const s = decodeURIComponent(slug ?? "").trim();
  if (!s) return "Product";
  return s
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const page = useProductDetailPage();
  const { colors, isLoading, product } = page;
  const canonicalUrl = buildCanonicalUrl(pathname);

  if (isLoading) {
    const nameGuess = readableNameFromSlug(slug);
    const seo = getProductSEO({
      name: nameGuess,
      shortDescription: `View ${nameGuess} and pricing on Softzcart.`,
    });
    return (
      <>
        <Helmet>
          <title>{seo.title}</title>
          <meta name="description" content={seo.description} />
          <meta name="keywords" content={seo.keywords} />
          <meta property="og:title" content={seo.ogTitle ?? seo.title} />
          <meta property="og:description" content={seo.ogDescription ?? seo.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonicalUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.ogTitle ?? seo.title} />
          <meta name="twitter:description" content={seo.ogDescription ?? seo.description} />
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>
        <div
          className="text-center py-20 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Loading...
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Helmet>
          <title>Product not found | Softzcart</title>
          <meta
            name="description"
            content="This product is not available. Browse Softzcart for software licenses and engineering books."
          />
          <meta name="keywords" content="softzcart, software store, engineering books" />
          <meta property="og:title" content="Product not found | Softzcart" />
          <meta
            property="og:description"
            content="This product is not available on Softzcart."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonicalUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>
        <div
          className="text-center py-20 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Product not found.
        </div>
      </>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-200 pt-20"
      style={{
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
      }}
    >
      <ProductDetailPageContent page={{ ...page, product }} />
      <ProductDetailModals page={{ ...page, product }} />
    </div>
  );
};

export default ProductDetail;
