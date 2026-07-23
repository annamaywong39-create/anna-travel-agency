import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Building2, Home, Key, SlidersHorizontal, Calendar, Grid3X3 } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ checkIn: '', checkOut: '' });

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

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const uniqueCities = [...new Set(HOST_CITIES.map(c => ({ id: c.id, name: c.name })))];

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Accommodations" description="Browse hotels, apartments & shortlets worldwide." path="/listings" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-[#0a0a1a] via-[#14142a] to-[#0a0a1a] border border-white/10 p-8 md:p-12"
        >
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
              Find Your Perfect Stay
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              {filteredListings.length} properties available – from luxury hotels to cozy apartments.
            </p>
            
            {/* Quick Search */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-3xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by city, property name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 rounded-xl border transition-all flex items-center gap-2 ${
                  showFilters
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {(typeFilter !== 'all' || cityFilter !== 'all' || priceFilter !== 'all') && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
              <div className="flex rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-all ${viewMode === 'grid' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-all ${viewMode === 'list' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
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
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setCityFilter('all');
                  setPriceFilter('all');
                  setSearchQuery('');
                  setDateRange({ checkIn: '', checkOut: '' });
                }}
                className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 text-sm transition-all"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            Showing <span className="text-white font-medium">{paginatedListings.length}</span> of{' '}
            <span className="text-white font-medium">{filteredListings.length}</span> properties
          </p>
          {totalPages > 1 && (
            <span className="text-gray-500 text-sm">Page {currentPage} of {totalPages}</span>
          )}
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <>
            {paginatedListings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedListings.map((listing, i) => (
                    <ListingCard key={listing.id} listing={listing} index={i} />
                  ))}
                </div>

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
                    setDateRange({ checkIn: '', checkOut: '' });
                  }}
                  className="px-6 py-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {paginatedListings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
            {paginatedListings.length === 0 && (
              <div className="py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No listings found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
