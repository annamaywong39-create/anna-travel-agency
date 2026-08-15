import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, BedDouble, Building2, Home, Key, Heart } from 'lucide-react';
import Card3D from './Card3D';
import { useCurrency } from '../contexts/CurrencyContext';
import { useWishlist } from '../contexts/WishlistContext';
import type { Listing } from '../data/constants';

const typeIcons = {
  hotel: Building2,
  apartment: Home,
  shortlet: Key,
};

export default function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const normalized = {
    ...listing,
    type: listing.type && typeIcons[listing.type] ? listing.type : 'hotel',
    images: Array.isArray(listing.images) ? listing.images : [],
    amenities: Array.isArray(listing.amenities) ? listing.amenities : [],
    title: listing.title || 'Untitled listing',
    city: listing.city || 'City',
    price: Number(listing.price) || 0,
    rating: Number(listing.rating) || 0,
    reviews: Number(listing.reviews) || 0,
    maxGuests: Number(listing.maxGuests) || 0,
    bedrooms: Number(listing.bedrooms) || 0,
    distanceToStadium: listing.distanceToStadium || 'nearby',
    nearestStadium: listing.nearestStadium || 'your destination',
  };
  const Icon = typeIcons[normalized.type];
  const { format } = useCurrency();
  const { toggle, has } = useWishlist();
  const isWish = has(normalized.id);
  const imageSrc = normalized.images[0] || '/images/hotel-luxury.jpg';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }} viewport={{ once: true }}>
      <Card3D>
        <div className="relative overflow-hidden rounded-2xl border border-[#D8E5F0] bg-white shadow-sm hover:shadow-lg transition-shadow">
          <Link to={`/listing/${normalized.id}`} className="block">
            <div className="relative h-52 property-media">
              <img src={imageSrc} alt={normalized.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" onError={(e) => { if (!(e.target as HTMLImageElement).src.endsWith('/images/hotel-luxury.jpg')) (e.target as HTMLImageElement).src = '/images/hotel-luxury.jpg'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#14253F] backdrop-blur">
                <Icon className="h-3 w-3" /> {normalized.type.charAt(0).toUpperCase() + normalized.type.slice(1)}
              </div>
              <div className="absolute bottom-3 right-3 rounded-xl bg-[#14253F]/85 px-3 py-1.5 text-white backdrop-blur">
                <span className="text-[#F2C94C] font-bold">{listing.priceIsFrom ? 'From ' : ''}{format(normalized.price)}</span><span className="text-white/70 text-xs"> /night</span>
              </div>
            </div>
          </Link>
          <button onClick={(e) => { e.preventDefault(); toggle({ id: normalized.id, type: 'listing', title: normalized.title }); }} aria-label={isWish ? 'Remove from wishlist' : 'Add to wishlist'} className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur transition ${isWish ? 'bg-[#E85D9A] border-[#E85D9A] text-white' : 'bg-white/80 border-[#D8E5F0] text-[#8A9AB0] hover:text-[#E85D9A]'}`}>
            <Heart className={`h-4 w-4 ${isWish ? 'fill-white' : ''}`} />
          </button>

          <div className="p-4">
            <Link to={`/listing/${normalized.id}`} className="block">
              <h3 className="line-clamp-1 font-semibold text-[#14253F]">{normalized.title}</h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-[#687A90]">
                <MapPin className="h-3.5 w-3.5 text-[#1267C4]" /> {normalized.city} <span className="mx-1">·</span> <span className="text-xs">{normalized.distanceToStadium} to {normalized.nearestStadium}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center gap-1 text-sm font-medium text-[#14253F]"><Star className="h-4 w-4 fill-[#F2C94C] text-[#F2C94C]" /> {normalized.rating}</span><span className="text-xs text-[#8A9AB0]">({normalized.reviews}) • Verified stay</span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-[#687A90]">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {normalized.maxGuests} guests</span>
                <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" /> {normalized.bedrooms} bed{normalized.bedrooms>1?'s':''}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {normalized.amenities.slice(0,4).map((a) => <span key={a} className="rounded-md border border-[#D8E5F0] bg-[#F7FAFD] px-2 py-0.5 text-[11px] text-[#5B6B82]">{a}</span>)}
                {normalized.amenities.length>4 && <span className="text-[11px] text-[#1267C4]">+{normalized.amenities.length-4} more</span>}
              </div>
            </Link>
            <Link to={`/listing/${normalized.id}`} className="mt-4 block rounded-xl bg-[#1267C4] py-2.5 text-center text-sm font-bold text-white hover:bg-[#0F5AAC]">View Details</Link>
          </div>
        </div>
      </Card3D>
    </motion.div>
  );
}
