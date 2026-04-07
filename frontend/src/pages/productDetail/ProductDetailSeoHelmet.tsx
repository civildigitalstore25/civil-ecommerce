import React from "react";
import { Helmet } from "react-helmet";

/** Shape returned by getProductSEO for product pages */
export type ProductDetailSeoData = {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
} | null;

type Props = {
  seoData: ProductDetailSeoData;
  ogImage: string;
  /** When set, emits product:price meta tags */
  priceInr?: number;
};

export const ProductDetailSeoHelmet: React.FC<Props> = ({
  seoData,
  ogImage,
  priceInr,
}) => {
  const url = typeof window !== "undefined" ? window.location.href : "";

  const title = seoData?.title || "Product Detail - Softzcart";
  const description = seoData?.description || "Discover premium software products with genuine licenses and instant delivery.";
  const keywords = seoData?.keywords || "software, buy online, genuine license";
  const ogTitle = seoData?.ogTitle || seoData?.title || "Product Detail";
  const ogDescription = seoData?.ogDescription || seoData?.description || "Discover premium software products.";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage || ""} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="product" />
      {priceInr != null && priceInr > 0 ? (
        <meta property="product:price:amount" content={String(priceInr)} />
      ) : null}
      {priceInr != null && priceInr > 0 ? (
        <meta property="product:price:currency" content="INR" />
      ) : null}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage || ""} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
