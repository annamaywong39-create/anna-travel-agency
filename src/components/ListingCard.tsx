import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, BedDouble, Building2, Home, Key } from 'lucide-react';
import Card3D from './Card3D';
import { useCurrency } from '../contexts/CurrencyContext';
import type { Listing } from '../data/constants';

const typeIcons = {
  hotel: Building2,
  apartment: Home,
  shortlet: Key,
};

const typeColors = {
  hotel: 'from-blue-500 to-cyan-400',
  apartment: 'from-emerald-500 to-green-400',
  shortlet: 'from-purple-500 to-pink-400',
};

const typeBadgeColors = {
  hotel: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  apartment: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  shortlet: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

export default function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const Icon = typeIcons[listing.type];
  const { format } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card3D>
        <Link to={`/listing/${listing.id}`} className="block">
          {/* ─── Image ─── */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              width="400"
              height="208"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Type badge */}
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border ${typeBadgeColors[listing.type]} backdrop-blur-sm flex items-center gap-1.5`}>
              <Icon className="w-3 h-3" />
              {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
            </div>

            {/* Price */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-sm border border-white/10">
              <span className="text-amber-400 font-bold text-lg">{format(listing.price)}</span>
              <span className="text-gray-300 text-xs"> /night</span>
            </div>
          </div>

          {/* ─── Content ─── */}
          <div className="p-5">
            <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">{listing.title}</h3>

            <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{listing.city}</span>
              <span className="mx-1">·</span>
              <span className="text-xs">{listing.distanceToStadium} to {listing.nearestStadium}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-white font-medium">{listing.rating}</span>
              </div>
              <span className="text-gray-500 text-sm">({listing.reviews} reviews)</span>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{listing.maxGuests} guests</span>
              </div>
              <div className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" />
                <span>{listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Amenities preview */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {listing.amenities.slice(0, 4).map((a) => (
                <span key={a} className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-xs border border-white/5">
                  {a}
                </span>
              ))}
              {listing.amenities.length > 4 && (
                <span className="px-2 py-0.5 rounded-md text-amber-400 text-xs">
                  +{listing.amenities.length - 4} more
                </span>
              )}
            </div>

            {/* CTA */}
            <div className={`mt-4 py-2.5 rounded-xl bg-gradient-to-r ${typeColors[listing.type]} text-white text-center font-semibold text-sm opacity-90 hover:opacity-100 transition-opacity`}>
              View Details & Book
            </div>
          </div>
        </Link>
      </Card3D>
    </motion.div>
  );
}