import { Helmet } from "react-helmet-async";

type SEOProps = {
  title: string;
  description: string;
  type?: string;
  image?: string;
  noIndex?: boolean;
};

const SEO = ({
  title,
  description,
  type = "website",
  image,
  noIndex = false,
}: SEOProps) => {
  return (
    <Helmet>
      {/* 🔥 Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* 🌐 Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}

      {/* 🐦 Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* 🚫 indexing control */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default SEO;