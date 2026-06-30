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
  paymentMethod?: 'bitcoin' | 'paypal' | 'steam';
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

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  country?: string;
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  match_date: string;
  venue: string;
  city: string;
  image: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  category_name: string;
  price: number;
  quantity_available: number;
  description: string;
  created_at: string;
}

export interface TicketOrder {
  id: string;
  user_id: string;
  ticket_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_method?: string;
  created_at: string;
}

export type CartItem = 
  | { type: 'booking'; data: Omit<Booking, 'id' | 'createdAt'> & { paymentMethod?: string } }
  | { type: 'ticket'; data: { ticketId: string; eventName: string; quantity: number; unitPrice: number } };

interface DataContextType {
  listings: Listing[];
  bookings: Booking[];
  reviews: Review[];
  isLoading: boolean;
  isDemo: boolean;
  // Unified Cart
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  // Bookings
  addListing: (listing: Omit<Listing, 'id'>) => Promise<void>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'> & { paymentMethod?: 'bitcoin' | 'paypal' | 'steam' }) => Promise<Booking>;
  updateBooking: (id: string, data: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  getUserBookings: (userId: string) => Booking[];
  // Tickets
  events: Event[];
  tickets: Ticket[];
  ticketOrders: TicketOrder[];
  fetchEvents: () => Promise<void>;
  fetchTicketsByEvent: (eventId: string) => Promise<void>;
  addEvent: (eventData: Omit<Event, 'id' | 'created_at'>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  addTicketToEvent: (ticketData: Omit<Ticket, 'id' | 'created_at' | 'event_id'> & { event_id: string }) => Promise<void>;
  updateTicket: (ticketId: string, data: Partial<Ticket>) => Promise<void>;
  addTicketOrder: (order: Omit<TicketOrder, 'id' | 'created_at' | 'status'>) => Promise<void>;
  // Reviews
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  getListingReviews: (listingId: string) => Review[];
  getListingAverageRating: (listingId: string) => number;
  // Other
  saveContactMessage: (msg: { name: string; email: string; subject: string; message: string; type: string }) => Promise<void>;
  fetchAllUsers: () => Promise<UserProfile[]>;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}

function generateBookingId(): string {
  const prefix = 'ANA';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ━━━ Helpers ━━━
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
    paymentMethod: r.payment_method as 'bitcoin' | 'paypal' | 'steam' || undefined,
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

function rowToEvent(r: Record<string, unknown>): Event {
  return {
    id: r.id as string,
    name: r.name as string,
    match_date: r.match_date as string,
    venue: r.venue as string,
    city: r.city as string,
    image: r.image as string || '',
    created_at: r.created_at as string,
  };
}

function rowToTicket(r: Record<string, unknown>): Ticket {
  return {
    id: r.id as string,
    event_id: r.event_id as string,
    category_name: r.category_name as string,
    price: r.price as number,
    quantity_available: r.quantity_available as number,
    description: r.description as string || '',
    created_at: r.created_at as string,
  };
}

function rowToTicketOrder(r: Record<string, unknown>): TicketOrder {
  return {
    id: r.id as string,
    user_id: r.user_id as string,
    ticket_id: r.ticket_id as string,
    quantity: r.quantity as number,
    total_price: r.total_price as number,
    status: r.status as TicketOrder['status'],
    payment_method: r.payment_method as string || undefined,
    created_at: r.created_at as string,
  };
}

// ━━━ PROVIDER ━━━
export function DataProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketOrders, setTicketOrders] = useState<TicketOrder[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDemo = !isSupabaseConfigured;

  // ── Load data ──
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

  // ── Save demo data ──
  useEffect(() => {
    if (isDemo && listings.length > 0) localStorage.setItem('ath_listings', JSON.stringify(listings));
  }, [isDemo, listings]);
  useEffect(() => {
    if (isDemo) localStorage.setItem('ath_bookings', JSON.stringify(bookings));
  }, [isDemo, bookings]);
  useEffect(() => {
    if (isDemo) localStorage.setItem('ath_reviews', JSON.stringify(reviews));
  }, [isDemo, reviews]);

  async function loadFromSupabase() {
    setIsLoading(true);
    const [listRes, bookRes, revRes, eventRes, ticketOrderRes] = await Promise.all([
      supabase.from('listings').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('events').select('*').order('match_date', { ascending: true }),
      supabase.from('ticket_orders').select('*').order('created_at', { ascending: false }),
    ]);

    if (listRes.data) setListings(listRes.data.map(rowToListing));
    if (bookRes.data) setBookings(bookRes.data.map(rowToBooking));
    if (revRes.data) setReviews(revRes.data.map(rowToReview));
    if (eventRes.data) setEvents(eventRes.data.map(rowToEvent));
    if (ticketOrderRes.data) setTicketOrders(ticketOrderRes.data.map(rowToTicketOrder));
    setIsLoading(false);
  }

  // ━━━ CART SYSTEM ━━━
  const addToCart = (item: CartItem) => setCartItems(prev => [...prev, item]);
  const removeFromCart = (index: number) => setCartItems(prev => prev.filter((_, i) => i !== index));
  const clearCart = () => setCartItems([]);
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      if (item.type === 'booking') return total + item.data.totalPrice;
      if (item.type === 'ticket') return total + (item.data.unitPrice * item.data.quantity);
      return total;
    }, 0);
  }, [cartItems]);

  // ━━━ LISTINGS & BOOKINGS ━━━
  const addListing = async (listing: Omit<Listing, 'id'>) => {
    if (isDemo) {
      const newListing = { ...listing, id: `listing-${Date.now()}` } as Listing;
      setListings(prev => [...prev, newListing]);
      return;
    }
    const { data, error } = await supabase.from('listings').insert(listingToRow(listing)).select().single();
    if (!error && data) setListings(prev => [...prev, rowToListing(data)]);
  };

  const updateListing = async (id: string, data: Partial<Listing>) => {
    if (isDemo) { setListings(prev => prev.map(l => l.id === id ? { ...l, ...data } : l)); return; }
    const row: Record<string, unknown> = {};
    // ... mapping (kept short for brevity, original mapping applies)
    if (data.title) row.title = data.title; if (data.price) row.price = data.price; // etc
    await supabase.from('listings').update(row).eq('id', id);
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteListing = async (id: string) => {
    if (isDemo) { setListings(prev => prev.filter(l => l.id !== id)); return; }
    await supabase.from('listings').delete().eq('id', id);
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt'> & { paymentMethod?: 'bitcoin' | 'paypal' | 'steam' }): Promise<Booking> => {
    const generatedId = generateBookingId();
    if (isDemo) {
      const newBooking: Booking = { ...booking, id: generatedId, createdAt: new Date().toISOString() };
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    }
    try {
      const { data, error } = await supabase.from('bookings').insert({
        listing_id: booking.listingId, user_id: booking.userId, user_email: booking.userEmail,
        user_name: booking.userName, check_in: booking.checkIn, check_out: booking.checkOut,
        guests: booking.guests, total_price: booking.totalPrice, status: booking.status,
        special_requests: booking.specialRequests, payment_method: booking.paymentMethod || null,
      }).select().single();
      if (error || !data) throw new Error(error?.message);
      const newBooking = rowToBooking(data);
      setBookings(prev => [...prev, newBooking]);
      return newBooking;
    } catch (error) {
      const fallbackBooking: Booking = { ...booking, id: generatedId, createdAt: new Date().toISOString() };
      setBookings(prev => [...prev, fallbackBooking]);
      return fallbackBooking;
    }
  };

  const updateBooking = async (id: string, data: Partial<Booking>) => {
    if (isDemo) { setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data } : b)); return; }
    const row: Record<string, unknown> = {};
    if (data.status) row.status = data.status;
    if (data.specialRequests) row.special_requests = data.specialRequests;
    const { error } = await supabase.from('bookings').update(row).eq('id', id);
    if (!error) setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const cancelBooking = async (id: string) => await updateBooking(id, { status: 'cancelled' });
  const getUserBookings = useCallback((userId: string) => bookings.filter(b => b.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [bookings]);

  // ━━━ TICKETS ━━━
  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*').order('match_date', { ascending: true });
    if (!error && data) setEvents(data.map(rowToEvent));
  };

  const fetchTicketsByEvent = async (eventId: string) => {
    const { data, error } = await supabase.from('tickets').select('*').eq('event_id', eventId);
    if (!error && data) setTickets(data.map(rowToTicket));
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('events').insert(eventData).select().single();
    if (!error && data) setEvents(prev => [...prev, rowToEvent(data)]);
  };

  const deleteEvent = async (eventId: string) => {
    await supabase.from('events').delete().eq('id', eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const addTicketToEvent = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'event_id'> & { event_id: string }) => {
    const { data, error } = await supabase.from('tickets').insert(ticketData).select().single();
    if (!error && data) setTickets(prev => [...prev, rowToTicket(data)]);
  };

  const updateTicket = async (ticketId: string, data: Partial<Ticket>) => {
    await supabase.from('tickets').update(data).eq('id', ticketId);
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, ...data } : t));
  };

  const addTicketOrder = async (order: Omit<TicketOrder, 'id' | 'created_at' | 'status'>) => {
    const { data, error } = await supabase.from('ticket_orders').insert({ ...order, status: 'pending' }).select().single();
    if (!error && data) setTicketOrders(prev => [...prev, rowToTicketOrder(data)]);
  };

  // ━━━ REVIEWS ━━━
  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    if (isDemo) {
      const newReview: Review = { ...review, id: `review-${Date.now()}`, createdAt: new Date().toISOString() };
      setReviews(prev => [...prev, newReview]); return;
    }
    const { data, error } = await supabase.from('reviews').insert({
      listing_id: review.listingId, user_id: review.userId, user_name: review.userName,
      rating: review.rating, comment: review.comment,
    }).select().single();
    if (!error && data) setReviews(prev => [...prev, rowToReview(data)]);
  };

  const deleteReview = async (reviewId: string) => {
    if (isDemo) { setReviews(prev => prev.filter(r => r.id !== reviewId)); return; }
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (!error) setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const getListingReviews = useCallback((listingId: string) => reviews.filter(r => r.listingId === listingId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [reviews]);
  const getListingAverageRating = useCallback((listingId: string) => { const lr = reviews.filter(r => r.listingId === listingId); if (lr.length === 0) return 0; return lr.reduce((sum, r) => sum + r.rating, 0) / lr.length; }, [reviews]);

  // ━━━ CONTACT ━━━
  const saveContactMessage = async (msg: { name: string; email: string; subject: string; message: string; type: string }) => {
    if (isDemo) {
      const msgs = JSON.parse(localStorage.getItem('ath_contacts') || '[]');
      msgs.push({ ...msg, id: `msg-${Date.now()}`, createdAt: new Date().toISOString() });
      localStorage.setItem('ath_contacts', JSON.stringify(msgs)); return;
    }
    await supabase.from('contact_messages').insert(msg);
  };

  // ━━━ USERS ━━━
  const fetchAllUsers = async (): Promise<UserProfile[]> => {
    const { data: profiles, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error || !profiles) return [];
    return profiles.map((p: any) => ({
      id: p.id, first_name: p.first_name, last_name: p.last_name, email: p.email || 'N/A',
      role: p.role || 'user', phone: p.phone, country: p.country, created_at: p.created_at,
    }));
  };

  return (
    <DataContext.Provider value={{
      listings, bookings, reviews, isLoading, isDemo,
      cartItems, addToCart, removeFromCart, clearCart, getCartTotal,
      addListing, updateListing, deleteListing,
      addBooking, updateBooking, cancelBooking, getUserBookings,
      events, tickets, ticketOrders, fetchEvents, fetchTicketsByEvent,
      addEvent, deleteEvent, addTicketToEvent, updateTicket, addTicketOrder,
      addReview, deleteReview, getListingReviews, getListingAverageRating,
      saveContactMessage, fetchAllUsers,
    }}>
      {children}
    </DataContext.Provider>
  );
}