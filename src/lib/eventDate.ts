/** Formats the venue's calendar date without shifting it across time zones. */
export function formatVenueDate(value: string, options: Intl.DateTimeFormatOptions = {}) {
  const calendarDate = value.includes('T') ? value.slice(0, 10) : value;
  return new Date(`${calendarDate}T12:00:00`).toLocaleDateString('en-US', options);
}
