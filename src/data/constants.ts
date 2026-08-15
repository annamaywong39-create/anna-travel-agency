export const IMAGES = {
  hero: '/images/hero.jpg',
  stadium: '/images/stadium.jpg',
  fans1: '/images/fans.jpg',
  fans2: '/images/fans.jpg',
  hotel1: '/images/hotel-luxury.jpg',
  hotel2: '/images/hotel-room.jpg',
  hotel3: 'https://images.pexels.com/photos/8134808/pexels-photo-8134808.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  apartment1: '/images/apartment.jpg',
  apartment2: '/images/apartment-2.jpg',
  apartment3: 'https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  nyc: '/images/city.jpg',
  mexico: 'https://images.pexels.com/photos/20624534/pexels-photo-20624534.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  monterrey: 'https://images.pexels.com/photos/16652814/pexels-photo-16652814.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  toronto: 'https://images.pexels.com/photos/25696388/pexels-photo-25696388.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  vancouver: 'https://images.pexels.com/photos/38104077/pexels-photo-38104077.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
};

export interface HostCity {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  stadium: string;
  image: string;
  description: string;
}

export const HOST_CITIES: HostCity[] = [
  { id: 'baltimore', name: 'Baltimore', country: 'USA', countryFlag: '🇺🇸', stadium: 'M&T Bank Stadium', image: IMAGES.hero, description: 'Historic harbor city and home of M&T Bank Stadium — hosting major concerts and sporting events.' },
  { id: 'dallas', name: 'Arlington / Dallas', country: 'USA', countryFlag: '🇺🇸', stadium: 'AT&T Stadium', image: IMAGES.fans2, description: 'Texas live-event hub with AT&T Stadium and easy access to Dallas-Fort Worth.' },
  { id: 'chicago', name: 'Chicago', country: 'USA', countryFlag: '🇺🇸', stadium: 'Soldier Field', image: IMAGES.fans1, description: 'Lakefront city with Soldier Field and a full calendar of concerts and sports.' },
  { id: 'la', name: 'Los Angeles / Inglewood', country: 'USA', countryFlag: '🇺🇸', stadium: 'SoFi Stadium', image: IMAGES.vancouver, description: 'SoFi Stadium district — major destination for concerts and large-scale events.' },
  { id: 'nyc', name: 'New York / New Jersey', country: 'USA', countryFlag: '🇺🇸', stadium: 'MetLife Stadium', image: IMAGES.nyc, description: 'The New York metro area with MetLife Stadium and year-round events.' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', countryFlag: '🇨🇦', stadium: 'Rogers Stadium', image: IMAGES.toronto, description: 'Canada’s largest city with Rogers Stadium and waterfront venues.' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', countryFlag: '🇨🇦', stadium: 'BC Place', image: IMAGES.vancouver, description: 'Coastal city with BC Place and mountain views.' },
  { id: 'atlanta', name: 'Atlanta', country: 'USA', countryFlag: '🇺🇸', stadium: 'Mercedes-Benz Stadium', image: IMAGES.stadium, description: 'Southern hub with Mercedes-Benz Stadium and vibrant live-event scene.' },
];

export interface Listing {
  id: string;
  title: string;
  type: 'hotel' | 'apartment' | 'shortlet';
  city: string;
  cityId: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  description: string;
  nearestStadium: string;
  distanceToStadium: string;
  available: boolean;
  priceIsFrom?: boolean;
  sourceUrl?: string;
  imageIsIllustrative?: boolean;
}

