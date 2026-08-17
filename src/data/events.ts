import type { Event, EventTicket } from '../contexts/DataContext';

const createdAt = '2026-07-23T00:00:00.000Z';

type FeaturedEvent = Event & { tickets: EventTicket[] };

const images = {
  music: '/images/event-music.jpg',
  sport: '/images/event-sport.jpg',
  tech: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900',
  festival: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900',
  bts: '/images/events/bts/bts-arirang-tour.jpg',
  btsAlt: '/images/events/bts/bts-arirang-tour.jpg',
  stadium: '/images/stadium.jpg',
  fans: '/images/fans.jpg',
};

function event(id: string, title: string, date: string, venue: string, city: string, category: string, imageUrl: string, price: number, description: string): FeaturedEvent {
  void price;
  return { id, title, date, venue, city, category, description, image_url: imageUrl, status: 'upcoming', created_at: createdAt, tickets: [] };
}

function btsTickets(eventId: string, tickets: Array<{ section: string; row: string; price: number; qty: number; discount: number; cat: string }>): EventTicket[] {
  return tickets.map((t, idx) => ({
    id: `${eventId}-${t.section}-${t.row}-${idx}`.replace(/\s+/g, '-').toLowerCase(),
    event_id: eventId,
    category_name: t.cat,
    section: t.section,
    row: t.row,
    seat_details: '2 tickets; fees included',
    price: t.price,
    quantity_available: t.qty,
    discount_percent: t.discount,
    delivery_method: 'Mobile transfer',
    delivery_timing: 'Evening before event',
    created_at: createdAt,
  }));
}

// Best 100 affordable tickets for SoFi - split 25 per date for sales
const SOFI_BEST_25_SEP1 = [
  { section: 'Upper 546', row: '16', price: 256, qty: 2, discount: 65, cat: 'Upper 546' },
  { section: 'Upper 547', row: '12', price: 267, qty: 2, discount: 65, cat: 'Upper 547' },
  { section: 'Outer 519', row: '16', price: 275, qty: 2, discount: 60, cat: 'Outer 519' },
  { section: 'Outer 519', row: '13', price: 275, qty: 2, discount: 60, cat: 'Outer 519' },
  { section: 'Outer 505', row: '16', price: 282, qty: 2, discount: 60, cat: 'Outer 505' },
  { section: 'Outer 509', row: '16', price: 282, qty: 2, discount: 60, cat: 'Outer 509' },
  { section: 'Upper 538', row: '14', price: 298, qty: 2, discount: 65, cat: 'Upper 538' },
  { section: 'Upper 551', row: '13', price: 298, qty: 2, discount: 65, cat: 'Upper 551' },
  { section: 'Outer 505', row: '15', price: 322, qty: 2, discount: 60, cat: 'Outer 505' },
  { section: 'Outer 513', row: '21', price: 324, qty: 2, discount: 60, cat: 'Outer 513' },
  { section: 'Outer 518', row: '10', price: 325, qty: 2, discount: 60, cat: 'Outer 518' },
  { section: 'Outer 520', row: '13', price: 325, qty: 2, discount: 60, cat: 'Outer 520' },
  { section: 'Outer 517', row: '14', price: 331, qty: 2, discount: 60, cat: 'Outer 517' },
  { section: 'Outer 517', row: '15', price: 331, qty: 2, discount: 60, cat: 'Outer 517' },
  { section: 'Outer 518', row: '18', price: 331, qty: 2, discount: 60, cat: 'Outer 518' },
  { section: 'Outer 528', row: '4', price: 428, qty: 1, discount: 60, cat: 'Outer 528' },
  { section: 'Outer 522', row: '5', price: 432, qty: 2, discount: 60, cat: 'Outer 522' },
  { section: 'Outer 522', row: '4', price: 433, qty: 2, discount: 60, cat: 'Outer 522' },
  { section: 'Outer 531', row: '7', price: 433, qty: 2, discount: 60, cat: 'Outer 531' },
  { section: 'Outer 545', row: '17', price: 433, qty: 2, discount: 60, cat: 'Outer 545' },
  { section: 'Outer 545', row: '2', price: 433, qty: 1, discount: 60, cat: 'Outer 545' },
  { section: 'Outer 542', row: '8', price: 434, qty: 2, discount: 60, cat: 'Outer 542' },
  { section: 'Outer 521', row: '3', price: 443, qty: 2, discount: 60, cat: 'Outer 521' },
  { section: 'Outer 530', row: '8', price: 443, qty: 2, discount: 60, cat: 'Outer 530' },
  { section: 'Outer 539', row: '6', price: 443, qty: 2, discount: 60, cat: 'Outer 539' },
];

