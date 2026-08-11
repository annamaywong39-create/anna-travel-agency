import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

const SITE_NAME = 'Anna Travel Agency';
const BASE_URL = 'https://www.annatravelagency.com';
const DEFAULT_DESC = 'Anna Travel Agency helps you plan event trips with selected stays, ticket requests, and human concierge support.';
const DEFAULT_IMG = `${BASE_URL}/images/hero.jpg`;

export default function SEO({ title, description, image, path = '' }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Your Journey, Our Priority`;
  const desc = description || DEFAULT_DESC;
  const img = image || DEFAULT_IMG;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      {/* Primary Title */}
      <title>{fullTitle}</title>
      
      {/* Description */}
      <meta name="description" content={desc} />
      
      {/* Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      
      {/* Keywords */}
      <meta name="keywords" content="travel agency, hotel booking, airport transfers, experiences, event tickets, Anna Travel Agency" />
      
      <meta property="og:locale" content="en_US" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TravelAgency',
          name: SITE_NAME,
          url: BASE_URL,
          logo: `${BASE_URL}/logo.png`,
          image: img,
          description: desc,
          email: 'hello@annatravelagency.com',
          areaServed: 'Worldwide',
        })}
      </script>
    </Helmet>
  );
}