export const LISTINGS: Listing[] = [
  {
    id: '4791c4c6-6a34-47b9-8f0b-4c82cfde1fed', title: 'Miami Group Villa', type: 'shortlet', city: 'Miami', cityId: 'miami', price: 157, rating: 4.8, reviews: 45,
    images: ['/images/apartment.jpg', '/images/hotel-luxury.jpg'], amenities: ['WiFi', 'Pool', 'Kitchen', 'BBQ'], maxGuests: 10, bedrooms: 5,
    description: 'A spacious group villa with a private pool and easy access to Miami event venues.', nearestStadium: 'Hard Rock Stadium', distanceToStadium: '7 miles', available: true,
  },
  {
    id: '48652394-2f74-4647-9f63-21a00337cbc4', title: 'NYC Group Shortlet', type: 'shortlet', city: 'New York', cityId: 'nyc', price: 450, rating: 4.9, reviews: 34,
    images: ['/images/city.jpg', '/images/apartment-2.jpg'], amenities: ['WiFi', 'Kitchen', 'Washer', 'TV'], maxGuests: 8, bedrooms: 4,
    description: 'A comfortable group stay for visitors attending major events in the New York area.', nearestStadium: 'MetLife Stadium', distanceToStadium: '12 miles', available: true,
  },
  {
    id: '7d8e4286-fad1-48de-a59b-434f130645fd', title: 'Dallas Ranch House', type: 'shortlet', city: 'Dallas', cityId: 'dallas', price: 320, rating: 4.4, reviews: 12,
    images: ['/images/hero.jpg', '/images/apartment.jpg'], amenities: ['WiFi', 'Pool', 'Kitchen', 'BBQ'], maxGuests: 8, bedrooms: 4,
    description: 'A relaxed ranch-style home for families and groups visiting Arlington events.', nearestStadium: 'AT&T Stadium', distanceToStadium: '10 miles', available: true,
  },
  {
    id: '5024d93e-b493-4934-bdc7-fa35cf347883', title: 'Atlanta Fan House', type: 'shortlet', city: 'Atlanta', cityId: 'atlanta', price: 340, rating: 4.6, reviews: 18,
    images: ['/images/hotel-room.jpg', '/images/apartment-2.jpg'], amenities: ['WiFi', 'Kitchen', 'BBQ', 'Parking'], maxGuests: 8, bedrooms: 4,
    description: 'A group-friendly home close to Atlanta sporting and entertainment venues.', nearestStadium: 'Mercedes-Benz Stadium', distanceToStadium: '4 miles', available: true,
  },
  {
    id: '2f358854-e88b-4583-b94a-012e12d138d7', title: 'CDMX Rooftop Shortlet', type: 'shortlet', city: 'Mexico City', cityId: 'mexico', price: 200, rating: 4.7, reviews: 34,
    images: ['/images/city.jpg', '/images/apartment.jpg'], amenities: ['WiFi', 'Kitchen', 'Rooftop', 'BBQ'], maxGuests: 6, bedrooms: 3,
    description: 'A bright rooftop stay for travellers exploring Mexico City and major events.', nearestStadium: 'Estadio Azteca', distanceToStadium: '6 miles', available: true,
  },
  {
    id: '0bd4fc07-26c7-450b-86ed-451a25a283c1', title: 'Toronto Group Loft', type: 'shortlet', city: 'Toronto', cityId: 'toronto', price: 380, rating: 4.8, reviews: 28,
    images: ['/images/apartment-2.jpg', '/images/city.jpg'], amenities: ['WiFi', 'Kitchen', 'Washer', 'TV'], maxGuests: 8, bedrooms: 4,
    description: 'A modern Toronto loft for groups attending concerts, football, and city events.', nearestStadium: 'BMO Field', distanceToStadium: '1 mile', available: true,
  },
  {
    id: 'ad9eb6c4-36fe-49a3-b70a-fdbb3590a541', title: 'Vancouver Mountain View', type: 'apartment', city: 'Vancouver', cityId: 'vancouver', price: 360, rating: 4.7, reviews: 19,
    images: ['/images/city.jpg', '/images/hotel-luxury.jpg'], amenities: ['WiFi', 'Kitchen', 'Balcony', 'Washer'], maxGuests: 6, bedrooms: 3,
    description: 'A calm mountain-view apartment for visitors planning a Vancouver event trip.', nearestStadium: 'BC Place', distanceToStadium: '2 miles', available: true,
  },
  {
    id: '9b4d5dcf-ef55-486d-ad28-020b92c88352', title: 'Brickell Luxury Apartment', type: 'apartment', city: 'Miami', cityId: 'miami', price: 340, rating: 4.7, reviews: 89,
    images: ['/images/hotel-luxury.jpg', '/images/apartment.jpg'], amenities: ['WiFi', 'Pool', 'Kitchen', 'Gym'], maxGuests: 4, bedrooms: 2,
    description: 'A polished Brickell apartment for couples and small groups who want a central base.', nearestStadium: 'Hard Rock Stadium', distanceToStadium: '9 miles', available: true,
  },
  {
    id: 'bd563210-6f59-4a5f-8065-d33dbfceaeb7', title: 'Downtown Dallas Loft', type: 'apartment', city: 'Dallas', cityId: 'dallas', price: 200, rating: 4.3, reviews: 34,
    images: ['/images/apartment.jpg', '/images/city.jpg'], amenities: ['WiFi', 'Kitchen', 'Pool', 'Gym'], maxGuests: 4, bedrooms: 2,
    description: 'A convenient downtown loft with easy access to restaurants and city transport.', nearestStadium: 'AT&T Stadium', distanceToStadium: '15 miles', available: true,
  },
  {
    id: '96d44de2-076e-4235-bd9b-f5e3014fd16e', title: 'Polanco Luxury Apartment', type: 'apartment', city: 'Mexico City', cityId: 'mexico', price: 150, rating: 4.9, reviews: 203,
    images: ['/images/apartment-2.jpg', '/images/hotel-room.jpg'], amenities: ['WiFi', 'Kitchen', 'Rooftop', 'Gym'], maxGuests: 4, bedrooms: 2,
    description: 'A well-reviewed Polanco apartment with a refined neighbourhood feel.', nearestStadium: 'Estadio Azteca', distanceToStadium: '9 miles', available: true,
  },
  {
    id: '0d8ae3e4-7f15-4a16-966b-086efea9ce96', title: 'Roma Norte Retreat', type: 'apartment', city: 'Mexico City', cityId: 'mexico', price: 120, rating: 4.4, reviews: 56,
    images: ['/images/apartment.jpg', '/images/city.jpg'], amenities: ['WiFi', 'Kitchen', 'Garden', 'Washer'], maxGuests: 2, bedrooms: 1,
    description: 'A cosy retreat in Roma Norte for solo travellers and couples.', nearestStadium: 'Estadio Azteca', distanceToStadium: '7 miles', available: true,
  },
  {
    id: 'bc0bba89-bce7-4e77-883c-d2aecc05fb34', title: 'Queen West Suite', type: 'apartment', city: 'Toronto', cityId: 'toronto', price: 210, rating: 4.4, reviews: 45,
    images: ['/images/hotel-room.jpg', '/images/apartment-2.jpg'], amenities: ['WiFi', 'Kitchen', 'Washer', 'TV'], maxGuests: 2, bedrooms: 1,
    description: 'A bright Queen West suite close to dining, culture, and event transport.', nearestStadium: 'BMO Field', distanceToStadium: '3 miles', available: true,
  },
  {
    id: 'hotel-baltimore-001', title: 'Hampton Inn Baltimore-Downtown-Convention Center', type: 'hotel', city: 'Baltimore', cityId: 'baltimore', price: 117, rating: 4.5, reviews: 0,
    images: ['/images/hotel-luxury.jpg', '/images/hotel-room.jpg'], amenities: ['WiFi', 'Front desk', 'Breakfast', 'Parking'], maxGuests: 2, bedrooms: 1,
    description: 'A practical event-stay candidate near M&T Bank Stadium. Representative room image; final room type and price are confirmed before payment.', nearestStadium: 'M&T Bank Stadium', distanceToStadium: '0.8 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/locations/usa/maryland/baltimore/m-and-t-bank-stadium/',
  },
  {
    id: 'hotel-arlington-001', title: 'Hampton Inn & Suites Dallas-Arlington North', type: 'hotel', city: 'Arlington', cityId: 'dallas', price: 91, rating: 4.5, reviews: 0,
    images: ['/images/hotel-room.jpg', '/images/city.jpg'], amenities: ['WiFi', 'Breakfast', 'Parking', 'Indoor pool'], maxGuests: 4, bedrooms: 2,
    description: 'A group-friendly Arlington event-stay candidate near AT&T Stadium. Representative room image; final room type and price are confirmed before payment.', nearestStadium: 'AT&T Stadium', distanceToStadium: '1.7 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/locations/usa/texas/arlington/att-stadium/',
  },
  {
    id: 'hotel-la-001', title: 'The Anthem Los Angeles Stadium District', type: 'hotel', city: 'Inglewood', cityId: 'la', price: 131, rating: 4.5, reviews: 0,
    images: ['/images/hotel-luxury.jpg', '/images/city.jpg'], amenities: ['WiFi', 'Pool', 'Airport access', 'Gym'], maxGuests: 2, bedrooms: 1,
    description: 'A stadium-district hotel candidate for BTS and major SoFi events. Representative room image; final room type and price are confirmed before payment.', nearestStadium: 'SoFi Stadium', distanceToStadium: '0.6 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/locations/usa/california/inglewood/sofi-stadium/',
  },
  {
    id: 'hotel-baltimore-002', title: 'Hilton Baltimore Inner Harbor', type: 'hotel', city: 'Baltimore', cityId: 'baltimore', price: 175, rating: 4.6, reviews: 0,
    images: ['/images/hotel-room.jpg', '/images/hotel-luxury.jpg'], amenities: ['WiFi', 'Pool', 'Gym', 'Connecting rooms'], maxGuests: 4, bedrooms: 2,
    description: 'An Inner Harbor hotel candidate for M&T Bank Stadium event trips. Representative room image; final room type and price are confirmed before payment.', nearestStadium: 'M&T Bank Stadium', distanceToStadium: '0.9 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/locations/usa/maryland/baltimore/m-and-t-bank-stadium/',
  },
  {
    id: 'hotel-baltimore-003', title: 'Canopy by Hilton Baltimore Harbor Point', type: 'hotel', city: 'Baltimore', cityId: 'baltimore', price: 200, rating: 4.6, reviews: 0,
    images: ['/images/city.jpg', '/images/hotel-luxury.jpg'], amenities: ['WiFi', 'Harbor views', 'Gym', 'Restaurant'], maxGuests: 2, bedrooms: 1,
    description: 'A premium Baltimore candidate for travellers who want the Inner Harbor experience near the stadium.', nearestStadium: 'M&T Bank Stadium', distanceToStadium: '1.4 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/locations/usa/maryland/baltimore/m-and-t-bank-stadium/',
  },
  {
    id: 'hotel-arlington-002', title: 'Homewood Suites Dallas-Arlington', type: 'hotel', city: 'Arlington', cityId: 'dallas', price: 103, rating: 4.5, reviews: 0,
    images: ['/images/apartment-2.jpg', '/images/hotel-room.jpg'], amenities: ['WiFi', 'Breakfast', 'Kitchenette', 'Pool'], maxGuests: 4, bedrooms: 2,
    description: 'A suite-style Arlington candidate for families and event groups attending AT&T Stadium.', nearestStadium: 'AT&T Stadium', distanceToStadium: '1.8 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/locations/usa/texas/arlington/att-stadium/',
  },
  {
    id: 'hotel-arlington-003', title: 'Loews Arlington Hotel', type: 'hotel', city: 'Arlington', cityId: 'dallas', price: 289, rating: 4.8, reviews: 0,
    images: ['/images/hotel-luxury.jpg', '/images/city.jpg'], amenities: ['WiFi', 'Pool', 'Spa', 'Concierge'], maxGuests: 2, bedrooms: 1,
    description: 'A premium Arlington candidate for customers seeking a higher-end event weekend.', nearestStadium: 'AT&T Stadium', distanceToStadium: '0.6 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.loewshotels.com/loews-arlington-hotel',
  },
  {
    id: 'hotel-chicago-001', title: 'Hilton Chicago', type: 'hotel', city: 'Chicago', cityId: 'chicago', price: 250, rating: 4.6, reviews: 0,
    images: ['/images/hotel-luxury.jpg', '/images/city.jpg'], amenities: ['WiFi', 'Gym', 'Pool', 'Restaurant'], maxGuests: 2, bedrooms: 1,
    description: 'A downtown Chicago candidate for Soldier Field event weekends. Representative room image; final room type and price are confirmed before payment.', nearestStadium: 'Soldier Field', distanceToStadium: '1.3 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/locations/usa/illinois/chicago/soldier-field/',
  },
  {
    id: 'hotel-chicago-002', title: 'Homewood Suites Chicago Downtown South Loop', type: 'hotel', city: 'Chicago', cityId: 'chicago', price: 169, rating: 4.5, reviews: 0,
    images: ['/images/apartment-2.jpg', '/images/hotel-room.jpg'], amenities: ['WiFi', 'Kitchenette', 'Breakfast', 'Connecting rooms'], maxGuests: 4, bedrooms: 2,
    description: 'A practical suite option for groups attending Soldier Field events.', nearestStadium: 'Soldier Field', distanceToStadium: '1.0 mile', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/locations/usa/illinois/chicago/soldier-field/',
  },
  {
    id: 'hotel-la-002', title: 'Hilton Garden Inn LAX/El Segundo', type: 'hotel', city: 'Inglewood', cityId: 'la', price: 134, rating: 4.4, reviews: 0,
    images: ['/images/hotel-room.jpg', '/images/city.jpg'], amenities: ['WiFi', 'Pool', 'Airport access', 'Gym'], maxGuests: 2, bedrooms: 1,
    description: 'A practical airport-area hotel candidate for SoFi Stadium visitors.', nearestStadium: 'SoFi Stadium', distanceToStadium: '3.5 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/locations/usa/california/inglewood/sofi-stadium/',
  },
  {
    id: 'hotel-la-003', title: 'Homewood Suites by Hilton Los Angeles International Airport', type: 'hotel', city: 'Inglewood', cityId: 'la', price: 162, rating: 4.5, reviews: 0,
    images: ['/images/apartment.jpg', '/images/hotel-room.jpg'], amenities: ['WiFi', 'Breakfast', 'Kitchenette', 'Pool'], maxGuests: 4, bedrooms: 2,
    description: 'A suite-style option for families and groups travelling to SoFi Stadium.', nearestStadium: 'SoFi Stadium', distanceToStadium: '3.1 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/locations/usa/california/inglewood/sofi-stadium/',
  },
];
