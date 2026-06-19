import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LISTINGS as DEFAULT_LISTINGS, type Listing } from '../data/constants';

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  userEmail: string;
  userName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  specialRequests?: string;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface DataContextType {
  listings: Listing[];
  bookings: Booking[];
  reviews: Review[];
  isLoading: boolean;
  isDemo: boolean;
  addListing: (listing: Omit<Listing, 'id'>) => Promise<void>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>;
  updateBooking: (id: string, data: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  getUserBookings: (userId: string) => Booking[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  getListingReviews: (listingId: string) => Review[];
  getListingAverageRating: (listingId: string) => number;
  saveContactMessage: (msg: { name: string; email: string; subject: string; message: string; type: string }) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}

// Helper function to generate a unique booking ID
function generateBookingId(): string {
  const prefix = 'ANA';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Supabase row ↔ App model helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function rowToListing(r: Record<string, unknown>): Listing {
  return {
    id: r.id as string,
    title: r.title as string,
    type: r.type as Listing['type'],
    city: r.city as string,
    cityId: r.city_id as string,
    price: r.price as number,
    rating: Number(r.rating) || 0,
    reviews: (r.review_count as number) || 0,
    images: (r.images as string[]) || [],
    amenities: (r.amenities as string[]) || [],
    maxGuests: (r.max_guests as number) || 2,
    bedrooms: (r.bedrooms as number) || 1,
    description: (r.description as string) || '',
    nearestStadium: (r.nearest_stadium as string) || '',
    distanceToStadium: (r.distance_to_stadium as string) || '',
    available: r.available !== false,
  };
}

function listingToRow(l: Omit<Listing, 'id'>) {
  return {
    title: l.title,
    type: l.type,
    city: l.city,
    city_id: l.cityId,
    price: l.price,
    rating: l.rating,
    review_count: l.reviews,
    images: l.images,
    amenities: l.amenities,
    max_guests: l.maxGuests,
    bedrooms: l.bedrooms,
    description: l.description,
    nearest_stadium: l.nearestStadium,
    distance_to_stadium: l.distanceToStadium,
    available: l.available,
  };
}

function rowToBooking(r: Record<string, unknown>): Booking {
  return {
    id: r.id as string,
    listingId: r.listing_id as string,
    userId: r.user_id as string,
    userEmail: r.user_email as string,
    userName: r.user_name as string,
    checkIn: r.check_in as string,
    checkOut: r.check_out as string,
    guests: r.guests as number,
    totalPrice: r.total_price as number,
    status: r.status as Booking['status'],
    specialRequests: (r.special_requests as string) || undefined,
    createdAt: r.created_at as string,
  };
}

function rowToReview(r: Record<string, unknown>): Review {
  return {
    id: r.id as string,
    listingId: r.listing_id as string,
    userId: r.user_id as string,
    userName: r.user_name as string,
    rating: r.rating as number,
    comment: r.comment as string,
    createdAt: r.created_at as string,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PROVIDER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function DataProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDemo = !isSupabaseConfigured;

  // ── Load data on mount ──
  useEffect(() => {
    if (isDemo) {
      const sl = localStorage.getItem('ath_listings');
      const sb = localStorage.getItem('ath_bookings');
      const sr = localStorage.getItem('ath_reviews');
      setListings(sl ? JSON.parse(sl) : DEFAULT_LISTINGS);
      setBookings(sb ? JSON.parse(sb) : []);
      setReviews(sr ? JSON.parse(sr) : []);
      setIsLoading(false);
    } else {
      loadFromSupabase();
    }
  }, [isDemo]);

  // ── Save demo data to localStorage ──
  useEffect(() => {
    if (isDemo && listings.length > 0) {
      localStorage.setItem('ath_listings', JSON.stringify(listings));
    }
  }, [isDemo, listings]);

  useEffect(() => {
    if (isDemo) localStorage.setItem('ath_bookings', JSON.stringify(bookings));
  }, [isDemo, bookings]);

  useEffect(() => {
    if (isDemo) localStorage.setItem('ath_reviews', JSON.stringify(reviews));
  }, [isDemo, reviews]);

  // ── Supabase loaders ──
  async function loadFromSupabase() {
    setIsLoading(true);
    const [listRes, bookRes, revRes] = await Promise.all([
      supabase.from('listings').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
    ]);

    if (listRes.data) setListings(listRes.data.map(rowToListing));
    if (bookRes.data) setBookings(bookRes.data.map(rowToBooking));
    if (revRes.data) setReviews(revRes.data.map(rowToReview));
    setIsLoading(false);
  }

  // ━━━ LISTINGS ━━━

  const addListing = async (listing: Omit<Listing, 'id'>) => {
    if (isDemo) {
      const newListing = { ...listing, id: `listing-${Date.now()}` } as Listing;
      setListings(prev => [...prev, newListing]);
      return;
    }
    const { data, error } = await supabase.from('listings').insert(listingToRow(listing)).select().single();
    if (!error && data) {
      setListings(prev => [...prev, rowToListing(data)]);
    }
  };

  const updateListing = async (id: string, data: Partial<Listing>) => {
    if (isDemo) {
      setListings(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
      return;
    }
    const row: Record<string, unknown> = {};
    if (data.title !== undefined) row.title = data.title;
    if (data.type !== undefined) row.type = data.type;
    if (data.city !== undefined) row.city = data.city;
    if (data.cityId !== undefined) row.city_id = data.cityId;
    if (data.price !== undefined) row.price = data.price;
    if (data.images !== undefined) row.images = data.images;
    if (data.amenities !== undefined) row.amenities = data.amenities;
    if (data.maxGuests !== undefined) row.max_guests = data.maxGuests;
    if (data.bedrooms !== undefined) row.bedrooms = data.bedrooms;
    if (data.description !== undefined) row.description = data.description;
    if (data.nearestStadium !== undefined) row.nearest_stadium = data.nearestStadium;
    if (data.distanceToStadium !== undefined) row.distance_to_stadium = data.distanceToStadium;
    if (data.available !== undefined) row.available = data.available;

    await supabase.from('listings').update(row).eq('id', id);
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteListing = async (id: string) => {
    if (isDemo) {
      setListings(prev => prev.filter(l => l.id !== id));
      return;
    }
    await supabase.from('listings').delete().eq('id', id);
    setListings(prev => prev.filter(l => l.id !== id));
  };

  // ━━━ BOOKINGS ━━━

  const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    const generatedId = generateBookingId();
    
    if (isDemo) {
      const newBooking: Booking = {
        ...booking,
        id: generatedId,
        createdAt: new Date().toISOString(),
      };
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    }

    try {
      const { data, error } = await supabase.from('bookings').insert({
        listing_id: booking.listingId,
        user_id: booking.userId,
        user_email: booking.userEmail,
        user_name: booking.userName,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
        guests: booking.guests,
        total_price: booking.totalPrice,
        status: booking.status,
        special_requests: booking.specialRequests,
      }).select().single();

      if (error || !data) {
        const fallbackBooking: Booking = {
          ...booking,
          id: generatedId,
          createdAt: new Date().toISOString(),
        };
        setBookings(prev => [...prev, fallbackBooking]);
        return fallbackBooking;
      }

      const newBooking = rowToBooking(data);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (error) {
      const fallbackBooking: Booking = {
        ...booking,
        id: generatedId,
        createdAt: new Date().toISOString(),
      };
      setBookings(prev => [...prev, fallbackBooking]);
      return fallbackBooking;
    }
  };

  const updateBooking = async (id: string, data: Partial<Booking>) => {
    if (isDemo) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
      return;
    }
    const row: Record<string, unknown> = {};
    if (data.status !== undefined) row.status = data.status;
    await supabase.from('bookings').update(row).eq('id', id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const cancelBooking = async (id: string) => {
    await updateBooking(id, { status: 'cancelled' });
  };

  const getUserBookings = useCallback((userId: string) => {
    return bookings
      .filter(b => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings]);

  // ━━━ REVIEWS ━━━

  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    if (isDemo) {
      const newReview: Review = {
        ...review,
        id: `review-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setReviews(prev => [...prev, newReview]);
      return;
    }

    const { data, error } = await supabase.from('reviews').insert({
      listing_id: review.listingId,
      user_id: review.userId,
      user_name: review.userName,
      rating: review.rating,
      comment: review.comment,
    }).select().single();

    if (!error && data) {
      setReviews(prev => [...prev, rowToReview(data)]);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (isDemo) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      return;
    }
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    if (!error) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    }
  };

  const getListingReviews = useCallback((listingId: string) => {
    return reviews
      .filter(r => r.listingId === listingId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [reviews]);

  const getListingAverageRating = useCallback((listingId: string) => {
    const lr = reviews.filter(r => r.listingId === listingId);
    if (lr.length === 0) return 0;
    return lr.reduce((sum, r) => sum + r.rating, 0) / lr.length;
  }, [reviews]);

  // ━━━ CONTACT ━━━

  const saveContactMessage = async (msg: { name: string; email: string; subject: string; message: string; type: string }) => {
    if (isDemo) {
      const msgs = JSON.parse(localStorage.getItem('ath_contacts') || '[]');
      msgs.push({ ...msg, id: `msg-${Date.now()}`, createdAt: new Date().toISOString() });
      localStorage.setItem('ath_contacts', JSON.stringify(msgs));
      return;
    }
    await supabase.from('contact_messages').insert(msg);
  };

  return (
    <DataContext.Provider value={{
      listings,
      bookings,
      reviews,
      isLoading,
      isDemo,
      addListing,
      updateListing,
      deleteListing,
      addBooking,
      updateBooking,
      cancelBooking,
      getUserBookings,
      addReview,
      deleteReview,
      getListingReviews,
      getListingAverageRating,
      saveContactMessage,
    }}>
      {children}
    </DataContext.Provider>
  );
}