import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LISTINGS as DEFAULT_LISTINGS, type Listing } from '../data/constants';
import { FEATURED_US_EVENTS } from '../data/events';

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

export interface TicketOrder {
  id: string;
  userId: string;
  ticketId: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface CartItem {
  id: string;
  type: 'room' | 'ticket';
  item: any;
  quantity: number;
  price: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  venue: string;
  city: string;
  image_url?: string;
  status: 'upcoming' | 'live' | 'finished';
  category?: string;
  created_at: string;
}

export interface EventTicket {
  id: string;
  event_id: string;
  category_name: string;
  price: number;
  quantity_available: number;
  created_at: string;
}

interface DataContextType {
  listings: Listing[];
  bookings: Booking[];
  reviews: Review[];
  ticketOrders: TicketOrder[];
  isLoading: boolean;
  isDemo: boolean;

  // Listings
  addListing: (listing: Omit<Listing, 'id'>) => Promise<void>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;

  // Bookings
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'> & { paymentMethod?: 'bitcoin' | 'paypal' | 'steam' }) => Promise<Booking>;
  updateBooking: (id: string, data: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  getUserBookings: (userId: string) => Booking[];

  // Ticket Orders
  addTicketOrder: (order: Omit<TicketOrder, 'id' | 'createdAt'>) => Promise<TicketOrder>;
  updateTicketOrder: (id: string, data: Partial<TicketOrder>) => Promise<void>;
  fetchAllTicketOrders: () => Promise<TicketOrder[]>;

  // Reviews
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  getListingReviews: (listingId: string) => Review[];
  getListingAverageRating: (listingId: string) => number;

  // Contacts
  saveContactMessage: (msg: { name: string; email: string; subject: string; message: string; type: string }) => Promise<void>;

  // Users (admin)
  fetchAllUsers: () => Promise<UserProfile[]>;

  // Matches (for ticket prices)
  fetchMatches: () => Promise<any[]>;
  updateMatchPrices: (matchId: string, updates: Record<string, number>) => Promise<void>;

  // Events
  fetchEvents: () => Promise<Event[]>;
  addEvent: (event: Omit<Event, 'id' | 'created_at'>) => Promise<Event>;
  updateEvent: (id: string, data: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  fetchEventTickets: (eventId: string) => Promise<EventTicket[]>;
  addEventTicket: (ticket: Omit<EventTicket, 'id' | 'created_at'>) => Promise<EventTicket>;
  updateEventTicket: (id: string, data: Partial<EventTicket>) => Promise<void>;
  deleteEventTicket: (id: string) => Promise<void>;

  // Unified Cart
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
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

function generateTicketId(): string {
  const prefix = 'TKT';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ━━━ Row ↔ App model helpers ━━━
function rowToListing(r: Record<string, unknown>): Listing {
  const images = Array.isArray(r.images)
    ? r.images.filter((img): img is string => typeof img === 'string')
    : typeof r.images === 'string'
      ? [r.images]
      : [];

  const amenities = Array.isArray(r.amenities)
    ? r.amenities.filter((item): item is string => typeof item === 'string')
    : typeof r.amenities === 'string'
      ? [r.amenities]
      : [];

  return {
    id: String(r.id ?? ''),
    title: String(r.title ?? 'Untitled listing'),
    type: (r.type as Listing['type']) || 'hotel',
    city: String(r.city ?? ''),
    cityId: String(r.city_id ?? ''),
    price: Number(r.price) || 0,
    rating: Number(r.rating) || 0,
    reviews: Number(r.review_count) || 0,
    images,
    amenities,
    maxGuests: Number(r.max_guests) || 2,
    bedrooms: Number(r.bedrooms) || 1,
    description: String(r.description ?? ''),
    nearestStadium: String(r.nearest_stadium ?? ''),
    distanceToStadium: String(r.distance_to_stadium ?? ''),
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

function rowToTicketOrder(r: Record<string, unknown>): TicketOrder {
  return {
    id: r.id as string,
    userId: r.user_id as string,
    ticketId: r.ticket_id as string,
    quantity: r.quantity as number,
    totalPrice: r.total_price as number,
    paymentMethod: r.payment_method as string,
    status: r.status as TicketOrder['status'],
    createdAt: r.created_at as string,
  };
}

function rowToEvent(r: Record<string, unknown>): Event {
  return {
    id: r.id as string,
    title: r.title as string,
    description: r.description as string || undefined,
    date: r.date as string,
    venue: r.venue as string,
    city: r.city as string,
    image_url: r.image_url as string || undefined,
    status: r.status as Event['status'],
    category: r.category as string || undefined,
    created_at: r.created_at as string,
  };
}

function rowToEventTicket(r: Record<string, unknown>): EventTicket {
  return {
    id: r.id as string,
    event_id: r.event_id as string,
    category_name: r.category_name as string,
    price: r.price as number,
    quantity_available: r.quantity_available as number,
    created_at: r.created_at as string,
  };
}

function getCartItemKey(item: CartItem) {
  if (item.type === 'ticket') {
    return `ticket:${item.item?.ticketId || item.id}`;
  }
  return `room:${item.item?.listingId || item.id}`;
}

// ━━━ Provider ━━━
export function DataProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ticketOrders, setTicketOrders] = useState<TicketOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('ath_cart') || '[]') as CartItem[];
    } catch {
      return [];
    }
  });
  const isDemo = !isSupabaseConfigured;