const SOFI_BEST_25_SEP2 = [
  { section: 'Outer 532', row: '4', price: 445, qty: 2, discount: 60, cat: 'Outer 532' },
  { section: 'Lower 120', row: '8', price: 1646, qty: 2, discount: 65, cat: 'Lower 120' },
  { section: 'Outer 522', row: '19', price: 1648, qty: 1, discount: 60, cat: 'Outer 522' },
  { section: 'Outer 522', row: '20', price: 1649, qty: 2, discount: 60, cat: 'Outer 522' },
  { section: 'Outer 522', row: '17', price: 1673, qty: 1, discount: 60, cat: 'Outer 522' },
  { section: 'Lower Club C107', row: '16', price: 1674, qty: 2, discount: 65, cat: 'Lower Club C107' },
  { section: 'Outer 522', row: '18', price: 1675, qty: 2, discount: 60, cat: 'Outer 522' },
  { section: 'Lower Club C135', row: '8', price: 1702, qty: 2, discount: 65, cat: 'Lower Club C135' },
  { section: 'Lower Club C136', row: '16', price: 1725, qty: 2, discount: 65, cat: 'Lower Club C136' },
  { section: 'Lower Club C127', row: '11', price: 1733, qty: 2, discount: 65, cat: 'Lower Club C127' },
  { section: 'Suite 2 NE5', row: '1', price: 1736, qty: 1, discount: 70, cat: 'Suite 2 NE5' },
  { section: 'Suite 7 E24', row: '2', price: 1758, qty: 1, discount: 70, cat: 'Suite 7 E24' },
  { section: 'Lower 100', row: '11', price: 1773, qty: 1, discount: 65, cat: 'Lower 100' },
  { section: 'Outer 521', row: '22', price: 1775, qty: 2, discount: 60, cat: 'Outer 521' },
  { section: 'Outer 521', row: '20', price: 1787, qty: 2, discount: 60, cat: 'Outer 521' },
  { section: 'Outer 521', row: '18', price: 1813, qty: 2, discount: 60, cat: 'Outer 521' },
  { section: 'Lower Club C107', row: '18', price: 1820, qty: 2, discount: 65, cat: 'Lower Club C107' },
  { section: 'Outer 528', row: '20', price: 1833, qty: 2, discount: 60, cat: 'Outer 528' },
  { section: 'Outer 540', row: '15', price: 1852, qty: 1, discount: 60, cat: 'Outer 540' },
  { section: 'Lower Club C114', row: '17', price: 1910, qty: 2, discount: 65, cat: 'Lower Club C114' },
  { section: 'Lower 122', row: '16', price: 1925, qty: 2, discount: 65, cat: 'Lower 122' },
  { section: 'Middle 328', row: '8', price: 1975, qty: 1, discount: 65, cat: 'Middle 328' },
  { section: 'Middle 320', row: '9', price: 2003, qty: 2, discount: 65, cat: 'Middle 320' },
  { section: 'Middle 325', row: '7', price: 2003, qty: 2, discount: 65, cat: 'Middle 325' },
  { section: 'Floor D3', row: '5', price: 2057, qty: 2, discount: 70, cat: 'Floor D3' },
];

