import type { Event, EventTicket } from '../contexts/DataContext';

const createdAt = '2026-07-23T00:00:00.000Z';

type FeaturedEvent = Event & { tickets: EventTicket[] };

function tickets(eventId: string, generalPrice: number): EventTicket[] {
  return [
    { id: `${eventId}-general`, event_id: eventId, category_name: 'General Admission', price: generalPrice, quantity_available: 250, created_at: createdAt },
    { id: `${eventId}-premium`, event_id: eventId, category_name: 'Premium', price: generalPrice + 120, quantity_available: 80, created_at: createdAt },
    { id: `${eventId}-vip`, event_id: eventId, category_name: 'VIP', price: generalPrice + 300, quantity_available: 25, created_at: createdAt },
  ];
}

const images = {
  music: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900',
  sport: 'https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900',
  tech: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900',
  festival: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900',
};

function event(id: string, title: string, date: string, venue: string, city: string, category: string, imageUrl: string, price: number, description: string): FeaturedEvent {
  return { id, title, date, venue, city, category, description, image_url: imageUrl, status: 'upcoming', created_at: createdAt, tickets: tickets(id, price) };
}

export const FEATURED_US_EVENTS: FeaturedEvent[] = [
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
  event('f1-vegas-practice-2026', 'Formula 1 Las Vegas Grand Prix: Friday', '2026-11-20T18:00:00', 'Las Vegas Strip Circuit', 'Las Vegas, NV', 'Motorsport', images.sport, 225, 'Night practice sessions on the Las Vegas Strip Circuit.'),
  event('f1-vegas-qualifying-2026', 'Formula 1 Las Vegas Grand Prix: Qualifying', '2026-11-21T18:00:00', 'Las Vegas Strip Circuit', 'Las Vegas, NV', 'Motorsport', images.sport, 360, 'Qualifying under the lights in Las Vegas.'),
  event('f1-vegas-race-2026', 'Formula 1 Las Vegas Grand Prix: Race Day', '2026-11-22T18:00:00', 'Las Vegas Strip Circuit', 'Las Vegas, NV', 'Motorsport', images.sport, 495, 'Race-day access for the Las Vegas Grand Prix weekend.'),
  event('pax-unplugged-2026', 'PAX Unplugged 2026', '2026-12-04T10:00:00', 'Pennsylvania Convention Center', 'Philadelphia, PA', 'Gaming', images.tech, 70, 'Tabletop games, panels, tournaments, and community play.'),
  event('ces-opening-2027', 'CES 2027: Opening Day', '2027-01-06T09:00:00', 'Las Vegas Convention Center', 'Las Vegas, NV', 'Technology', images.tech, 160, 'The opening day of the global consumer technology showcase.'),
  event('ces-closing-2027', 'CES 2027: Closing Day', '2027-01-09T09:00:00', 'Las Vegas Convention Center', 'Las Vegas, NV', 'Technology', images.tech, 160, 'Final day access to CES 2027 exhibits and programming.'),
];
