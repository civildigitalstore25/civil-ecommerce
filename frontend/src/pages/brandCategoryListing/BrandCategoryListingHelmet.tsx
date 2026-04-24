import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { buildCanonicalUrl } from "../../utils/seo";

type Seo = {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
};

type Props = { seoData: Seo };

export const BrandCategoryListingHelmet: React.FC<Props> = ({ seoData }) => {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const canonicalParams = new URLSearchParams();
  const brand = (params.get("brand") || "").trim();
  const category = (params.get("category") || "").trim();

  if (brand) canonicalParams.set("brand", brand);
  if (category) canonicalParams.set("category", category);

  const baseCanonical = buildCanonicalUrl(pathname);
  const queryString = canonicalParams.toString();
  const url = queryString ? `${baseCanonical}?${queryString}` : baseCanonical;
  const title = String(seoData.title ?? "");
  const description = String(seoData.description ?? "");
  const keywords = String(seoData.keywords ?? "");
  const ogTitle = String(seoData.ogTitle ?? seoData.title ?? "");
  const ogDescription = String(seoData.ogDescription ?? seoData.description ?? "");

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