const SOFI_BEST_20_SEP5 = [
  { section: 'Suite 7 E24', row: '1', price: 2103, qty: 1, discount: 70, cat: 'Suite 7 E24' },
  { section: 'Floor D4', row: '8', price: 2116, qty: 2, discount: 70, cat: 'Floor D4' },
  { section: 'Lower Club C117', row: '14', price: 2239, qty: 2, discount: 65, cat: 'Lower Club C117' },
  { section: 'Floor D4', row: '8', price: 2271, qty: 2, discount: 70, cat: 'Floor D4' },
  { section: 'HOT SEAT', row: 'Package', price: 2313, qty: 1, discount: 70, cat: 'HOT SEAT' },
  { section: 'Silver Fan', row: 'Package', price: 2429, qty: 1, discount: 70, cat: 'Silver Fan' },
  { section: 'Lower 120', row: '16', price: 2436, qty: 1, discount: 65, cat: 'Lower 120' },
  { section: 'Diamond Fan', row: 'Package', price: 2487, qty: 1, discount: 70, cat: 'Diamond Fan' },
  { section: 'Inner 205', row: '2', price: 2498, qty: 2, discount: 65, cat: 'Inner 205' },
  { section: 'Inner 225', row: '15', price: 2508, qty: 2, discount: 65, cat: 'Inner 225' },
  { section: 'Floor D3', row: '5', price: 2582, qty: 2, discount: 70, cat: 'Floor D3' },
  { section: 'Floor A3', row: '2', price: 2612, qty: 2, discount: 70, cat: 'Floor A3' },
  { section: 'Diamond Deluxe', row: 'Package', price: 2631, qty: 1, discount: 70, cat: 'Diamond Deluxe' },
  { section: 'Inner 230', row: '20', price: 2720, qty: 1, discount: 65, cat: 'Inner 230' },
  { section: 'Middle 341', row: '5', price: 2840, qty: 4, discount: 65, cat: 'Middle 341' },
  { section: 'Inner 210', row: '5', price: 2872, qty: 2, discount: 65, cat: 'Inner 210' },
  { section: 'Lower Club C106', row: '9', price: 3121, qty: 2, discount: 65, cat: 'Lower Club C106' },
  { section: 'PREMIUM HOT SEAT', row: 'Package', price: 3121, qty: 1, discount: 70, cat: 'PREMIUM HOT SEAT' },
  { section: 'Lower 123', row: '19', price: 3128, qty: 2, discount: 65, cat: 'Lower 123' },
  { section: 'Lower Club C129', row: '9', price: 3292, qty: 2, discount: 65, cat: 'Lower Club C129' },
];

const SOFI_BEST_15_SEP6 = [
  { section: 'Diamond Elite', row: 'Package', price: 3324, qty: 1, discount: 70, cat: 'Diamond Elite' },
  { section: 'Lower 104', row: '3', price: 3441, qty: 2, discount: 65, cat: 'Lower 104' },
  { section: 'Lower Club C133', row: '10', price: 3729, qty: 2, discount: 65, cat: 'Lower Club C133' },
  { section: 'Inner 234', row: '1', price: 3813, qty: 2, discount: 65, cat: 'Inner 234' },
  { section: 'Gold Fan', row: 'Package', price: 3871, qty: 1, discount: 70, cat: 'Gold Fan' },
  { section: 'Gold Deluxe', row: 'Package', price: 4044, qty: 1, discount: 70, cat: 'Gold Deluxe' },
  { section: 'SILVER VIP FLOOR', row: 'Package', price: 4044, qty: 1, discount: 70, cat: 'SILVER VIP FLOOR' },
  { section: 'Lower Club C116', row: '15', price: 4124, qty: 1, discount: 65, cat: 'Lower Club C116' },
  { section: 'VIP SOUNDCHECK', row: 'Package', price: 4159, qty: 1, discount: 70, cat: 'VIP SOUNDCHECK' },
  { section: 'Lower Club C128', row: '18', price: 4186, qty: 2, discount: 65, cat: 'Lower Club C128' },
  { section: 'Inner Club C249', row: '15', price: 4186, qty: 2, discount: 65, cat: 'Inner Club C249' },
  { section: 'Lower Club C134', row: '15', price: 4637, qty: 1, discount: 65, cat: 'Lower Club C134' },
  { section: 'Gold Elite', row: 'Package', price: 4736, qty: 1, discount: 70, cat: 'Gold Elite' },
  { section: 'Deluxe Hotel', row: 'Package', price: 4851, qty: 2, discount: 70, cat: 'Deluxe Hotel' },
  { section: 'Floor B3', row: '4', price: 4989, qty: 2, discount: 70, cat: 'Floor B3' },
];

