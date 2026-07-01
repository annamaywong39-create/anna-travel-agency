import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { HOST_CITIES, type Listing } from '../data/constants';
import Card3D from '../components/Card3D';

const AMENITY_OPTIONS = [/* ... same as before ... */];

export default function AdminListingForm() {
  const { id } = useParams();
  const isEditing = id && id !== 'new';
  const { user } = useAuth();
  const { listings, addListing, updateListing } = useData();
  const navigate = useNavigate();

  const existingListing = isEditing ? listings.find(l => l.id === id) : null;

  const [formData, setFormData] = useState<Omit<Listing, 'id'>>({
    title: '', type: 'hotel', city: '', cityId: '', price: 200, rating: 4.5, reviews: 0,
    images: [''], amenities: [], maxGuests: 2, bedrooms: 1, description: '',
    nearestStadium: '', distanceToStadium: '', available: true,
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    if (existingListing) {
      setFormData({
        ...existingListing,
        price: existingListing.price ?? 0, maxGuests: existingListing.maxGuests ?? 1,
        bedrooms: existingListing.bedrooms ?? 1, rating: existingListing.rating ?? 0,
        reviews: existingListing.reviews ?? 0,
      });
    }
  }, [existingListing]);

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImages = formData.images.filter(img => img.trim() !== '');
    const cleanData = { ...formData, images: cleanImages.length > 0 ? cleanImages : [''] };
    if (isEditing && id) updateListing(id, cleanData);
    else addListing(cleanData);
    navigate('/admin');
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/admin" className="inline-flex items-center gap-2 text-amber-400 text-sm mb-6 hover:underline"><ArrowLeft className="w-4 h-4" /> Back to Admin</Link>
          <h1 className="text-3xl font-black text-white mb-8">{isEditing ? 'Edit Listing' : 'Add New Listing'}</h1>

          <Card3D>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {/* ... (Title, Type, City inputs remain same) ... */}

              {/* ✅ SAFE PRICE INPUT FIX */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Price per night (USD) *</label>
                <input
                  type="number" required min={1}
                  value={formData.price === 0 ? '' : formData.price}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData(prev => ({ ...prev, price: isNaN(val) ? 0 : val }));
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* ✅ SAFE MAX GUESTS INPUT */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Max Guests</label>
                <input
                  type="number" min={1} max={20}
                  value={formData.maxGuests === 0 ? '' : formData.maxGuests}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData(prev => ({ ...prev, maxGuests: isNaN(val) ? 1 : val }));
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* ✅ SAFE BEDROOMS INPUT */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Bedrooms</label>
                <input
                  type="number" min={1} max={10}
                  value={formData.bedrooms === 0 ? '' : formData.bedrooms}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData(prev => ({ ...prev, bedrooms: isNaN(val) ? 1 : val }));
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* ... (Remaining Image, Description, Amenity inputs stay same) ... */}
              <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> {isEditing ? 'Update Listing' : 'Create Listing'}
              </button>
            </form>
          </Card3D>
        </motion.div>
      </div>
    </main>
  );
}