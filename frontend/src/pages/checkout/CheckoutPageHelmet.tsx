import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { buildCanonicalUrl } from "../../utils/seo";

interface CheckoutPageHelmetProps {
  title: string;
  description: string;
  keywords: string;
}

export function CheckoutPageHelmet({
  title,
  description,
  keywords,
}: CheckoutPageHelmetProps) {
  const { pathname } = useLocation();
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={buildCanonicalUrl(pathname)} />
    </Helmet>
  );
}
