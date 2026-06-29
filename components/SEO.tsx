import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

const SITE_NAME = 'Anna Travel Agency';
const BASE_URL = 'https://annatravelagency.com';
const DEFAULT_DESC = 'Book hotels, apartments & shortlets for FIFA World Cup 2026 across 16 host cities in USA, Mexico & Canada. Your trusted World Cup accommodation partner.';
const DEFAULT_IMG = 'https://images.pexels.com/photos/38078377/pexels-photo-38078377.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200';

export default function SEO({ title, description, image, path = '' }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — FIFA World Cup 2026 Accommodation`;
  const desc = description || DEFAULT_DESC;
  const img = image || DEFAULT_IMG;
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      {/* Extra */}
      <meta name="keywords" content="FIFA World Cup 2026, accommodation, hotel, apartment, shortlet, USA, Mexico, Canada, travel, booking" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
