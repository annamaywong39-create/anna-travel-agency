const localEventImages = {
  bts: '/images/events/bts/bts-giveaway-light.png',
  btsAlt: '/images/events/bts/bts-metlife-promo.png',
  stadium: '/images/stadium.jpg',
  music: '/images/event-music.jpg',
  sport: '/images/event-sport.jpg',
  festival: '/images/fans.jpg',
  technology: '/images/city.jpg',
};

/** Use a local, themed image when a database event has no usable image. */
export function eventImageFor(event: { title?: string; category?: string; image_url?: string }) {
  const text = `${event.title || ''} ${event.category || ''}`.toLowerCase();
  if (text.includes('bts')) return '/images/events/bts/bts-arirang-tour.png';
  if (event.image_url?.startsWith('/images/')) return event.image_url;
  if (text.includes('f1') || text.includes('grand prix') || text.includes('tennis') || text.includes('open')) return localEventImages.stadium;
  if (text.includes('festival') || text.includes('edc') || text.includes('lollapalooza') || text.includes('music')) return localEventImages.festival;
  if (text.includes('tech') || text.includes('ces') || text.includes('pax') || text.includes('gaming')) return localEventImages.technology;
  if (text.includes('sport') || text.includes('football')) return localEventImages.sport;
  return localEventImages.music;
}
