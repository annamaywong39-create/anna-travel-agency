export const IMAGES = {
  hero: 'https://images.pexels.com/photos/38078377/pexels-photo-38078377.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  stadium: 'https://images.pexels.com/photos/19186210/pexels-photo-19186210.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  fans1: 'https://images.pexels.com/photos/31514419/pexels-photo-31514419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  fans2: 'https://images.pexels.com/photos/31514425/pexels-photo-31514425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  hotel1: 'https://images.pexels.com/photos/6434592/pexels-photo-6434592.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  hotel2: 'https://images.pexels.com/photos/14750392/pexels-photo-14750392.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  hotel3: 'https://images.pexels.com/photos/8134808/pexels-photo-8134808.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  apartment1: 'https://images.pexels.com/photos/6920439/pexels-photo-6920439.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  apartment2: 'https://images.pexels.com/photos/7587828/pexels-photo-7587828.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  apartment3: 'https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  nyc: 'https://images.pexels.com/photos/1461370/pexels-photo-1461370.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  mexico: 'https://images.pexels.com/photos/20624534/pexels-photo-20624534.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  monterrey: 'https://images.pexels.com/photos/16652814/pexels-photo-16652814.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  toronto: 'https://images.pexels.com/photos/25696388/pexels-photo-25696388.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  vancouver: 'https://images.pexels.com/photos/38104077/pexels-photo-38104077.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  // Extra gallery images
  bathroom: 'https://images.pexels.com/photos/7167060/pexels-photo-7167060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  lobby: 'https://images.pexels.com/photos/14036253/pexels-photo-14036253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  reception: 'https://images.pexels.com/photos/7821349/pexels-photo-7821349.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  pool: 'https://images.pexels.com/photos/2290754/pexels-photo-2290754.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  gym: 'https://images.pexels.com/photos/35215412/pexels-photo-35215412.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  openplan: 'https://images.pexels.com/photos/8135496/pexels-photo-8135496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  balcony: 'https://images.pexels.com/photos/17000987/pexels-photo-17000987.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  bedroom2: 'https://images.pexels.com/photos/30767888/pexels-photo-30767888.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  bedroom3: 'https://images.pexels.com/photos/8135505/pexels-photo-8135505.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  bedroom4: 'https://images.pexels.com/photos/8089268/pexels-photo-8089268.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  pool2: 'https://images.pexels.com/photos/2291619/pexels-photo-2291619.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  hallway: 'https://images.pexels.com/photos/26729563/pexels-photo-26729563.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  gym2: 'https://images.pexels.com/photos/35215421/pexels-photo-35215421.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
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
  { id: 'nyc', name: 'New York / New Jersey', country: 'USA', countryFlag: '🇺🇸', stadium: 'MetLife Stadium', image: IMAGES.nyc, description: 'The heart of it all — host of the FIFA World Cup 2026 Final. Experience the electric energy of the Big Apple.' },
  { id: 'la', name: 'Los Angeles', country: 'USA', countryFlag: '🇺🇸', stadium: 'SoFi Stadium', image: 'https://images.pexels.com/photos/1461370/pexels-photo-1461370.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', description: 'Sun, stars, and soccer — LA brings the glamour to the beautiful game.' },
  { id: 'miami', name: 'Miami', country: 'USA', countryFlag: '🇺🇸', stadium: 'Hard Rock Stadium', image: IMAGES.fans1, description: 'Tropical vibes meet world-class football in the Magic City.' },
  { id: 'houston', name: 'Houston', country: 'USA', countryFlag: '🇺🇸', stadium: 'NRG Stadium', image: IMAGES.stadium, description: 'Space City welcomes the world with Southern hospitality and massive venues.' },
  { id: 'dallas', name: 'Dallas / Arlington', country: 'USA', countryFlag: '🇺🇸', stadium: 'AT&T Stadium', image: IMAGES.fans2, description: 'Everything is bigger in Texas — including the World Cup atmosphere.' },
  { id: 'sf', name: 'San Francisco Bay Area', country: 'USA', countryFlag: '🇺🇸', stadium: "Levi's Stadium", image: IMAGES.hotel3, description: 'Bay Area beauty meets football fever in the tech capital.' },
  { id: 'seattle', name: 'Seattle', country: 'USA', countryFlag: '🇺🇸', stadium: 'Lumen Field', image: IMAGES.vancouver, description: 'The Emerald City shines bright for football fans worldwide.' },
  { id: 'philly', name: 'Philadelphia', country: 'USA', countryFlag: '🇺🇸', stadium: 'Lincoln Financial Field', image: IMAGES.hero, description: 'Historic charm and passionate sports culture await.' },
  { id: 'atlanta', name: 'Atlanta', country: 'USA', countryFlag: '🇺🇸', stadium: 'Mercedes-Benz Stadium', image: IMAGES.stadium, description: 'The capital of the South brings energy and culture to the pitch.' },
  { id: 'kansas', name: 'Kansas City', country: 'USA', countryFlag: '🇺🇸', stadium: 'Arrowhead Stadium', image: IMAGES.fans1, description: 'The heartland of America, with legendary BBQ and football passion.' },
  { id: 'boston', name: 'Boston / Foxborough', country: 'USA', countryFlag: '🇺🇸', stadium: 'Gillette Stadium', image: IMAGES.nyc, description: 'Historic New England charm meets world football excitement.' },
  { id: 'mexico', name: 'Mexico City', country: 'Mexico', countryFlag: '🇲🇽', stadium: 'Estadio Azteca', image: IMAGES.mexico, description: 'The legendary Azteca stadium — where football history was made and will be made again.' },
  { id: 'monterrey', name: 'Monterrey', country: 'Mexico', countryFlag: '🇲🇽', stadium: 'Estadio BBVA', image: IMAGES.monterrey, description: 'Mountain-framed modernity and passionate Norteño football culture.' },
  { id: 'guadalajara', name: 'Guadalajara', country: 'Mexico', countryFlag: '🇲🇽', stadium: 'Estadio Akron', image: IMAGES.mexico, description: 'The Pearl of the West — tequila, mariachi, and football unite.' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', countryFlag: '🇨🇦', stadium: 'BMO Field', image: IMAGES.toronto, description: 'Canada\'s largest city offers multicultural magic and lakefront beauty.' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', countryFlag: '🇨🇦', stadium: 'BC Place', image: IMAGES.vancouver, description: 'Ocean, mountains, and football — Vancouver has it all.' },
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
}

export const LISTINGS: Listing[] = [
  {
    id: '1', title: 'Luxury Suite at The Grand', type: 'hotel', city: 'New York', cityId: 'nyc',
    price: 450, rating: 4.9, reviews: 234,
    images: [IMAGES.hotel1, IMAGES.hotel2, IMAGES.bathroom, IMAGES.lobby, IMAGES.pool],
    amenities: ['WiFi', 'Pool', 'Gym', 'Room Service', 'Parking', 'Breakfast'],
    maxGuests: 2, bedrooms: 1, description: 'A stunning luxury suite in the heart of Manhattan, steps from Times Square and a short ride to MetLife Stadium.',
    nearestStadium: 'MetLife Stadium', distanceToStadium: '12 miles', available: true
  },
  {
    id: '2', title: 'Modern Manhattan Apartment', type: 'apartment', city: 'New York', cityId: 'nyc',
    price: 320, rating: 4.7, reviews: 89,
    images: [IMAGES.apartment1, IMAGES.apartment2, IMAGES.bedroom2, IMAGES.balcony, IMAGES.openplan],
    amenities: ['WiFi', 'Kitchen', 'Washer', 'AC', 'TV', 'Workspace'],
    maxGuests: 4, bedrooms: 2, description: 'Spacious 2-bedroom apartment in Midtown with skyline views. Perfect for groups attending multiple matches.',
    nearestStadium: 'MetLife Stadium', distanceToStadium: '14 miles', available: true
  },
  {
    id: '3', title: 'Brooklyn Brownstone Shortlet', type: 'shortlet', city: 'New York', cityId: 'nyc',
    price: 275, rating: 4.8, reviews: 156,
    images: [IMAGES.apartment2, IMAGES.bedroom4, IMAGES.apartment3, IMAGES.balcony, IMAGES.bedroom3],
    amenities: ['WiFi', 'Kitchen', 'Garden', 'Washer', 'TV', 'BBQ'],
    maxGuests: 6, bedrooms: 3, description: 'Charming Brooklyn brownstone available for the full World Cup period. Live like a local in NYC.',
    nearestStadium: 'MetLife Stadium', distanceToStadium: '18 miles', available: true
  },
  {
    id: '4', title: 'Beachfront Hotel Miami', type: 'hotel', city: 'Miami', cityId: 'miami',
    price: 380, rating: 4.8, reviews: 312,
    images: [IMAGES.hotel2, IMAGES.pool2, IMAGES.bathroom, IMAGES.lobby, IMAGES.gym],
    amenities: ['WiFi', 'Beach', 'Pool', 'Spa', 'Restaurant', 'Parking'],
    maxGuests: 2, bedrooms: 1, description: 'Wake up to ocean views and walk to the beach. World Cup matches are just a shuttle ride away.',
    nearestStadium: 'Hard Rock Stadium', distanceToStadium: '8 miles', available: true
  },
  {
    id: '5', title: 'South Beach Modern Flat', type: 'apartment', city: 'Miami', cityId: 'miami',
    price: 260, rating: 4.6, reviews: 67,
    images: [IMAGES.apartment3, IMAGES.bedroom2, IMAGES.balcony, IMAGES.openplan, IMAGES.pool],
    amenities: ['WiFi', 'Pool', 'Kitchen', 'Gym', 'AC', 'Balcony'],
    maxGuests: 3, bedrooms: 1, description: 'Stylish apartment in South Beach with pool access. Experience the World Cup Miami way.',
    nearestStadium: 'Hard Rock Stadium', distanceToStadium: '10 miles', available: true
  },
  {
    id: '6', title: 'Historic Centro Hotel', type: 'hotel', city: 'Mexico City', cityId: 'mexico',
    price: 180, rating: 4.7, reviews: 445,
    images: [IMAGES.hotel3, IMAGES.reception, IMAGES.bathroom, IMAGES.bedroom3, IMAGES.lobby],
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Room Service', 'Concierge', 'Parking'],
    maxGuests: 2, bedrooms: 1, description: 'Beautiful hotel in the historic center, near Zócalo. Experience the Azteca atmosphere.',
    nearestStadium: 'Estadio Azteca', distanceToStadium: '6 miles', available: true
  },
  {
    id: '7', title: 'Polanco Luxury Apartment', type: 'apartment', city: 'Mexico City', cityId: 'mexico',
    price: 150, rating: 4.9, reviews: 203,
    images: [IMAGES.apartment1, IMAGES.openplan, IMAGES.bedroom2, IMAGES.balcony, IMAGES.bathroom],
    amenities: ['WiFi', 'Kitchen', 'Rooftop', 'Gym', 'Parking', 'Security'],
    maxGuests: 4, bedrooms: 2, description: 'Upscale apartment in the prestigious Polanco district. Walk to restaurants, museums, and parks.',
    nearestStadium: 'Estadio Azteca', distanceToStadium: '9 miles', available: true
  },
  {
    id: '8', title: 'Harbourfront Condo', type: 'apartment', city: 'Toronto', cityId: 'toronto',
    price: 290, rating: 4.7, reviews: 98,
    images: [IMAGES.apartment2, IMAGES.balcony, IMAGES.bedroom3, IMAGES.openplan, IMAGES.pool],
    amenities: ['WiFi', 'Kitchen', 'Lake View', 'Gym', 'Parking', 'Concierge'],
    maxGuests: 4, bedrooms: 2, description: 'Beautiful lakefront condo with CN Tower views. Central location for all World Cup activities.',
    nearestStadium: 'BMO Field', distanceToStadium: '2 miles', available: true
  },
  {
    id: '9', title: 'Downtown Toronto Hotel', type: 'hotel', city: 'Toronto', cityId: 'toronto',
    price: 350, rating: 4.8, reviews: 567,
    images: [IMAGES.hotel1, IMAGES.lobby, IMAGES.gym, IMAGES.bathroom, IMAGES.reception],
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Bar'],
    maxGuests: 2, bedrooms: 1, description: 'Premier downtown hotel with all amenities. Walking distance to entertainment district.',
    nearestStadium: 'BMO Field', distanceToStadium: '3 miles', available: true
  },
  {
    id: '10', title: 'Gastown Shortlet Loft', type: 'shortlet', city: 'Vancouver', cityId: 'vancouver',
    price: 220, rating: 4.6, reviews: 45,
    images: [IMAGES.apartment3, IMAGES.bedroom4, IMAGES.hallway, IMAGES.balcony, IMAGES.bedroom2],
    amenities: ['WiFi', 'Kitchen', 'Exposed Brick', 'Washer', 'TV', 'Bike Storage'],
    maxGuests: 2, bedrooms: 1, description: 'Industrial-chic loft in historic Gastown. Walk to restaurants, shops, and transit to BC Place.',
    nearestStadium: 'BC Place', distanceToStadium: '1 mile', available: true
  },
  {
    id: '11', title: 'Monterrey Mountain View Suite', type: 'hotel', city: 'Monterrey', cityId: 'monterrey',
    price: 160, rating: 4.5, reviews: 178,
    images: [IMAGES.hotel2, IMAGES.bedroom3, IMAGES.pool, IMAGES.gym2, IMAGES.reception],
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Mountain View', 'Parking', 'Gym'],
    maxGuests: 2, bedrooms: 1, description: 'Stunning mountain views from this modern hotel. Experience the warmth of Northern Mexico.',
    nearestStadium: 'Estadio BBVA', distanceToStadium: '5 miles', available: true
  },
  {
    id: '12', title: 'Dallas Downtown Loft', type: 'shortlet', city: 'Dallas', cityId: 'dallas',
    price: 200, rating: 4.7, reviews: 92,
    images: [IMAGES.apartment1, IMAGES.bedroom2, IMAGES.openplan, IMAGES.balcony, IMAGES.gym],
    amenities: ['WiFi', 'Kitchen', 'Pool', 'Gym', 'Parking', 'BBQ'],
    maxGuests: 4, bedrooms: 2, description: 'Spacious loft in downtown Dallas, available for the entire World Cup period.',
    nearestStadium: 'AT&T Stadium', distanceToStadium: '15 miles', available: true
  },
];

export const MATCH_SCHEDULE = [
  { date: 'June 11, 2026', match: '🇲🇽 Mexico vs South Africa 🇿🇦', venue: 'Estadio Azteca', city: 'Mexico City' },
  { date: 'June 11, 2026', match: '🇰🇷 South Korea vs Czechia 🇨🇿', venue: 'Estadio Akron', city: 'Guadalajara' },
  { date: 'June 12, 2026', match: '🇨🇦 Canada vs Bosnia & Herzegovina 🇧🇦', venue: 'BMO Field', city: 'Toronto' },
  { date: 'June 12, 2026', match: '🇺🇸 USA vs Paraguay 🇵🇾', venue: 'SoFi Stadium', city: 'Los Angeles' },
  { date: 'June 13, 2026', match: '🇧🇷 Brazil vs Morocco 🇲🇦', venue: 'MetLife Stadium', city: 'New York / NJ' },
  { date: 'June 14, 2026', match: '🇳🇱 Netherlands vs Japan 🇯🇵', venue: 'AT&T Stadium', city: 'Dallas' },
  { date: 'June 16, 2026', match: '🇫🇷 France vs Senegal 🇸🇳', venue: 'MetLife Stadium', city: 'New York / NJ' },
  { date: 'June 16, 2026', match: '🇦🇷 Argentina vs Algeria 🇩🇿', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { date: 'July 19', match: '🏆 FINAL', venue: 'MetLife Stadium', city: 'New York / NJ' },
];

export const TESTIMONIALS = [
  { name: 'Carlos M.', country: '🇧🇷 Brazil', text: 'Anna Travel Agency made my Qatar 2022 trip seamless. Already booked for 2026!', rating: 5 },
  { name: 'Sarah K.', country: '🇬🇧 UK', text: 'Incredible service! Found the perfect apartment near the stadium. Highly recommend.', rating: 5 },
  { name: 'Yuki T.', country: '🇯🇵 Japan', text: 'Professional, responsive, and great value. Will use again for the World Cup!', rating: 5 },
  { name: 'Ahmed R.', country: '🇪🇬 Egypt', text: 'The best travel agency for football fans. They understand what we need.', rating: 5 },
  { name: 'Maria L.', country: '🇦🇷 Argentina', text: 'Found an amazing shortlet for the whole group stage. Perfect for our group of 6!', rating: 5 },
  { name: 'Oliver P.', country: '🇩🇪 Germany', text: 'Easy booking, great locations, and the World Cup package was unbeatable.', rating: 4 },
];