  // ── Load data on mount ──
  useEffect(() => {
    if (isDemo) {
      const sl = localStorage.getItem('ath_listings');
      const sb = localStorage.getItem('ath_bookings');
      const sr = localStorage.getItem('ath_reviews');
      const sto = localStorage.getItem('ath_ticketOrders');
      setListings(sl ? JSON.parse(sl) : DEFAULT_LISTINGS);
      setBookings(sb ? JSON.parse(sb) : []);
      setReviews(sr ? JSON.parse(sr) : []);
      setTicketOrders(sto ? JSON.parse(sto) : []);
      setIsLoading(false);
    } else {
      loadFromSupabase();
    }
  }, [isDemo]);

  // ── Save demo data to localStorage ──
  useEffect(() => {
    if (isDemo && listings.length > 0) localStorage.setItem('ath_listings', JSON.stringify(listings));
  }, [isDemo, listings]);

  useEffect(() => {
    if (isDemo) localStorage.setItem('ath_bookings', JSON.stringify(bookings));
  }, [isDemo, bookings]);

  useEffect(() => {
    if (isDemo) localStorage.setItem('ath_reviews', JSON.stringify(reviews));
  }, [isDemo, reviews]);

  useEffect(() => {
    if (isDemo) localStorage.setItem('ath_ticketOrders', JSON.stringify(ticketOrders));
  }, [isDemo, ticketOrders]);

