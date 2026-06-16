export interface GroupMatch {
  num: number;
  date: string;
  fullDate: string;
  time: string;
  group: string;
  home: string;
  homeFlag: string;
  away: string;
  awayFlag: string;
  venue: string;
  city: string;
  homeScore?: number;
  awayScore?: number;
}

export interface KnockoutMatch {
  num: number;
  date: string;
  fullDate: string;
  time: string;
  stage: string;
  home: string;
  away: string;
  venue: string;
  city: string;
  homeScore?: number;
  awayScore?: number;
}

/** Returns 'played' | 'live' | 'upcoming' */
export function getMatchStatus(fullDate: string): 'played' | 'live' | 'upcoming' {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  if (fullDate === todayStr) return 'live';
  if (fullDate < todayStr) return 'played';
  return 'upcoming';
}

// Results sourced from britannica.com, sportingnews.com (June 2026)
export const GROUP_MATCHES: GroupMatch[] = [
  // ═══ MATCHDAY 1 ═══
  { num: 1,  fullDate: '2026-06-11', date: 'Jun 11', time: '2:00 PM', group: 'A', home: 'Mexico', homeFlag: '🇲🇽', away: 'South Africa', awayFlag: '🇿🇦', venue: 'Estadio Azteca', city: 'Mexico City', homeScore: 2, awayScore: 0 },
  { num: 2,  fullDate: '2026-06-11', date: 'Jun 11', time: '9:00 PM', group: 'A', home: 'South Korea', homeFlag: '🇰🇷', away: 'Czechia', awayFlag: '🇨🇿', venue: 'Estadio Akron', city: 'Guadalajara', homeScore: 2, awayScore: 1 },
  { num: 3,  fullDate: '2026-06-12', date: 'Jun 12', time: '2:00 PM', group: 'B', home: 'Canada', homeFlag: '🇨🇦', away: 'Bosnia & Herzegovina', awayFlag: '🇧🇦', venue: 'BMO Field', city: 'Toronto', homeScore: 1, awayScore: 1 },
  { num: 4,  fullDate: '2026-06-12', date: 'Jun 12', time: '8:00 PM', group: 'D', home: 'United States', homeFlag: '🇺🇸', away: 'Paraguay', awayFlag: '🇵🇾', venue: 'SoFi Stadium', city: 'Los Angeles', homeScore: 4, awayScore: 1 },
  { num: 5,  fullDate: '2026-06-13', date: 'Jun 13', time: '2:00 PM', group: 'B', home: 'Qatar', homeFlag: '🇶🇦', away: 'Switzerland', awayFlag: '🇨🇭', venue: "Levi's Stadium", city: 'San Francisco', homeScore: 1, awayScore: 1 },
  { num: 6,  fullDate: '2026-06-13', date: 'Jun 13', time: '5:00 PM', group: 'C', home: 'Brazil', homeFlag: '🇧🇷', away: 'Morocco', awayFlag: '🇲🇦', venue: 'MetLife Stadium', city: 'New York / NJ', homeScore: 1, awayScore: 1 },
  { num: 7,  fullDate: '2026-06-13', date: 'Jun 13', time: '8:00 PM', group: 'C', home: 'Haiti', homeFlag: '🇭🇹', away: 'Scotland', awayFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', venue: 'Gillette Stadium', city: 'Boston', homeScore: 0, awayScore: 1 },
  { num: 8,  fullDate: '2026-06-13', date: 'Jun 13', time: '11:00 PM', group: 'D', home: 'Australia', homeFlag: '🇦🇺', away: 'Türkiye', awayFlag: '🇹🇷', venue: 'BC Place', city: 'Vancouver', homeScore: 2, awayScore: 0 },
  { num: 9,  fullDate: '2026-06-14', date: 'Jun 14', time: '12:00 PM', group: 'E', home: 'Germany', homeFlag: '🇩🇪', away: 'Curaçao', awayFlag: '🇨🇼', venue: 'NRG Stadium', city: 'Houston', homeScore: 7, awayScore: 1 },
  { num: 10, fullDate: '2026-06-14', date: 'Jun 14', time: '3:00 PM', group: 'F', home: 'Netherlands', homeFlag: '🇳🇱', away: 'Japan', awayFlag: '🇯🇵', venue: 'AT&T Stadium', city: 'Dallas', homeScore: 2, awayScore: 2 },
  { num: 11, fullDate: '2026-06-14', date: 'Jun 14', time: '6:00 PM', group: 'E', home: "Côte d'Ivoire", homeFlag: '🇨🇮', away: 'Ecuador', awayFlag: '🇪🇨', venue: 'Lincoln Financial Field', city: 'Philadelphia', homeScore: 1, awayScore: 0 },
  { num: 12, fullDate: '2026-06-14', date: 'Jun 14', time: '9:00 PM', group: 'F', home: 'Sweden', homeFlag: '🇸🇪', away: 'Tunisia', awayFlag: '🇹🇳', venue: 'Estadio BBVA', city: 'Monterrey', homeScore: 5, awayScore: 1 },
  { num: 13, fullDate: '2026-06-15', date: 'Jun 15', time: '11:00 AM', group: 'H', home: 'Spain', homeFlag: '🇪🇸', away: 'Cape Verde', awayFlag: '🇨🇻', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', homeScore: 0, awayScore: 0 },
  { num: 14, fullDate: '2026-06-15', date: 'Jun 15', time: '2:00 PM', group: 'G', home: 'Belgium', homeFlag: '🇧🇪', away: 'Egypt', awayFlag: '🇪🇬', venue: 'Lumen Field', city: 'Seattle', homeScore: 1, awayScore: 1 },
  { num: 15, fullDate: '2026-06-15', date: 'Jun 15', time: '5:00 PM', group: 'H', home: 'Saudi Arabia', homeFlag: '🇸🇦', away: 'Uruguay', awayFlag: '🇺🇾', venue: 'Hard Rock Stadium', city: 'Miami', homeScore: 1, awayScore: 1 },
  { num: 16, fullDate: '2026-06-15', date: 'Jun 15', time: '8:00 PM', group: 'G', home: 'Iran', homeFlag: '🇮🇷', away: 'New Zealand', awayFlag: '🇳🇿', venue: 'SoFi Stadium', city: 'Los Angeles', homeScore: 2, awayScore: 2 },
  { num: 17, fullDate: '2026-06-16', date: 'Jun 16', time: '2:00 PM', group: 'I', home: 'France', homeFlag: '🇫🇷', away: 'Senegal', awayFlag: '🇸🇳', venue: 'MetLife Stadium', city: 'New York / NJ' },
  { num: 18, fullDate: '2026-06-16', date: 'Jun 16', time: '5:00 PM', group: 'I', home: 'Iraq', homeFlag: '🇮🇶', away: 'Norway', awayFlag: '🇳🇴', venue: 'Gillette Stadium', city: 'Boston' },
  { num: 19, fullDate: '2026-06-16', date: 'Jun 16', time: '8:00 PM', group: 'J', home: 'Argentina', homeFlag: '🇦🇷', away: 'Algeria', awayFlag: '🇩🇿', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { num: 20, fullDate: '2026-06-16', date: 'Jun 16', time: '11:00 PM', group: 'J', home: 'Austria', homeFlag: '🇦🇹', away: 'Jordan', awayFlag: '🇯🇴', venue: "Levi's Stadium", city: 'San Francisco' },
  { num: 21, fullDate: '2026-06-17', date: 'Jun 17', time: '12:00 PM', group: 'K', home: 'Portugal', homeFlag: '🇵🇹', away: 'DR Congo', awayFlag: '🇨🇩', venue: 'NRG Stadium', city: 'Houston' },
  { num: 22, fullDate: '2026-06-17', date: 'Jun 17', time: '3:00 PM', group: 'L', home: 'England', homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', away: 'Croatia', awayFlag: '🇭🇷', venue: 'AT&T Stadium', city: 'Dallas' },
  { num: 23, fullDate: '2026-06-17', date: 'Jun 17', time: '6:00 PM', group: 'L', home: 'Ghana', homeFlag: '🇬🇭', away: 'Panama', awayFlag: '🇵🇦', venue: 'BMO Field', city: 'Toronto' },
  { num: 24, fullDate: '2026-06-17', date: 'Jun 17', time: '9:00 PM', group: 'K', home: 'Uzbekistan', homeFlag: '🇺🇿', away: 'Colombia', awayFlag: '🇨🇴', venue: 'Estadio Azteca', city: 'Mexico City' },
  // ═══ MATCHDAY 2 ═══
  { num: 25, fullDate: '2026-06-18', date: 'Jun 18', time: '12:00 PM', group: 'A', home: 'Czechia', homeFlag: '🇨🇿', away: 'South Africa', awayFlag: '🇿🇦', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { num: 26, fullDate: '2026-06-18', date: 'Jun 18', time: '3:00 PM', group: 'B', home: 'Switzerland', homeFlag: '🇨🇭', away: 'Bosnia & Herzegovina', awayFlag: '🇧🇦', venue: 'SoFi Stadium', city: 'Los Angeles' },
  { num: 27, fullDate: '2026-06-18', date: 'Jun 18', time: '6:00 PM', group: 'B', home: 'Canada', homeFlag: '🇨🇦', away: 'Qatar', awayFlag: '🇶🇦', venue: 'BC Place', city: 'Vancouver' },
  { num: 28, fullDate: '2026-06-18', date: 'Jun 18', time: '9:00 PM', group: 'A', home: 'Mexico', homeFlag: '🇲🇽', away: 'South Korea', awayFlag: '🇰🇷', venue: 'Estadio Akron', city: 'Guadalajara' },
  { num: 29, fullDate: '2026-06-19', date: 'Jun 19', time: '2:00 PM', group: 'C', home: 'Brazil', homeFlag: '🇧🇷', away: 'Haiti', awayFlag: '🇭🇹', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { num: 30, fullDate: '2026-06-19', date: 'Jun 19', time: '6:00 PM', group: 'C', home: 'Scotland', homeFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', away: 'Morocco', awayFlag: '🇲🇦', venue: 'Gillette Stadium', city: 'Boston' },
  { num: 31, fullDate: '2026-06-19', date: 'Jun 19', time: '9:00 PM', group: 'D', home: 'Türkiye', homeFlag: '🇹🇷', away: 'Paraguay', awayFlag: '🇵🇾', venue: "Levi's Stadium", city: 'San Francisco' },
  { num: 32, fullDate: '2026-06-19', date: 'Jun 19', time: '3:00 PM', group: 'D', home: 'United States', homeFlag: '🇺🇸', away: 'Australia', awayFlag: '🇦🇺', venue: 'Lumen Field', city: 'Seattle' },
  { num: 33, fullDate: '2026-06-20', date: 'Jun 20', time: '4:00 PM', group: 'E', home: 'Germany', homeFlag: '🇩🇪', away: "Côte d'Ivoire", awayFlag: '🇨🇮', venue: 'BMO Field', city: 'Toronto' },
  { num: 34, fullDate: '2026-06-20', date: 'Jun 20', time: '7:00 PM', group: 'E', home: 'Ecuador', homeFlag: '🇪🇨', away: 'Curaçao', awayFlag: '🇨🇼', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { num: 35, fullDate: '2026-06-20', date: 'Jun 20', time: '12:00 PM', group: 'F', home: 'Netherlands', homeFlag: '🇳🇱', away: 'Sweden', awayFlag: '🇸🇪', venue: 'NRG Stadium', city: 'Houston' },
  { num: 36, fullDate: '2026-06-20', date: 'Jun 20', time: '10:00 PM', group: 'F', home: 'Tunisia', homeFlag: '🇹🇳', away: 'Japan', awayFlag: '🇯🇵', venue: 'Estadio BBVA', city: 'Monterrey' },
  { num: 37, fullDate: '2026-06-21', date: 'Jun 21', time: '12:00 PM', group: 'H', home: 'Spain', homeFlag: '🇪🇸', away: 'Saudi Arabia', awayFlag: '🇸🇦', venue: 'Hard Rock Stadium', city: 'Miami' },
  { num: 38, fullDate: '2026-06-21', date: 'Jun 21', time: '6:00 PM', group: 'H', home: 'Uruguay', homeFlag: '🇺🇾', away: 'Cape Verde', awayFlag: '🇨🇻', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { num: 39, fullDate: '2026-06-21', date: 'Jun 21', time: '3:00 PM', group: 'G', home: 'Belgium', homeFlag: '🇧🇪', away: 'Iran', awayFlag: '🇮🇷', venue: 'SoFi Stadium', city: 'Los Angeles' },
  { num: 40, fullDate: '2026-06-21', date: 'Jun 21', time: '6:00 PM', group: 'G', home: 'New Zealand', homeFlag: '🇳🇿', away: 'Egypt', awayFlag: '🇪🇬', venue: 'BC Place', city: 'Vancouver' },
  { num: 41, fullDate: '2026-06-22', date: 'Jun 22', time: '5:00 PM', group: 'I', home: 'France', homeFlag: '🇫🇷', away: 'Iraq', awayFlag: '🇮🇶', venue: 'MetLife Stadium', city: 'New York / NJ' },
  { num: 42, fullDate: '2026-06-22', date: 'Jun 22', time: '8:00 PM', group: 'I', home: 'Norway', homeFlag: '🇳🇴', away: 'Senegal', awayFlag: '🇸🇳', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { num: 43, fullDate: '2026-06-22', date: 'Jun 22', time: '12:00 PM', group: 'J', home: 'Argentina', homeFlag: '🇦🇷', away: 'Austria', awayFlag: '🇦🇹', venue: 'AT&T Stadium', city: 'Dallas' },
  { num: 44, fullDate: '2026-06-22', date: 'Jun 22', time: '8:00 PM', group: 'J', home: 'Jordan', homeFlag: '🇯🇴', away: 'Algeria', awayFlag: '🇩🇿', venue: "Levi's Stadium", city: 'San Francisco' },
  { num: 45, fullDate: '2026-06-23', date: 'Jun 23', time: '3:00 PM', group: 'L', home: 'England', homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', away: 'Ghana', awayFlag: '🇬🇭', venue: 'Gillette Stadium', city: 'Boston' },
  { num: 46, fullDate: '2026-06-23', date: 'Jun 23', time: '6:00 PM', group: 'L', home: 'Panama', homeFlag: '🇵🇦', away: 'Croatia', awayFlag: '🇭🇷', venue: 'BMO Field', city: 'Toronto' },
  { num: 47, fullDate: '2026-06-23', date: 'Jun 23', time: '12:00 PM', group: 'K', home: 'Portugal', homeFlag: '🇵🇹', away: 'Uzbekistan', awayFlag: '🇺🇿', venue: 'NRG Stadium', city: 'Houston' },
  { num: 48, fullDate: '2026-06-23', date: 'Jun 23', time: '9:00 PM', group: 'K', home: 'Colombia', homeFlag: '🇨🇴', away: 'DR Congo', awayFlag: '🇨🇩', venue: 'Estadio Akron', city: 'Guadalajara' },
  // ═══ MATCHDAY 3 ═══
  { num: 49, fullDate: '2026-06-24', date: 'Jun 24', time: '6:00 PM', group: 'C', home: 'Scotland', homeFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', away: 'Brazil', awayFlag: '🇧🇷', venue: 'Hard Rock Stadium', city: 'Miami' },
  { num: 50, fullDate: '2026-06-24', date: 'Jun 24', time: '6:00 PM', group: 'C', home: 'Morocco', homeFlag: '🇲🇦', away: 'Haiti', awayFlag: '🇭🇹', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { num: 51, fullDate: '2026-06-24', date: 'Jun 24', time: '3:00 PM', group: 'B', home: 'Switzerland', homeFlag: '🇨🇭', away: 'Canada', awayFlag: '🇨🇦', venue: 'BC Place', city: 'Vancouver' },
  { num: 52, fullDate: '2026-06-24', date: 'Jun 24', time: '3:00 PM', group: 'B', home: 'Bosnia & Herzegovina', homeFlag: '🇧🇦', away: 'Qatar', awayFlag: '🇶🇦', venue: 'Lumen Field', city: 'Seattle' },
  { num: 53, fullDate: '2026-06-24', date: 'Jun 24', time: '9:00 PM', group: 'A', home: 'Czechia', homeFlag: '🇨🇿', away: 'Mexico', awayFlag: '🇲🇽', venue: 'Estadio Azteca', city: 'Mexico City' },
  { num: 54, fullDate: '2026-06-24', date: 'Jun 24', time: '9:00 PM', group: 'A', home: 'South Africa', homeFlag: '🇿🇦', away: 'South Korea', awayFlag: '🇰🇷', venue: 'Estadio BBVA', city: 'Monterrey' },
  { num: 55, fullDate: '2026-06-25', date: 'Jun 25', time: '6:00 PM', group: 'D', home: 'Paraguay', homeFlag: '🇵🇾', away: 'Australia', awayFlag: '🇦🇺', venue: 'NRG Stadium', city: 'Houston' },
  { num: 56, fullDate: '2026-06-25', date: 'Jun 25', time: '6:00 PM', group: 'D', home: 'Türkiye', homeFlag: '🇹🇷', away: 'United States', awayFlag: '🇺🇸', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { num: 57, fullDate: '2026-06-25', date: 'Jun 25', time: '3:00 PM', group: 'E', home: 'Curaçao', homeFlag: '🇨🇼', away: "Côte d'Ivoire", awayFlag: '🇨🇮', venue: 'AT&T Stadium', city: 'Dallas' },
  { num: 58, fullDate: '2026-06-25', date: 'Jun 25', time: '3:00 PM', group: 'E', home: 'Ecuador', homeFlag: '🇪🇨', away: 'Germany', awayFlag: '🇩🇪', venue: 'MetLife Stadium', city: 'New York / NJ' },
  { num: 59, fullDate: '2026-06-25', date: 'Jun 25', time: '9:00 PM', group: 'F', home: 'Japan', homeFlag: '🇯🇵', away: 'Sweden', awayFlag: '🇸🇪', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { num: 60, fullDate: '2026-06-25', date: 'Jun 25', time: '9:00 PM', group: 'F', home: 'Tunisia', homeFlag: '🇹🇳', away: 'Netherlands', awayFlag: '🇳🇱', venue: 'Estadio Akron', city: 'Guadalajara' },
  { num: 61, fullDate: '2026-06-26', date: 'Jun 26', time: '3:00 PM', group: 'G', home: 'Belgium', homeFlag: '🇧🇪', away: 'New Zealand', awayFlag: '🇳🇿', venue: 'Lumen Field', city: 'Seattle' },
  { num: 62, fullDate: '2026-06-26', date: 'Jun 26', time: '3:00 PM', group: 'G', home: 'Iran', homeFlag: '🇮🇷', away: 'Egypt', awayFlag: '🇪🇬', venue: 'BC Place', city: 'Vancouver' },
  { num: 63, fullDate: '2026-06-26', date: 'Jun 26', time: '7:00 PM', group: 'H', home: 'Spain', homeFlag: '🇪🇸', away: 'Uruguay', awayFlag: '🇺🇾', venue: 'Estadio Azteca', city: 'Mexico City' },
  { num: 64, fullDate: '2026-06-26', date: 'Jun 26', time: '7:00 PM', group: 'H', home: 'Cape Verde', homeFlag: '🇨🇻', away: 'Saudi Arabia', awayFlag: '🇸🇦', venue: 'Estadio Akron', city: 'Guadalajara' },
  { num: 65, fullDate: '2026-06-26', date: 'Jun 26', time: '3:00 PM', group: 'I', home: 'France', homeFlag: '🇫🇷', away: 'Norway', awayFlag: '🇳🇴', venue: 'Gillette Stadium', city: 'Boston' },
  { num: 66, fullDate: '2026-06-26', date: 'Jun 26', time: '3:00 PM', group: 'I', home: 'Senegal', homeFlag: '🇸🇳', away: 'Iraq', awayFlag: '🇮🇶', venue: 'Hard Rock Stadium', city: 'Miami' },
  { num: 67, fullDate: '2026-06-27', date: 'Jun 27', time: '5:00 PM', group: 'L', home: 'Panama', homeFlag: '🇵🇦', away: 'England', awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', venue: 'MetLife Stadium', city: 'New York / NJ' },
  { num: 68, fullDate: '2026-06-27', date: 'Jun 27', time: '5:00 PM', group: 'L', home: 'Croatia', homeFlag: '🇭🇷', away: 'Ghana', awayFlag: '🇬🇭', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { num: 69, fullDate: '2026-06-27', date: 'Jun 27', time: '9:00 PM', group: 'J', home: 'Jordan', homeFlag: '🇯🇴', away: 'Argentina', awayFlag: '🇦🇷', venue: 'AT&T Stadium', city: 'Dallas' },
  { num: 70, fullDate: '2026-06-27', date: 'Jun 27', time: '9:00 PM', group: 'J', home: 'Algeria', homeFlag: '🇩🇿', away: 'Austria', awayFlag: '🇦🇹', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { num: 71, fullDate: '2026-06-27', date: 'Jun 27', time: '6:30 PM', group: 'K', home: 'Colombia', homeFlag: '🇨🇴', away: 'Portugal', awayFlag: '🇵🇹', venue: 'Hard Rock Stadium', city: 'Miami' },
  { num: 72, fullDate: '2026-06-27', date: 'Jun 27', time: '6:30 PM', group: 'K', home: 'DR Congo', homeFlag: '🇨🇩', away: 'Uzbekistan', awayFlag: '🇺🇿', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
];

export const KNOCKOUT_MATCHES: KnockoutMatch[] = [
  // Round of 32
  { num: 73, fullDate: '2026-06-28', date: 'Jun 28', time: '3:00 PM', stage: 'R32', home: '2nd Group A', away: '2nd Group B', venue: 'SoFi Stadium', city: 'Los Angeles' },
  { num: 74, fullDate: '2026-06-29', date: 'Jun 29', time: '4:30 PM', stage: 'R32', home: '1st Group E', away: '3rd Place', venue: 'Gillette Stadium', city: 'Boston' },
  { num: 75, fullDate: '2026-06-29', date: 'Jun 29', time: '9:00 PM', stage: 'R32', home: '1st Group F', away: '2nd Group C', venue: 'Estadio BBVA', city: 'Monterrey' },
  { num: 76, fullDate: '2026-06-29', date: 'Jun 29', time: '1:00 PM', stage: 'R32', home: '1st Group C', away: '2nd Group F', venue: 'NRG Stadium', city: 'Houston' },
  { num: 77, fullDate: '2026-06-30', date: 'Jun 30', time: '5:00 PM', stage: 'R32', home: '1st Group I', away: '3rd Place', venue: 'MetLife Stadium', city: 'New York / NJ' },
  { num: 78, fullDate: '2026-06-30', date: 'Jun 30', time: '1:00 PM', stage: 'R32', home: '2nd Group E', away: '2nd Group I', venue: 'AT&T Stadium', city: 'Dallas' },
  { num: 79, fullDate: '2026-06-30', date: 'Jun 30', time: '9:00 PM', stage: 'R32', home: '1st Group A', away: '3rd Place', venue: 'Estadio Azteca', city: 'Mexico City' },
  { num: 80, fullDate: '2026-07-01', date: 'Jul 1', time: '12:00 PM', stage: 'R32', home: '1st Group L', away: '3rd Place', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { num: 81, fullDate: '2026-07-01', date: 'Jul 1', time: '8:00 PM', stage: 'R32', home: '1st Group D', away: '3rd Place', venue: "Levi's Stadium", city: 'San Francisco' },
  { num: 82, fullDate: '2026-07-01', date: 'Jul 1', time: '4:00 PM', stage: 'R32', home: '1st Group G', away: '3rd Place', venue: 'Lumen Field', city: 'Seattle' },
  { num: 83, fullDate: '2026-07-02', date: 'Jul 2', time: '3:00 PM', stage: 'R32', home: '1st Group H', away: '2nd Group J', venue: 'SoFi Stadium', city: 'Los Angeles' },
  { num: 84, fullDate: '2026-07-02', date: 'Jul 2', time: '7:00 PM', stage: 'R32', home: '2nd Group K', away: '2nd Group L', venue: 'BMO Field', city: 'Toronto' },
  { num: 85, fullDate: '2026-07-02', date: 'Jul 2', time: '11:00 PM', stage: 'R32', home: '1st Group B', away: '3rd Place', venue: 'BC Place', city: 'Vancouver' },
  { num: 86, fullDate: '2026-07-03', date: 'Jul 3', time: '2:00 PM', stage: 'R32', home: '2nd Group D', away: '2nd Group G', venue: 'AT&T Stadium', city: 'Dallas' },
  { num: 87, fullDate: '2026-07-03', date: 'Jul 3', time: '6:00 PM', stage: 'R32', home: '1st Group J', away: '2nd Group H', venue: 'Hard Rock Stadium', city: 'Miami' },
  { num: 88, fullDate: '2026-07-03', date: 'Jul 3', time: '9:30 PM', stage: 'R32', home: '1st Group K', away: '3rd Place', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  // Round of 16
  { num: 89, fullDate: '2026-07-04', date: 'Jul 4', time: '5:00 PM', stage: 'R16', home: 'R32 Winner', away: 'R32 Winner', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { num: 90, fullDate: '2026-07-04', date: 'Jul 4', time: '1:00 PM', stage: 'R16', home: 'R32 Winner', away: 'R32 Winner', venue: 'NRG Stadium', city: 'Houston' },
  { num: 91, fullDate: '2026-07-05', date: 'Jul 5', time: '4:00 PM', stage: 'R16', home: 'R32 Winner', away: 'R32 Winner', venue: 'MetLife Stadium', city: 'New York / NJ' },
  { num: 92, fullDate: '2026-07-05', date: 'Jul 5', time: '8:00 PM', stage: 'R16', home: 'R32 Winner', away: 'R32 Winner', venue: 'Estadio Azteca', city: 'Mexico City' },
  { num: 93, fullDate: '2026-07-06', date: 'Jul 6', time: '3:00 PM', stage: 'R16', home: 'R32 Winner', away: 'R32 Winner', venue: 'AT&T Stadium', city: 'Dallas' },
  { num: 94, fullDate: '2026-07-06', date: 'Jul 6', time: '5:00 PM', stage: 'R16', home: 'R32 Winner', away: 'R32 Winner', venue: 'Lumen Field', city: 'Seattle' },
  { num: 95, fullDate: '2026-07-07', date: 'Jul 7', time: '12:00 PM', stage: 'R16', home: 'R32 Winner', away: 'R32 Winner', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { num: 96, fullDate: '2026-07-07', date: 'Jul 7', time: '4:00 PM', stage: 'R16', home: 'R32 Winner', away: 'R32 Winner', venue: 'BC Place', city: 'Vancouver' },
  // Quarterfinals
  { num: 97, fullDate: '2026-07-09', date: 'Jul 9', time: '4:00 PM', stage: 'QF', home: 'R16 Winner', away: 'R16 Winner', venue: 'Gillette Stadium', city: 'Boston' },
  { num: 98, fullDate: '2026-07-10', date: 'Jul 10', time: '3:00 PM', stage: 'QF', home: 'R16 Winner', away: 'R16 Winner', venue: 'SoFi Stadium', city: 'Los Angeles' },
  { num: 99, fullDate: '2026-07-11', date: 'Jul 11', time: '5:00 PM', stage: 'QF', home: 'R16 Winner', away: 'R16 Winner', venue: 'Hard Rock Stadium', city: 'Miami' },
  { num: 100, fullDate: '2026-07-11', date: 'Jul 11', time: '9:00 PM', stage: 'QF', home: 'R16 Winner', away: 'R16 Winner', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  // Semifinals
  { num: 101, fullDate: '2026-07-14', date: 'Jul 14', time: '3:00 PM', stage: 'SF', home: 'QF Winner', away: 'QF Winner', venue: 'AT&T Stadium', city: 'Dallas' },
  { num: 102, fullDate: '2026-07-15', date: 'Jul 15', time: '3:00 PM', stage: 'SF', home: 'QF Winner', away: 'QF Winner', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  // Third Place
  { num: 103, fullDate: '2026-07-18', date: 'Jul 18', time: '5:00 PM', stage: '3RD', home: 'SF Loser', away: 'SF Loser', venue: 'Hard Rock Stadium', city: 'Miami' },
  // Final
  { num: 104, fullDate: '2026-07-19', date: 'Jul 19', time: '3:00 PM', stage: 'FINAL', home: 'SF Winner', away: 'SF Winner', venue: 'MetLife Stadium', city: 'New York / NJ' },
];
