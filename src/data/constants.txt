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
  // BTS ARIRANG from now to January - added countries
  { id: 'bogota', name: 'Bogotá', country: 'Colombia', countryFlag: '🇨🇴', stadium: 'Estadio Nemésio Camacho El Campín', image: IMAGES.stadium, description: 'Bogotá — BTS ARIRANG Latin America leg, high-altitude stadium with huge ARMY energy.' },
  { id: 'lima', name: 'Lima', country: 'Peru', countryFlag: '🇵🇪', stadium: 'Estadio San Marcos', image: IMAGES.fans1, description: 'Lima — BTS ARIRANG Peru dates, university stadium with massive capacity.' },
  { id: 'santiago', name: 'Santiago', country: 'Chile', countryFlag: '🇨🇱', stadium: 'Estadio Nacional Julio Martínez Prádanos', image: IMAGES.stadium, description: 'Santiago — Chile national stadium, BTS ARIRANG headline shows.' },
  { id: 'buenosaires', name: 'Buenos Aires', country: 'Argentina', countryFlag: '🇦🇷', stadium: 'Estadio Único de La Plata', image: IMAGES.fans2, description: 'Buenos Aires / La Plata — Argentina’s premier stadium for BTS ARIRANG.' },
  { id: 'saopaulo', name: 'São Paulo', country: 'Brazil', countryFlag: '🇧🇷', stadium: 'Estádio MorumBIS', image: IMAGES.stadium, description: 'São Paulo — Brazil’s largest city, MorumBIS stadium for BTS ARIRANG finale in LatAm.' },
  { id: 'kaohsiung', name: 'Kaohsiung', country: 'Taiwan', countryFlag: '🇹🇼', stadium: 'Kaohsiung National Stadium', image: IMAGES.hero, description: 'Kaohsiung — Taiwan National Stadium, BTS ARIRANG Asia leg.' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', countryFlag: '🇹🇭', stadium: 'Rajamangala National Stadium', image: IMAGES.vancouver, description: 'Bangkok — Rajamangala Stadium, BTS ARIRANG Thailand shows.' },
  { id: 'kualalumpur', name: 'Kuala Lumpur', country: 'Malaysia', countryFlag: '🇲🇾', stadium: 'Bukit Jalil National Stadium', image: IMAGES.nyc, description: 'Kuala Lumpur — Bukit Jalil, Malaysia’s national stadium for BTS ARIRANG.' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', countryFlag: '🇸🇬', stadium: 'National Stadium', image: IMAGES.nyc, description: 'Singapore — National Stadium, BTS ARIRANG Singapore multi-night run.' },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', countryFlag: '🇮🇩', stadium: 'Gelora Bung Karno Main Stadium', image: IMAGES.hero, description: 'Jakarta — GBK Main Stadium, BTS ARIRANG Indonesia finale before 2027.' },
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
  // Hotels for new BTS cities from now to Jan - each with city hotels option
  {
    id: 'hotel-bogota-001', title: 'Hilton Bogota', type: 'hotel', city: 'Bogotá', cityId: 'bogota', price: 110, rating: 4.6, reviews: 0,
    images: ['/images/hotel-luxury.jpg', '/images/city.jpg'], amenities: ['WiFi', 'Breakfast', 'Gym', 'Pool'], maxGuests: 2, bedrooms: 1,
    description: 'Bogotá hotel near El Campín for BTS ARIRANG. Local currency COP with USD equivalent shown. Conversion rate 1 USD = 4,100 COP.', nearestStadium: 'Estadio El Campín', distanceToStadium: '1.2 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/hotels/bogohhi-hilton-bogota/',
  },
  {
    id: 'hotel-lima-001', title: 'Hilton Lima Miraflores', type: 'hotel', city: 'Lima', cityId: 'lima', price: 125, rating: 4.7, reviews: 0,
    images: ['/images/hotel-room.jpg', '/images/hotel-luxury.jpg'], amenities: ['WiFi', 'Breakfast', 'Ocean View', 'Gym'], maxGuests: 2, bedrooms: 1,
    description: 'Lima Miraflores hotel for BTS ARIRANG at San Marcos. Local PEN with USD equivalent. 1 USD = 3.73 PEN.', nearestStadium: 'Estadio San Marcos', distanceToStadium: '3.5 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/hotels/limmihi-hilton-lima-miraflores/',
  },
  {
    id: 'hotel-santiago-001', title: 'Hilton Garden Inn Santiago Las Condes', type: 'hotel', city: 'Santiago', cityId: 'santiago', price: 95, rating: 4.5, reviews: 0,
    images: ['/images/city.jpg', '/images/hotel-room.jpg'], amenities: ['WiFi', 'Breakfast', 'Gym', 'Bar'], maxGuests: 2, bedrooms: 1,
    description: 'Santiago hotel near Nacional for BTS ARIRANG. Local CLP with USD equivalent. 1 USD = 920 CLP.', nearestStadium: 'Estadio Nacional', distanceToStadium: '2.0 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/hotels/scllcgi-hilton-garden-inn-santiago-las-condes/',
  },
  {
    id: 'hotel-buenosaires-001', title: 'Hilton Buenos Aires', type: 'hotel', city: 'Buenos Aires', cityId: 'buenosaires', price: 140, rating: 4.7, reviews: 0,
    images: ['/images/hotel-luxury.jpg', '/images/apartment.jpg'], amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'], maxGuests: 2, bedrooms: 1,
    description: 'Buenos Aires hotel for BTS ARIRANG La Plata. Local ARS with USD equivalent. 1 USD = 900 ARS.', nearestStadium: 'Estadio Único de La Plata', distanceToStadium: '35 miles from BA center', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/hotels/buehihi-hilton-buenos-aires/',
  },
  {
    id: 'hotel-saopaulo-001', title: 'Hilton São Paulo Morumbi', type: 'hotel', city: 'São Paulo', cityId: 'saopaulo', price: 135, rating: 4.6, reviews: 0,
    images: ['/images/city.jpg', '/images/hotel-luxury.jpg'], amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'], maxGuests: 2, bedrooms: 1,
    description: 'São Paulo Morumbi hotel near MorumBIS for BTS ARIRANG. Local BRL with USD equivalent. 1 USD = 5.2 BRL.', nearestStadium: 'Estádio MorumBIS', distanceToStadium: '1.5 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/hotels/saomohi-hilton-sao-paulo-morumbi/',
  },
  {
    id: 'hotel-kaohsiung-001', title: 'Kaohsiung Marriott Hotel', type: 'hotel', city: 'Kaohsiung', cityId: 'kaohsiung', price: 115, rating: 4.6, reviews: 0,
    images: ['/images/hotel-room.jpg', '/images/city.jpg'], amenities: ['WiFi', 'Pool', 'Gym', 'Breakfast'], maxGuests: 2, bedrooms: 1,
    description: 'Kaohsiung hotel near National Stadium for BTS ARIRANG. Local TWD with USD equivalent. 1 USD = 32 TWD.', nearestStadium: 'Kaohsiung National Stadium', distanceToStadium: '0.9 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.marriott.com/en-us/hotels/khhak-kaohsiung-marriott-hotel/',
  },
  {
    id: 'hotel-bangkok-001', title: 'Hilton Sukhumvit Bangkok', type: 'hotel', city: 'Bangkok', cityId: 'bangkok', price: 85, rating: 4.6, reviews: 0,
    images: ['/images/hotel-luxury.jpg', '/images/hotel-room.jpg'], amenities: ['WiFi', 'Pool', 'Spa', 'Rooftop'], maxGuests: 2, bedrooms: 1,
    description: 'Bangkok Sukhumvit hotel for BTS ARIRANG Rajamangala. Local THB with USD equivalent. 1 USD = 36 THB.', nearestStadium: 'Rajamangala National Stadium', distanceToStadium: '4.2 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/hotels/bkkshhi-hilton-sukhumvit-bangkok/',
  },
  {
    id: 'hotel-kl-001', title: 'Hilton Kuala Lumpur', type: 'hotel', city: 'Kuala Lumpur', cityId: 'kualalumpur', price: 90, rating: 4.6, reviews: 0,
    images: ['/images/city.jpg', '/images/hotel-luxury.jpg'], amenities: ['WiFi', 'Pool', 'Gym', 'Breakfast'], maxGuests: 2, bedrooms: 1,
    description: 'Kuala Lumpur hotel near Bukit Jalil for BTS ARIRANG. Local MYR with USD equivalent. 1 USD = 4.7 MYR.', nearestStadium: 'Bukit Jalil National Stadium', distanceToStadium: '2.8 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/hotels/kulhihi-hilton-kuala-lumpur/',
  },
  {
    id: 'hotel-singapore-001', title: 'Hilton Singapore Orchard', type: 'hotel', city: 'Singapore', cityId: 'singapore', price: 210, rating: 4.7, reviews: 0,
    images: ['/images/hotel-room.jpg', '/images/hotel-luxury.jpg'], amenities: ['WiFi', 'Pool', 'Gym', 'Orchard Road'], maxGuests: 2, bedrooms: 1,
    description: 'Singapore Orchard hotel near National Stadium for BTS ARIRANG. Local SGD with USD equivalent. 1 USD = 1.32 SGD.', nearestStadium: 'National Stadium', distanceToStadium: '1.1 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/hotels/sinorhi-hilton-singapore-orchard/',
  },
  {
    id: 'hotel-jakarta-001', title: 'Hilton Garden Inn Jakarta Taman Palem', type: 'hotel', city: 'Jakarta', cityId: 'jakarta', price: 65, rating: 4.5, reviews: 0,
    images: ['/images/apartment.jpg', '/images/hotel-room.jpg'], amenities: ['WiFi', 'Pool', 'Gym', 'Breakfast'], maxGuests: 2, bedrooms: 1,
    description: 'Jakarta hotel near GBK for BTS ARIRANG. Local IDR with USD equivalent. 1 USD = 16,000 IDR.', nearestStadium: 'Gelora Bung Karno Main Stadium', distanceToStadium: '1.3 miles', available: true, priceIsFrom: true, imageIsIllustrative: true, sourceUrl: 'https://www.hilton.com/en/hotels/cgkpagi-hilton-garden-inn-jakarta-taman-palem/',
  },
];