const BTS_REMAINING_2026: FeaturedEvent[] = [
  event('bts-arirang-baltimore-2026-08-10', "BTS WORLD TOUR 'ARIRANG' — Baltimore", '2026-08-10T20:00:00-04:00', 'M&T Bank Stadium', 'Baltimore, MD', 'Music', images.bts, 0, 'Request access for the remaining BTS ARIRANG show in Baltimore.'),
  event('bts-arirang-baltimore-2026-08-11', "BTS WORLD TOUR 'ARIRANG' — Baltimore", '2026-08-11T20:00:00-04:00', 'M&T Bank Stadium', 'Baltimore, MD', 'Music', images.bts, 0, 'Request access for the remaining BTS ARIRANG show in Baltimore.'),
  event('bts-arirang-arlington-2026-08-15', "BTS WORLD TOUR 'ARIRANG' — Arlington", '2026-08-15T20:00:00-05:00', 'AT&T Stadium', 'Arlington, TX', 'Music', images.btsAlt, 0, 'Request access for the remaining BTS ARIRANG show in Arlington.'),
  event('bts-arirang-arlington-2026-08-16', "BTS WORLD TOUR 'ARIRANG' — Arlington", '2026-08-16T20:00:00-05:00', 'AT&T Stadium', 'Arlington, TX', 'Music', images.btsAlt, 0, 'Request access for the remaining BTS ARIRANG show in Arlington.'),
  event('bts-arirang-toronto-2026-08-22', "BTS WORLD TOUR 'ARIRANG' — Toronto", '2026-08-22T20:00:00-04:00', 'Rogers Stadium', 'Toronto, ON, Canada', 'Music', images.stadium, 0, 'Request access for the remaining BTS ARIRANG show in Toronto.'),
  event('bts-arirang-toronto-2026-08-23', "BTS WORLD TOUR 'ARIRANG' — Toronto", '2026-08-23T20:00:00-04:00', 'Rogers Stadium', 'Toronto, ON, Canada', 'Music', images.stadium, 0, 'Request access for the remaining BTS ARIRANG show in Toronto.'),
  event('bts-arirang-chicago-2026-08-27', "BTS WORLD TOUR 'ARIRANG' — Chicago", '2026-08-27T20:00:00-05:00', 'Soldier Field', 'Chicago, IL', 'Music', images.fans, 0, 'Request access for the remaining BTS ARIRANG show in Chicago.'),
  event('bts-arirang-chicago-2026-08-28', "BTS WORLD TOUR 'ARIRANG' — Chicago", '2026-08-28T20:00:00-05:00', 'Soldier Field', 'Chicago, IL', 'Music', images.fans, 0, 'Request access for the remaining BTS ARIRANG show in Chicago.'),
  event('bts-arirang-los-angeles-2026-09-01', "BTS WORLD TOUR 'ARIRANG' — Los Angeles", '2026-09-01T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', 'Music', images.bts, 0, 'Request access for the remaining BTS ARIRANG show in Los Angeles — Sep 1, best for sales.'),
  event('bts-arirang-los-angeles-2026-09-02', "BTS WORLD TOUR 'ARIRANG' — Los Angeles", '2026-09-02T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', 'Music', images.bts, 0, 'Request access for the remaining BTS ARIRANG show in Los Angeles — Sep 2.'),
  event('bts-arirang-los-angeles-2026-09-05', "BTS WORLD TOUR 'ARIRANG' — Los Angeles", '2026-09-05T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', 'Music', images.bts, 0, 'Request access for the remaining BTS ARIRANG show in Los Angeles — Sep 5, best for sales.'),
  event('bts-arirang-los-angeles-2026-09-06', "BTS WORLD TOUR 'ARIRANG' — Los Angeles", '2026-09-06T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', 'Music', images.bts, 0, 'Request access for the remaining BTS ARIRANG show in Los Angeles — Sep 6.'),
].map((item) => {
  if (item.id === 'bts-arirang-baltimore-2026-08-10') {
    return { ...item, tickets: btsTickets(item.id, [
      { section: '532', row: '16', price: 149, qty: 2, discount: 65, cat: 'Five Hundreds Level 532' },
      { section: 'Field R', row: '13', price: 973, qty: 2, discount: 70, cat: 'Field R' },
      { section: '133', row: '32', price: 371, qty: 2, discount: 60, cat: 'Hundreds Level 133' },
    ]) };
  }
  if (item.id === 'bts-arirang-los-angeles-2026-09-01') {
    return { ...item, tickets: btsTickets(item.id, SOFI_BEST_25_SEP1) };
  }
  if (item.id === 'bts-arirang-los-angeles-2026-09-02') {
    return { ...item, tickets: btsTickets(item.id, SOFI_BEST_25_SEP2) };
  }
  if (item.id === 'bts-arirang-los-angeles-2026-09-05') {
    return { ...item, tickets: btsTickets(item.id, SOFI_BEST_20_SEP5) };
  }
  if (item.id === 'bts-arirang-los-angeles-2026-09-06') {
    return { ...item, tickets: btsTickets(item.id, SOFI_BEST_15_SEP6) };
  }
  return { ...item, tickets: [] };
});

