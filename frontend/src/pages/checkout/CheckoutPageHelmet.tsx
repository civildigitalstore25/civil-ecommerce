import { Helmet } from "react-helmet";

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
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
}
