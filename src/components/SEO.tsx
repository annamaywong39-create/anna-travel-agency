import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

const SITE_NAME = 'Anna Travel Agency';
const BASE_URL = 'https://annatravelagency.com';
const DEFAULT_DESC = 'Your Journey, Our Priority. Book hotels, apartments, airport transfers, experiences, and event tickets worldwide.';
const DEFAULT_IMG = 'https://images.pexels.com/photos/2606028/pexels-photo-2606028.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200';

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
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}