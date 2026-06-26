import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Building2, Home, Key, SlidersHorizontal, X, Calendar, Map } from 'lucide-react';
import SEO from '../components/SEO';
import ListingCard from '../components/ListingCard';
import { useData } from '../contexts/DataContext';
import { HOST_CITIES } from '../data/constants';

const typeFilters = [
  { value: 'all', label: 'All Types', icon: SlidersHorizontal },
  { value: 'hotel', label: 'Hotels', icon: Building2 },
  { value: 'apartment', label: 'Apartments', icon: Home },
  { value: 'shortlet', label: 'Shortlets', icon: Key },
];

const priceRanges = [
  { value: 'all', label: 'Any Price' },
  { value: 'budget', label: 'Under $200' },
  { value: 'mid', label: '$200 - $350' },
  { value: 'premium', label: '$350+' },
];

const ITEMS_PER_PAGE = 12;

export default function Listings() {
  const { listings } = useData();
  const [typeFilter, setTypeFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      if (typeFilter !== 'all' && l.type !== typeFilter) return false;
      if (cityFilter !== 'all' && l.cityId !== cityFilter) return false;
      if (priceFilter === 'budget' && l.price >= 200) return false;
      if (priceFilter === 'mid' && (l.price < 200 || l.price > 350)) return false;
      if (priceFilter === 'premium' && l.price < 350) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return l.title.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [listings, typeFilter, cityFilter, priceFilter, searchQuery]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const uniqueCities = [...new Set(HOST_CITIES.map(c => ({ id: c.id, name: c.name })))];

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Accommodations" description="Browse hotels, apartments & shortlets for FIFA World Cup 2026 across 16 host cities." path="/listings" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            World Cup 2026{' '}
            <span className="bg-gradient-to-r from-amber-300 to-red-400 bg-clip-text text-transparent">
              Accommodations
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            {filteredListings.length} properties available
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-6"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 rounded-xl border transition-all flex items-center gap-2 ${
              showFilters
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 transition-all ${viewMode === 'grid' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 transition-all ${viewMode === 'map' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Type filter pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                typeFilter === f.value
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Extended filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">City</label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 appearance-none"
                >
                  <option value="all">All Cities</option>
                  {uniqueCities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Price Range</label>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPriceFilter(p.value)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        priceFilter === p.value
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Dates
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateRange.checkIn}
                    onChange={(e) => setDateRange(prev => ({ ...prev, checkIn: e.target.value }))}
                    placeholder="Check-in"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                  />
                  <input
                    type="date"
                    value={dateRange.checkOut}
                    onChange={(e) => setDateRange(prev => ({ ...prev, checkOut: e.target.value }))}
                    placeholder="Check-out"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid View with Pagination */}
        {viewMode === 'grid' && (
          <>
            {paginatedListings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedListings.map((listing, i) => (
                    <ListingCard key={listing.id} listing={listing} index={i} />
                  ))}
                </div>

                {/* ✅ Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    <span className="text-white text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No listings found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => {
                    setTypeFilter('all');
                    setCityFilter('all');
                    setPriceFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  );
}