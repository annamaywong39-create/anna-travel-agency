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
  // Price is retained in the seed signature for future verified inventory imports.
  void price;
  return { id, title, date, venue, city, category, description, image_url: imageUrl, status: 'upcoming', created_at: createdAt, tickets: [] };
}

// BTS ARIRANG North America dates still ahead as of 6 August 2026.
// Tickets are intentionally empty until Anna verifies and acquires inventory.
// The UI should present these as request-access events, not guaranteed stock.
const BTS_REMAINING_2026: FeaturedEvent[] = [
  event('bts-arirang-baltimore-2026-08-10', "BTS WORLD TOUR 'ARIRANG' — Baltimore", '2026-08-10T20:00:00-04:00', 'M&T Bank Stadium', 'Baltimore, MD', 'Music', images.bts, 0, 'Request access for the remaining BTS ARIRANG show in Baltimore.'),
  event('bts-arirang-baltimore-2026-08-11', "BTS WORLD TOUR 'ARIRANG' — Baltimore", '2026-08-11T20:00:00-04:00', 'M&T Bank Stadium', 'Baltimore, MD', 'Music', images.bts, 0, 'Request access for the remaining BTS ARIRANG show in Baltimore.'),
  event('bts-arirang-arlington-2026-08-15', "BTS WORLD TOUR 'ARIRANG' — Arlington", '2026-08-15T20:00:00-05:00', 'AT&T Stadium', 'Arlington, TX', 'Music', images.btsAlt, 0, 'Request access for the remaining BTS ARIRANG show in Arlington.'),
  event('bts-arirang-arlington-2026-08-16', "BTS WORLD TOUR 'ARIRANG' — Arlington", '2026-08-16T20:00:00-05:00', 'AT&T Stadium', 'Arlington, TX', 'Music', images.btsAlt, 0, 'Request access for the remaining BTS ARIRANG show in Arlington.'),
  event('bts-arirang-toronto-2026-08-22', "BTS WORLD TOUR 'ARIRANG' — Toronto", '2026-08-22T20:00:00-04:00', 'Rogers Stadium', 'Toronto, ON, Canada', 'Music', images.stadium, 0, 'Request access for the remaining BTS ARIRANG show in Toronto.'),
  event('bts-arirang-toronto-2026-08-23', "BTS WORLD TOUR 'ARIRANG' — Toronto", '2026-08-23T20:00:00-04:00', 'Rogers Stadium', 'Toronto, ON, Canada', 'Music', images.stadium, 0, 'Request access for the remaining BTS ARIRANG show in Toronto.'),
  event('bts-arirang-chicago-2026-08-27', "BTS WORLD TOUR 'ARIRANG' — Chicago", '2026-08-27T20:00:00-05:00', 'Soldier Field', 'Chicago, IL', 'Music', images.fans, 0, 'Request access for the remaining BTS ARIRANG show in Chicago.'),
  event('bts-arirang-chicago-2026-08-28', "BTS WORLD TOUR 'ARIRANG' — Chicago", '2026-08-28T20:00:00-05:00', 'Soldier Field', 'Chicago, IL', 'Music', images.fans, 0, 'Request access for the remaining BTS ARIRANG show in Chicago.'),
  event('bts-arirang-los-angeles-2026-09-01', "BTS WORLD TOUR 'ARIRANG' — Los Angeles", '2026-09-01T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', 'Music', images.stadium, 0, 'Request access for the remaining BTS ARIRANG show in Los Angeles.'),
  event('bts-arirang-los-angeles-2026-09-02', "BTS WORLD TOUR 'ARIRANG' — Los Angeles", '2026-09-02T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', 'Music', images.stadium, 0, 'Request access for the remaining BTS ARIRANG show in Los Angeles.'),
  event('bts-arirang-los-angeles-2026-09-05', "BTS WORLD TOUR 'ARIRANG' — Los Angeles", '2026-09-05T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', 'Music', images.stadium, 0, 'Request access for the remaining BTS ARIRANG show in Los Angeles.'),
  event('bts-arirang-los-angeles-2026-09-06', "BTS WORLD TOUR 'ARIRANG' — Los Angeles", '2026-09-06T20:00:00-07:00', 'SoFi Stadium', 'Inglewood, CA', 'Music', images.stadium, 0, 'Request access for the remaining BTS ARIRANG show in Los Angeles.'),
].map((item) => item.id === 'bts-arirang-baltimore-2026-08-10'
  ? {
      ...item,
      tickets: [
        { id: 'bts-baltimore-532-r16', event_id: item.id, category_name: 'Five Hundreds Level 532', section: '532', row: '16', seat_details: '2 mobile tickets', price: 149, quantity_available: 2, delivery_method: 'Mobile transfer', delivery_timing: 'Evening before event', created_at: createdAt },
        { id: 'bts-baltimore-field-r13', event_id: item.id, category_name: 'Field R', section: 'Field R', row: '13', seat_details: '2 tickets', price: 973, quantity_available: 2, delivery_method: 'Mobile transfer', delivery_timing: 'Evening before event', created_at: createdAt },
        { id: 'bts-baltimore-133-r32', event_id: item.id, category_name: 'Hundreds Level 133', section: '133', row: '32', seat_details: '2 tickets', price: 371, quantity_available: 2, delivery_method: 'Mobile transfer', delivery_timing: 'Evening before event', created_at: createdAt },
      ],
    }
  : { ...item, tickets: [] });

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
