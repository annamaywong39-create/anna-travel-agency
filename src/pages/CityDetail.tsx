import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Building2 } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { HOST_CITIES } from '../data/constants';
import { useData } from '../contexts/DataContext';

export default function CityDetail() {
  const { id } = useParams();
  const { listings } = useData();
  const city = HOST_CITIES.find((c) => c.id === id);
  const cityListings = listings.filter((l) => l.cityId === id);

  if (!city) {
    return (
      <main className="pt-32 pb-20 text-center">
        <h1 className="text-3xl font-bold text-white">City not found</h1>
        <Link to="/listings" className="text-amber-400 mt-4 inline-block">← Back to listings</Link>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-20 min-h-screen">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <Link to="/listings" className="inline-flex items-center gap-2 text-amber-400 text-sm mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to all cities
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{city.countryFlag}</span>
            <h1 className="text-4xl md:text-5xl font-black text-white">{city.name}</h1>
          </div>
          <div className="flex items-center gap-4 text-gray-300">
            <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-amber-400" /> {city.country}</div>
            <div className="flex items-center gap-1"><Building2 className="w-4 h-4 text-amber-400" /> {city.stadium}</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#5B6B82] text-lg mb-8 max-w-3xl">{city.description}</motion.p>

        {/* City guide */}
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#D8E5F0] bg-white p-5">
            <h3 className="text-sm font-bold text-[#14253F]">Getting to {city.stadium}</h3>
            <p className="mt-2 text-[13px] leading-5 text-[#687A90]">Most stays list distance to {city.stadium}. Use rideshare or local transit on event days — traffic near venues is heavy 2 hours before start. Check venue bag policy before you go.</p>
            <Link to={`/tickets?city=${encodeURIComponent(city.name)}`} className="mt-3 inline-block text-xs font-semibold text-[#1267C4] hover:underline">View events in {city.name} →</Link>
          </div>
          <div className="rounded-2xl border border-[#D8E5F0] bg-white p-5">
            <h3 className="text-sm font-bold text-[#14253F]">Where to stay</h3>
            <p className="mt-2 text-[13px] leading-5 text-[#687A90]">Within 1-2 miles of {city.stadium} is ideal for walking. Further stays save budget but need transport. All listings show distance and amenities.</p>
            <Link to={`/listings?city=${id}`} className="mt-3 inline-block text-xs font-semibold text-[#1267C4] hover:underline">Browse {city.name} stays →</Link>
          </div>
          <div className="rounded-2xl border border-[#D8E5F0] bg-white p-5">
            <h3 className="text-sm font-bold text-[#14253F]">Plan ahead</h3>
            <p className="mt-2 text-[13px] leading-5 text-[#687A90]">August events can be warm — bring water, check clear bag rules, arrive early for entry. Ticket delivery is {city.name.includes('Baltimore') ? 'Mobile transfer, evening before event' : 'Mobile transfer — timing confirmed after purchase'}.</p>
            <Link to="/contact" className="mt-3 inline-block text-xs font-semibold text-[#1267C4] hover:underline">Ask concierge →</Link>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#14253F] mb-6">
          {cityListings.length > 0 ? `${cityListings.length} Accommodation${cityListings.length > 1 ? 's' : ''} in ${city.name}` : `No listings yet for ${city.name}`}
        </h2>

        {cityListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityListings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl border border-[#D8E5F0] bg-white">
            <div className="text-5xl mb-4">🏗️</div>
            <p className="text-[#687A90] text-lg">Listings for {city.name} are coming soon!</p>
            <Link to="/contact" className="mt-4 inline-block text-[#1267C4] hover:underline">Get notified when available →</Link>
          </div>
        )}
      </div>
    </main>
  );
}
