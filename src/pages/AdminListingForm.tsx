import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { HOST_CITIES, type Listing } from '../data/constants';
import Card3D from '../components/Card3D';

const AMENITY_OPTIONS = [
  'WiFi', 'Pool', 'Gym', 'Parking', 'Kitchen', 'AC', 'TV', 'Washer',
  'Room Service', 'Restaurant', 'Bar', 'Spa', 'Balcony', 'Garden',
  'Beach', 'Mountain View', 'Lake View', 'Security', 'Concierge', 'BBQ',
  'Water Park', 'Business Center', 'Shuttle', 'Breakfast', 'Casino',
  'Music Theme', 'Art Gallery', 'Workspace', 'Terrace', 'Rooftop',
  'Stadium Views', 'Beach Access', 'Waterfront', 'Mountain Views',
  'Exposed Brick', 'Elevator', 'Central Heating', 'Bike Storage',
  'Laundry', 'Kitchen', 'Lake View'
];

export default function AdminListingForm() {
  const { id } = useParams();
  const isEditing = id && id !== 'new';
  const { user } = useAuth();
  const { listings, addListing, updateListing } = useData();
  const navigate = useNavigate();

  const existingListing = isEditing ? listings.find(l => l.id === id) : null;

  const [formData, setFormData] = useState<Omit<Listing, 'id'>>({
    title: '',
    type: 'hotel',
    city: '',
    cityId: '',
    price: 200,
    rating: 4.5,
    reviews: 0,
    images: [''],
    amenities: [],
    maxGuests: 2,
    bedrooms: 1,
    description: '',
    nearestStadium: '',
    distanceToStadium: '',
    available: true,
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    if (existingListing) {
      setFormData(existingListing);
    }
  }, [existingListing]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleCityChange = (cityId: string) => {
    const city = HOST_CITIES.find(c => c.id === cityId);
    if (city) {
      setFormData(prev => ({
        ...prev,
        cityId,
        city: city.name,
        nearestStadium: city.stadium,
      }));
    }
  };

  const handleAddAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
    }
    setNewAmenity('');
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity),
    }));
  };

  // ✅ NEW: Handle image management
  const handleAddImage = () => {
    if (newImage && newImage.trim()) {
      // Remove empty first image if it's the only one
      const filteredImages = formData.images.filter(img => img.trim() !== '');
      setFormData(prev => ({
        ...prev,
        images: [...filteredImages, newImage.trim()],
      }));
      setNewImage('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddImage();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty images before saving
    const cleanImages = formData.images.filter(img => img.trim() !== '');
    const cleanData = {
      ...formData,
      images: cleanImages.length > 0 ? cleanImages : [''],
    };
    
    if (isEditing && id) {
      updateListing(id, cleanData);
    } else {
      addListing(cleanData);
    }
    
    navigate('/admin');
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/admin" className="inline-flex items-center gap-2 text-amber-400 text-sm mb-6 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </Link>

          <h1 className="text-3xl font-black text-white mb-8">
            {isEditing ? 'Edit Listing' : 'Add New Listing'}
          </h1>

          <Card3D>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400 mb-1 block">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Luxury Suite at The Grand"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Listing['type'] }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="hotel">Hotel</option>
                    <option value="apartment">Apartment</option>
                    <option value="shortlet">Shortlet</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">City *</label>
                  <select
                    value={formData.cityId}
                    onChange={(e) => handleCityChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">Select city</option>
                    {HOST_CITIES.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.countryFlag} {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Price per night (USD) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Max Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.maxGuests}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Bedrooms</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.bedrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Distance to Stadium</label>
                  <input
                    type="text"
                    value={formData.distanceToStadium}
                    onChange={(e) => setFormData(prev => ({ ...prev, distanceToStadium: e.target.value }))}
                    placeholder="5 miles"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {/* ✅ Multiple Images */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Images *</label>
                
                {/* Image list */}
                {formData.images.filter(img => img.trim() !== '').length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                    {formData.images.filter(img => img.trim() !== '').map((img, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={img}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-24 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x150/1a1a2e/666?text=No+Image';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px]">
                          #{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add image input */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="url"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      onKeyDown={handleImageKeyDown}
                      placeholder="https://images.pexels.com/..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={!newImage.trim()}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-amber-500/30"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1">Add multiple image URLs. Press Enter or click + to add.</p>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the property..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 resize-none"
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Amenities</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm flex items-center gap-1"
                    >
                      {amenity}
                      <button type="button" onClick={() => handleRemoveAmenity(amenity)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="">Add amenity...</option>
                    {AMENITY_OPTIONS.filter(a => !formData.amenities.includes(a)).map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleAddAmenity(newAmenity)}
                    className="px-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-600 bg-white/5 text-amber-500 focus:ring-amber-500/20"
                />
                <label htmlFor="available" className="text-gray-300">Available for booking</label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isEditing ? 'Update Listing' : 'Create Listing'}
              </button>
            </form>
          </Card3D>
        </motion.div>
      </div>
    </main>
  );
}