  useEffect(() => {
    localStorage.setItem('ath_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ── Supabase loaders ──
  async function loadFromSupabase() {
    setIsLoading(true);
    const [listRes, bookRes, revRes, ticketRes] = await Promise.all([
      supabase.from('listings').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('ticket_orders').select('*').order('created_at', { ascending: false }),
    ]);

    if (listRes.data) setListings(listRes.data.map(rowToListing));
    if (bookRes.data) setBookings(bookRes.data.map(rowToBooking));
    if (revRes.data) setReviews(revRes.data.map(rowToReview));
    if (ticketRes.data) setTicketOrders(ticketRes.data.map(rowToTicketOrder));
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
    if (!error && data) setListings(prev => [...prev, rowToListing(data)]);
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
  const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt'> & { paymentMethod?: 'bitcoin' | 'paypal' | 'steam' }): Promise<Booking> => {
    const generatedId = generateBookingId();
    if (isDemo) {
      const newBooking: Booking = {
        ...booking,
        id: generatedId,
        paymentMethod: booking.paymentMethod,
        createdAt: new Date().toISOString(),
      };
      setBookings(prev => [...prev, newBooking]);
      await sendAdminNotification(newBooking);
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
        payment_method: booking.paymentMethod || null,
      }).select().single();

      if (error || !data) {
        const fallbackBooking: Booking = {
          ...booking,
          id: generatedId,
          paymentMethod: booking.paymentMethod,
          createdAt: new Date().toISOString(),
        };
        setBookings(prev => [...prev, fallbackBooking]);
        await sendAdminNotification(fallbackBooking);
        return fallbackBooking;
      }
      const newBooking = rowToBooking(data);
      setBookings(prev => [...prev, newBooking]);
      await sendAdminNotification(newBooking);
      return newBooking;
    } catch (error) {
      const fallbackBooking: Booking = {
        ...booking,
        id: generatedId,
        paymentMethod: booking.paymentMethod,
        createdAt: new Date().toISOString(),
      };
      setBookings(prev => [...prev, fallbackBooking]);
      await sendAdminNotification(fallbackBooking);
      return fallbackBooking;
    }
  };

  const sendAdminNotification = async (booking: Booking) => {
    try {
      const listing = listings.find(l => l.id === booking.listingId);
      const paymentMethodMap = {
        bitcoin: '₿ Bitcoin',
        paypal: '🅿️ PayPal',
        steam: '🎮 Steam Card',
      };
      await fetch('https://wtktniphfzeltvajpbhb.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'hello@annatravelagency.com',
          template: 'adminBookingNotification',
          data: {
            guestName: booking.userName,
            guestEmail: booking.userEmail,
            propertyName: listing?.title || 'Unknown Property',
            city: listing?.city || 'Unknown City',
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests,
            totalPrice: `$${booking.totalPrice}`,
            bookingId: booking.id,
            paymentMethod: booking.paymentMethod ? paymentMethodMap[booking.paymentMethod] : 'Pending',
          }
        })
      });
    } catch (error) {
      console.error('Failed to send admin notification:', error);
    }
  };

  const updateBooking = async (id: string, data: Partial<Booking>) => {
    if (isDemo) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
      return;
    }
    const row: Record<string, unknown> = {};
    if (data.status !== undefined) row.status = data.status;
    if (data.specialRequests !== undefined) row.special_requests = data.specialRequests;
    const { error } = await supabase.from('bookings').update(row).eq('id', id);
    if (!error) setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const cancelBooking = async (id: string) => updateBooking(id, { status: 'cancelled' });

  const getUserBookings = useCallback((userId: string) => {
    return bookings.filter(b => b.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bookings]);

  // ━━━ TICKET ORDERS ━━━ (FIXED)
  const addTicketOrder = async (order: Omit<TicketOrder, 'id' | 'createdAt'>): Promise<TicketOrder> => {
    const generatedId = generateTicketId();
    
    if (isDemo) {
      const newOrder: TicketOrder = {
        ...order,
        id: generatedId,
        createdAt: new Date().toISOString(),
      };
      setTicketOrders(prev => [...prev, newOrder]);
      return newOrder;
    }

    try {
      // Ensure ticket_id is always a string
      const ticketId = String(order.ticketId || 'ticket-' + generatedId);
      
      const { data, error } = await supabase.from('ticket_orders').insert({
        user_id: order.userId,
        ticket_id: ticketId,
        quantity: order.quantity,
        total_price: order.totalPrice,
        payment_method: order.paymentMethod || 'pending',
        status: order.status || 'pending',
      }).select().single();

      if (error) {
        console.error('❌ Supabase insert error:', error);
        // Fallback - save locally
        const fallback: TicketOrder = {
          ...order,
          id: generatedId,
          createdAt: new Date().toISOString(),
        };
        setTicketOrders(prev => [...prev, fallback]);
        return fallback;
      }

      const newOrder = rowToTicketOrder(data);
      setTicketOrders(prev => [...prev, newOrder]);
      console.log('✅ Ticket order saved:', newOrder);
      return newOrder;
    } catch (err) {
      console.error('❌ addTicketOrder error:', err);
      const fallback: TicketOrder = {
        ...order,
        id: generatedId,
        createdAt: new Date().toISOString(),
      };
      setTicketOrders(prev => [...prev, fallback]);
      return fallback;
    }
  };

  const updateTicketOrder = async (id: string, data: Partial<TicketOrder>) => {
    if (isDemo) {
      setTicketOrders(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
      return;
    }
    const row: Record<string, unknown> = {};
    if (data.status !== undefined) row.status = data.status;
    const { error } = await supabase.from('ticket_orders').update(row).eq('id', id);
    if (!error) setTicketOrders(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const fetchAllTicketOrders = async (): Promise<TicketOrder[]> => {
    if (isDemo) {
      return ticketOrders;
    }
    const { data, error } = await supabase
      .from('ticket_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to fetch ticket orders:', error);
      return [];
    }
    return (data || []).map(rowToTicketOrder);
  };

  // ━━━ REVIEWS ━━━
  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    if (isDemo) {
      const newReview: Review = { ...review, id: `review-${Date.now()}`, createdAt: new Date().toISOString() };
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
    if (!error && data) setReviews(prev => [...prev, rowToReview(data)]);
  };

  const deleteReview = async (reviewId: string) => {
    if (isDemo) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      return;
    }
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (!error) setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const getListingReviews = useCallback((listingId: string) => {
    return reviews.filter(r => r.listingId === listingId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  // ━━━ USERS (Admin) ━━━
  const fetchAllUsers = async (): Promise<UserProfile[]> => {
    if (isDemo) {
      const users = JSON.parse(localStorage.getItem('ath_users') || '[]');
      return users.map((u: any) => ({
        id: u.id,
        first_name: u.firstName,
        last_name: u.lastName,
        email: u.email,
        role: u.role || 'user',
        created_at: u.createdAt || new Date().toISOString(),
      }));
    }

    const { data, error } = await supabase.rpc('get_all_users_with_email');
    if (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
    return data || [];
  };

  // ━━━ MATCHES (Ticket Prices) ━━━
  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .gte('match_date', '2026-07-01')
      .order('match_date', { ascending: true });
    if (error) throw error;
    return data || [];
  };

  const updateMatchPrices = async (matchId: string, updates: Record<string, number>) => {
    const { error } = await supabase.from('matches').update(updates).eq('id', matchId);
    if (error) throw error;
  };

  // ━━━ EVENTS ━━━
  const fetchEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    if (error) {
      console.error('Failed to fetch events:', error);
      return FEATURED_US_EVENTS;
    }
    const databaseEvents = (data || []).map(rowToEvent);
    const databaseIds = new Set(databaseEvents.map(event => event.id));
    return [...databaseEvents, ...FEATURED_US_EVENTS.filter(event => !databaseIds.has(event.id))]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const addEvent = async (event: Omit<Event, 'id' | 'created_at'>): Promise<Event> => {
    const { data, error } = await supabase.from('events').insert(event).select().single();
    if (error) throw error;
    return rowToEvent(data);
  };

  const updateEvent = async (id: string, data: Partial<Event>) => {
    const { error } = await supabase.from('events').update(data).eq('id', id);
    if (error) throw error;
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  };

  const fetchEventTickets = async (eventId: string): Promise<EventTicket[]> => {
    const { data, error } = await supabase
      .from('event_tickets')
      .select('*')
      .eq('event_id', eventId)
      .order('price', { ascending: true });
    if (error) throw error;
    return data || [];
  };

  const addEventTicket = async (ticket: Omit<EventTicket, 'id' | 'created_at'>): Promise<EventTicket> => {
    const { data, error } = await supabase.from('event_tickets').insert(ticket).select().single();
    if (error) throw error;
    return rowToEventTicket(data);
  };

  const updateEventTicket = async (id: string, data: Partial<EventTicket>) => {
    const { error } = await supabase.from('event_tickets').update(data).eq('id', id);
    if (error) throw error;
  };

  const deleteEventTicket = async (id: string) => {
    const { error } = await supabase.from('event_tickets').delete().eq('id', id);
    if (error) throw error;
  };

  // ━━━ UNIFIED CART ━━━
  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const cartKey = getCartItemKey(item);
      const existing = prev.find(i => getCartItemKey(i) === cartKey);

      if (existing) {
        return prev.map(i =>
          getCartItemKey(i) === cartKey
            ? { ...i, quantity: i.quantity + item.quantity, price: item.price }
            : i
        );
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ━━━ Context Provider ━━━
  return (
    <DataContext.Provider value={{
      listings,
      bookings,
      reviews,
      ticketOrders,
      isLoading,
      isDemo,
      addListing,
      updateListing,
      deleteListing,
      addBooking,
      updateBooking,
      cancelBooking,
      getUserBookings,
      addTicketOrder,
      updateTicketOrder,
      fetchAllTicketOrders,
      addReview,
      deleteReview,
      getListingReviews,
      getListingAverageRating,
      saveContactMessage,
      fetchAllUsers,
      fetchMatches,
      updateMatchPrices,
      fetchEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      fetchEventTickets,
      addEventTicket,
      updateEventTicket,
      deleteEventTicket,
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
    }}>
      {children}
    </DataContext.Provider>
  );
}