export const FEATURED_US_EVENTS: FeaturedEvent[] = [
  ...BTS_REMAINING_2026,
  event('lollapalooza-2026', 'Lollapalooza 2026', '2026-07-30T12:00:00', 'Grant Park', 'Chicago, IL', 'Music', images.music, 179, 'Chicago\'s four-day lakefront music festival.'),
  event('us-open-fan-week-2026', 'US Open Fan Week', '2026-08-23T09:30:00', 'USTA Billie Jean King National Tennis Center', 'Queens, NY', 'Tennis', images.sport, 65, 'The opening week of tennis, fan activities, and qualifying matches.'),
  event('us-open-opening-2026', 'US Open Opening Week', '2026-08-30T12:00:00', 'Arthur Ashe Stadium', 'Queens, NY', 'Tennis', images.sport, 160, 'Opening-round sessions at the season\'s final Grand Slam.'),
  event('us-open-labor-day-2026', 'US Open Labor Day Weekend', '2026-09-04T12:00:00', 'Arthur Ashe Stadium', 'Queens, NY', 'Tennis', images.sport, 210, 'High-demand holiday weekend sessions at the US Open.'),
  event('us-open-finals-2026', 'US Open Finals Weekend', '2026-09-12T11:00:00', 'Arthur Ashe Stadium', 'Queens, NY', 'Tennis', images.sport, 325, 'Championship weekend at the 2026 US Open.'),
  event('pax-west-2026', 'PAX West 2026', '2026-09-04T10:00:00', 'Seattle Convention Center', 'Seattle, WA', 'Gaming', images.tech, 75, 'Four days of gaming, panels, tournaments, and creator events.'),
  event('acl-weekend-one-2026', 'Austin City Limits Festival: Weekend One', '2026-10-02T12:00:00', 'Zilker Metropolitan Park', 'Austin, TX', 'Music', images.music, 190, 'The first weekend of Austin\'s major multi-stage music festival.'),
  event('acl-weekend-two-2026', 'Austin City Limits Festival: Weekend Two', '2026-10-09T12:00:00', 'Zilker Metropolitan Park', 'Austin, TX', 'Music', images.music, 190, 'The second weekend of Austin\'s major multi-stage music festival.'),
  event('f1-austin-practice-2026', 'Formula 1 United States Grand Prix: Friday', '2026-10-23T10:00:00', 'Circuit of the Americas', 'Austin, TX', 'Motorsport', images.sport, 145, 'Practice day at the Formula 1 United States Grand Prix.'),
  event('f1-austin-sprint-2026', 'Formula 1 United States Grand Prix: Saturday', '2026-10-24T10:00:00', 'Circuit of the Americas', 'Austin, TX', 'Motorsport', images.sport, 220, 'Sprint and qualifying day at Circuit of the Americas.'),
  event('f1-austin-race-2026', 'Formula 1 United States Grand Prix: Race Day', '2026-10-25T10:00:00', 'Circuit of the Americas', 'Austin, TX', 'Motorsport', images.sport, 395, 'Race day at the Formula 1 United States Grand Prix.'),
  event('edc-orlando-friday-2026', 'EDC Orlando 2026: Friday', '2026-11-06T13:00:00', 'Tinker Field', 'Orlando, FL', 'Electronic Music', images.festival, 120, 'The opening day of Electric Daisy Carnival Orlando.'),
  event('edc-orlando-saturday-2026', 'EDC Orlando 2026: Saturday', '2026-11-07T13:00:00', 'Tinker Field', 'Orlando, FL', 'Electronic Music', images.festival, 145, 'The headline Saturday of Electric Daisy Carnival Orlando.'),
  event('edc-orlando-sunday-2026', 'EDC Orlando 2026: Sunday', '2026-11-08T13:00:00', 'Tinker Field', 'Orlando, FL', 'Electronic Music', images.festival, 120, 'Closing day of Electric Daisy Carnival Orlando.'),
  event('f1-vegas-practice-2026', 'Formula 1 Las Vegas Grand Prix: Friday', '2026-11-19T18:00:00', 'Las Vegas Strip Circuit', 'Las Vegas, NV', 'Motorsport', images.sport, 225, 'Night practice sessions on the Las Vegas Strip Circuit.'),
  event('f1-vegas-qualifying-2026', 'Formula 1 Las Vegas Grand Prix: Saturday', '2026-11-20T18:00:00', 'Las Vegas Strip Circuit', 'Las Vegas, NV', 'Motorsport', images.sport, 360, 'Qualifying under the lights in Las Vegas.'),
  event('f1-vegas-race-2026', 'Formula 1 Las Vegas Grand Prix: Race Day', '2026-11-21T18:00:00', 'Las Vegas Strip Circuit', 'Las Vegas, NV', 'Motorsport', images.sport, 495, 'Race-day access for the Las Vegas Grand Prix weekend.'),
  event('pax-unplugged-2026', 'PAX Unplugged 2026', '2026-12-04T10:00:00', 'Pennsylvania Convention Center', 'Philadelphia, PA', 'Gaming', images.tech, 70, 'Tabletop games, panels, tournaments, and community play.'),
  event('ces-opening-2027', 'CES 2027: Opening Day', '2027-01-06T09:00:00', 'Las Vegas Convention Center', 'Las Vegas, NV', 'Technology', images.tech, 160, 'The opening day of the global consumer technology showcase.'),
  event('ces-closing-2027', 'CES 2027: Closing Day', '2027-01-09T09:00:00', 'Las Vegas Convention Center', 'Las Vegas, NV', 'Technology', images.tech, 160, 'Final day access to CES 2027 exhibits and programming.'),
];
