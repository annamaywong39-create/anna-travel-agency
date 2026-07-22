import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, MapPin, Users, BedDouble, Wifi, Car, Dumbbell,
  UtensilsCrossed, Waves, Shield, Calendar, CheckCircle2, Hotel
} from 'lucide-react';
import Card3D from '../components/Card3D';
import ImageGallery from '../components/ImageGallery';
import ReviewSection from '../components/ReviewSection';
import { useData } from '../contexts/DataContext';
import { useCurrency } from '../contexts/CurrencyContext';

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi, Parking: Car, Gym: Dumbbell, Restaurant: UtensilsCrossed,
  Pool: Waves, 'Room Service': UtensilsCrossed, Security: Shield,
};

export default function ListingDetail() {
  const { id } = useParams();
  const { listings, getListingReviews, getListingAverageRating } = useData();
  const { format } = useCurrency();
  
  const listing = listings.find((l) => l.id === id);
  const reviews = id ? getListingReviews(id) : [];
  const avgRating = id ? getListingAverageRating(id) : 0;
  const displayRating = reviews.length > 0 ? avgRating : listing?.rating || 0;
  const displayReviews = reviews.length > 0 ? reviews.length : listing?.reviews || 0;

  if (!listing) {
    return (
      <main className="pt-32 pb-20 text-center bg-[#0A1128]">
        <h1 className="text-3xl font-bold text-white">Listing not found</h1>
        <Link to="/listings" className="text-[#DB8293] mt-4 inline-block">← Back to listings</Link>
      </main>
    );
  }

  const nights = 7;
  const subtotal = listing.price * nights;
  const serviceFee = Math.round(subtotal * 0.1);
  const cleaningFee = 75;
  const total = subtotal + serviceFee + cleaningFee;

  return (
    <main className="pt-24 pb-20 min-h-screen bg-[#0A1128]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/listings" className="inline-flex items-center gap-2 text-[#DB8293] text-sm mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to all listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <ImageGallery images={listing.images} title={listing.title} />

            {/* Title & meta */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{listing.title}</h1>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#C49B55]" /> {listing.city}</div>
                    <span>·</span>
                    <span className="capitalize">{listing.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#C49B55] fill-[#C49B55]" />
                  <span className="text-white font-bold text-lg">{displayRating.toFixed(1)}</span>
                  <span className="text-gray-400">({displayReviews} reviews)</span>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8">{listing.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: Users, label: 'Max Guests', value: listing.maxGuests },
                  { icon: BedDouble, label: 'Bedrooms', value: listing.bedrooms },
                  { icon: MapPin, label: 'To Stadium', value: listing.distanceToStadium },
                  { icon: Calendar, label: 'Available', value: listing.available ? 'Yes' : 'No' },
                ].map((stat) => (
                  <Card3D key={stat.label}>
                    <div className="p-4 text-center bg-[#131C2E] rounded-2xl border border-white/5">
                      <stat.icon className="w-5 h-5 text-[#DB8293] mx-auto mb-2" />
                      <p className="text-white font-bold">{stat.value}</p>
                      <p className="text-gray-500 text-xs">{stat.label}</p>
                    </div>
                  </Card3D>
                ))}
              </div>

              {/* Amenities */}
              <h3 className="text-xl font-bold text-white mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {listing.amenities.map((a) => {
                  const Icon = amenityIcons[a] || CheckCircle2;
                  return (
                    <div key={a} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300">
                      <Icon className="w-4 h-4 text-[#DB8293]" />
                      {a}
                    </div>
                  );
                })}
              </div>

              {/* Stadium info */}
              <Card3D>
                <div className="p-6 flex items-center gap-4 bg-[#131C2E] rounded-2xl border border-white/5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#DB8293] to-[#C49B55] flex items-center justify-center text-2xl shrink-0">
                    ⚽
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Nearest Stadium: {listing.nearestStadium}</h4>
                    <p className="text-gray-400 text-sm">Distance: {listing.distanceToStadium} — Easy access via public transport or shuttle</p>
                  </div>
                </div>
              </Card3D>

              {/* Reviews Section */}
              {id && <ReviewSection listingId={id} />}
            </motion.div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-28"
            >
              <Card3D glowColor="rgba(219, 130, 147, 0.2)">
                <div className="p-6 bg-[#131C2E] rounded-2xl border border-white/5">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-white">{format(listing.price)}</span>
                    <span className="text-gray-400">/ night</span>
                  </div>

                  {/* Quick calc */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{format(listing.price)} × {nights} nights</span>
                      <span className="text-white">{format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Service fee</span>
                      <span className="text-white">{format(serviceFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Cleaning fee</span>
                      <span className="text-white">{format(cleaningFee)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between">
                      <span className="text-white font-bold">Total ({nights} nights)</span>
                      <span className="text-[#DB8293] font-bold text-lg">
                        {format(total)}
                      </span>
                    </div>
                  </div>

                  {/* ✅ FIXED: No soccer ball icon */}
                  <Link
                    to={`/booking/${listing.id}`}
                    className="block w-full py-4 rounded-xl bg-gradient-to-r from-[#DB8293] to-[#C49B55] text-white font-bold text-center text-lg shadow-lg shadow-[#DB8293]/25 hover:shadow-[#DB8293]/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Hotel className="w-5 h-5" /> Book Now
                  </Link>

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4 text-green-400" />
                    Free cancellation up to 7 days before check-in
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-green-400 text-sm font-medium text-center">
                      🔥 Only 3 left at this price!
                    </p>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}