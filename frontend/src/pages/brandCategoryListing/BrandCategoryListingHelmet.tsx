import React from "react";
import { Helmet } from "react-helmet";

type Seo = {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
};

type Props = { seoData: Seo };

export const BrandCategoryListingHelmet: React.FC<Props> = ({ seoData }) => {
  const url = typeof window !== "undefined" ? window.location.href : "";
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
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
